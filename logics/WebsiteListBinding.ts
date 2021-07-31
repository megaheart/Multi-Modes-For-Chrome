/// <reference path="Website.ts" />
// Logic of .group-editor-main > .websites-area > ul
class WebsiteListBinding{
    private items:Website[];
    private uList:HTMLUListElement;
    private _disableButtons:boolean;
    static template:HTMLTemplateElement;
    constructor(uList:HTMLUListElement) {
        this.items = [];
        this.uList = uList;
        this._disableButtons = false;
    }
    set disableButtons(value:boolean){
        if(this._disableButtons!=value){
            if(value){
                this.uList.querySelectorAll<HTMLButtonElement>("button.remove-website-from-mode").forEach(e=>{
                    e.disabled = true;
                });
            }
            else{
                this.uList.querySelectorAll<HTMLButtonElement>("button.remove-website-from-mode").forEach(e=>{
                    e.disabled = false;
                });
            }
            this._disableButtons = value;
        }
    }
    getElementAt(i:number):Website{
        return this.items[i];
    }
    get length():number{
        return this.items.length;
    }
    forEach(enumirator:(e:Website)=>void):void{
        this.items.forEach(enumirator);
    }
    private generateElement(value:Website):HTMLLIElement{
        let li = WebsiteListBinding.template.content.firstElementChild.cloneNode(true) as HTMLLIElement;
        li.querySelector<HTMLImageElement>("img.favicon").src = 'https://www.google.com/s2/favicons?domain=' + value.url;
        li.querySelector<HTMLSpanElement>("span.website-title").textContent = value.title;
        let btn = li.querySelector<HTMLButtonElement>("button.remove-website-from-mode");
        btn.disabled = this._disableButtons;
        btn.addEventListener("click", ()=>{
            this.removeAt(this.items.indexOf(value));
        });
        return li;
    }
    insert(index:number, value:Website):void{
        if(index > this.items.length || index < 0) 
            throw new RangeError("Index (" + index +") is out of range [0.." + this.length + "]");
        else if(index == this.items.length){
            this.uList.appendChild(this.generateElement(value));
        }
        else{
            this.uList.insertBefore(this.generateElement(value), this.uList.children[index]);
        }
        this.items.splice(index, 0 , value);
    }
    add(value:Website):void{
        this.uList.appendChild(this.generateElement(value));
        this.items.push(value);
    }
    removeAt(index:number){
        this.uList.children[index].remove();
        this.items.splice(index, 1);
    }
    //Return old Websites' array
    clearAllItem():Website[]{
        this.uList.textContent = '';
        return this.items.splice(0, this.items.length);
    }
}