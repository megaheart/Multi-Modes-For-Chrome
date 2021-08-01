/// <reference path="Mode.ts" />
/// <reference path="SettingInfo.ts" />

class DataManager{
    private s:string;
    private BASE:number;
    private modeKeyList:string[];
    constructor() {
        this.s = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.BASE = this.s.length;
        this.modeKeyList = undefined;
    }
    getSettingInfo():Promise<SettingInfo>{
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(["settingInfo"], (items)=>{
                resolve(items["settingInfo"] ? items["settingInfo"] : {ignoreWebsites:[]});
            });
        });
    }
    saveSettingInfo(info: SettingInfo){
        chrome.storage.local.set({["settingInfo"]:info});
    }
    private generateID():string{
        let nid = Date.now();
        let id = "";
        while(nid > 0){
            id = this.s[nid%this.BASE] + id;
            nid=Math.floor(nid/this.BASE);
        }
        return id;
    }
    private async getAllKeysOfModes():Promise<string[]>{
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(["mode_id_list"], (items)=>{
                resolve(items["mode_id_list"]);
            });
        });
    }
    async getMode(id:string):Promise<Mode>{
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([id], (items)=>{
                if(items[id]){
                    let o = items[id] as Mode;
                    resolve(o);
                }
                else resolve(undefined);
            });
        });
    }
    saveMode(mode:Mode){
        if(this.modeKeyList === undefined){
            throw new Error("Please use getAllModes() or getAllModeIds() first.");
        }
        if((mode.id == undefined) || !this.modeKeyList.includes(mode.id)){
            mode.id = "-" + this.generateID();
            this.modeKeyList.unshift(mode.id);
            chrome.storage.local.set({["mode_id_list"]:this.modeKeyList});
        }
        chrome.storage.local.set({[mode.id]: mode}, null);
    }
    importManyMode(modes:Mode[]){
        for(let i = 0; i < modes.length; i++){
            if(this.modeKeyList === undefined){
                throw new Error("Please use getAllModes() first.");
            }
            if(!this.modeKeyList.includes(modes[i].id)){
                this.modeKeyList.push(modes[i].id);
                chrome.storage.local.set({[modes[i].id]: modes[i]}, null);
            }
        }
        chrome.storage.local.set({["mode_id_list"]:this.modeKeyList});
    }
    removeMode(mode:Mode){
        let index = this.modeKeyList.indexOf(mode.id);
        if(index >= 0){
            this.modeKeyList.splice(index, 1);
            chrome.storage.local.set({["mode_id_list"]:this.modeKeyList});
            chrome.storage.local.remove([mode.id], null);
        }
    }
    async getAllModeIds():Promise<string[]>{
        if(this.modeKeyList === undefined){
            let keys = await this.getAllKeysOfModes();
            if(keys) {
                this.modeKeyList = keys;
            }
            else this.modeKeyList = [];
        }
        return this.modeKeyList;
    }
    async getAllModes():Promise<Mode[]>{
        if(this.modeKeyList === undefined){
            this.getAllModeIds();
        }
        if(this.modeKeyList.length === 0) return;
        let keys = this.modeKeyList;
        let modes = [];
        for(var i = 0; i < keys.length; i++){
            let mode = await this.getMode(keys[i]);
            if(mode === undefined) {
                this.modeKeyList.splice(i,1);
                chrome.storage.local.set({["mode_id_list"]:this.modeKeyList});
                i--;
                continue;
            }
            modes.push(mode);
        }
        return modes;
    }
    
}