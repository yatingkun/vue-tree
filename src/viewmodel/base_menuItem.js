class BaseMenuItem{
    constructor(obj){
         this.actionName=obj.actionName;
         this.label=obj.label;
         this.disabled=obj.disabled; 
         this.logo=obj.logo;
         this.fn=obj.fn;
    }
}
export default BaseMenuItem;