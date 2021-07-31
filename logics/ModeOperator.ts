/// <reference path="ModeBinding.ts" />
class ModeOperator{
    currentModeBinding:ModeBinding;
    constructor() {
        this.currentModeBinding = undefined;
        document.querySelector("#return-to-default-mode").addEventListener("click", ()=>{
            this.switchModeOn(undefined);
        });
    }
    //return current mode id
    async initialize():Promise<string>{
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(["current_mode"],items=>{
                resolve(items["current_mode"]);
            });
        });
    }
    async switchModeOn(mode:ModeBinding){
        let close_tabIds:number[];
        let creatingTabsCount:number;
        if(this.currentModeBinding){
            close_tabIds = await this.currentModeBinding.switchModeOff();
        }
        else {
            close_tabIds = [];
            let tabs = await chrome.tabs.query({});
            close_tabIds.push(tabs.length);
            for(let i = 0; i < tabs.length; i++){
                if(ModeBinding.ingoreWebsite(tabs[i].url)){
                    continue;
                }
                close_tabIds.push(tabs[i].id);
            }
            let btn = document.querySelector<HTMLButtonElement>("#default-mode");
            btn.classList.remove("current");
            btn.disabled = false;
        }
        if(mode){
            creatingTabsCount = mode.switchModeOn();
        }
        else{
            creatingTabsCount = 0;
            let btn = document.querySelector<HTMLButtonElement>("#default-mode");
            btn.classList.add("current");
            btn.disabled = true;
        }
        //tabs' count when complete this function
        let tabsCountAfter = close_tabIds[0] + creatingTabsCount - close_tabIds.length + 1;
        if(tabsCountAfter === 0) chrome.tabs.create({});
        for(let i = 1; i < close_tabIds.length; i++){
            chrome.tabs.remove(close_tabIds[i]);
        }
        if(mode){
            chrome.storage.local.set({["current_mode"]:mode.ModeID}, null);
        }
        else{
            chrome.storage.local.remove(["current_mode"], null);
        }
    }
}