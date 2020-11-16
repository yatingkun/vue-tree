class BaseMenuItem{
    constructor(obj){
         this.action=obj.action;
         this.label=obj.label;
         this.disabled=obj.disabled; 
         this.logo=obj.logo;
         this.parent=obj.parent;
    }
}
export default BaseMenuItem;