/// <reference path="logics/CreateNewModeLogic.ts" />
/// <reference path="logics/ModeBinding.ts" />

let dataManager = new DataManager();
let modeOperator = new ModeOperator();
async function Main() {
    let settingInfo = await dataManager.getSettingInfo();
    let createNewModeLogic = new CreateNewModeLogic(dataManager, settingInfo);
    ModeBinding.modeOperator = modeOperator;
    ModeBinding.settingInfo = settingInfo;
    WebsiteListBinding.template = document.querySelector("#group-website-template");
    let currentModeIdSync = modeOperator.initialize();
    document.querySelector("#load-to-new-mode-button").addEventListener("click", ()=>{
        createNewModeLogic.togglePanel();
    });
    let modeList = await dataManager.getAllModes();
    let currentModeId = await currentModeIdSync;
    for(var i = 0; i < modeList.length; i++){
        let binding = ModeBinding.insertNewModeAtSecondOfGroupView(modeList[i], dataManager);
        if(currentModeId == modeList[i].id){
            let ele:HTMLDivElement|HTMLButtonElement = document.querySelector<HTMLDivElement>("#m-" + (await currentModeIdSync));
            ele.classList.add("current");
            ele = ele.querySelector<HTMLButtonElement>('.switch-mode-on');
            ele.disabled = true;
            modeOperator.currentModeBinding = binding;
        }
    }
    if(currentModeId === undefined){
        let ele:HTMLDivElement|HTMLButtonElement= document.querySelector<HTMLDivElement>("#default-mode");
        ele.classList.add("current");
        ele = ele.querySelector<HTMLButtonElement>('.switch-mode-on');
        ele.disabled = true;
    }
    // let listAsync = chrome.tabs.query({currentWindow: true});
    // let mainDiv = document.querySelector("div#main");
    
    // let list = await listAsync;
    // list.forEach(e =>{
        
    // });
}
Main();
