import MenuEventBus from "./base_menuEvent";
import MenuItem from "./base_menuItem";
class BaseNode {
    constructor(fullPath, reNameDefaultMenu = null) {
        this.childs = [];
        this.parent = null;
        this.contextMenuItems = this.defaultContextMenu;
        this.fullPath = fullPath;
        this.disableAdd = false;
        this.disableDelete = false;
        this.disableReName = false;
        this.IsExpanded = false;
        this.selected=false;
        if (reNameDefaultMenu && this.contextMenuItems) {//更新默认的菜单栏名称
            reNameDefaultMenu.forEach(element => {
                this.contextMenuItems.forEach(item => {
                    if (element.action === item.action) {
                        item.label = element.newName;
                    }
                });
            });
        }
        this.MenuEventBus = new MenuEventBus(this);
       this.defaultNewName="newGroup";
    }
    defaultContextMenu=[
        new MenuItem({action: 'removeNode', label: '删除节点', disabled: this.disableDelete, logo: "delete.png",parent:this.parent}),
        new MenuItem({action: 'appendChild', label: '添加子节点', disabled: this.disableAdd, logo: "add.png",parent:this.parent}),
        new MenuItem({action: 'renaming', label: '重命名', disabled: this.disableReName, logo: "default.png",parent:this.parent}),
    ];
    get name() {
        return this.getName(this.fullPath);
    }
    set name(v) {
        if (this.checkSelfName(v)) {
            if(this.parent){
                this.fullPath=this.parent.fullPath+"."+v;
            }        
        }
    }
    getName(str) {
        let result;
        if (str) {
            let arr = this.fullPath.split(".");
            result = arr[arr.length - 1];
        }
        return result;
    }
    appendChild() {
        let newNode=this.createNewNode();
        if(!newNode) return null;
        newNode.parent = this;
        newNode.selected=true;
        newNode.name = this.GetNewGroupName(this.defaultNewName, 1);
        this.childs.push(newNode);
        return newNode;
    }
    deleteNode(){
        if(this.parent){
            this.parent.childs.forEach((child,index) => {
                if(child.name===this.name){
                    this.parent.childs.splice(index, 1);
                }

            });
        }
    }
    registerMenu(menu,fn) {
        if (menu) {        
                this.MenuEventBus.listen(menu.action,fn);
                this.contextMenuItems.push(menu);
        }
    }
    execute(name, params) {
        this.MenuEventBus.trigger(name, params);
    }
    checkChildName(str) {
        let result = true;
        if (this.childs) {
            this.childs.forEach(child => {
                if (child.name === str)
                    result = false;
            });
        }
        return result;
    }
    checkSelfName(str){
        let result = true;
        if (this.parent) {
            this.parent.childs.forEach(child => {
                if (child.name === str)
                    result = false;
            });
        }
        return result;
    }
      GetNewGroupName(strName,num)
    {
        let name = strName;
        if (name == null || name.replace(/\s*/g,"") == "")
        {
            name = this.defaultNewName;
        }
        try
        {
            //拼接名字
            name = name + num;
            if (!this.checkChildName(name))//判断同级下是否存在相同的名字
            {
                //如果存在，则递归
                name = this.GetNewGroupName(strName, num + 1);
            }
        }
        catch (e)
        {
            console.log(e);
        }
        return name;
    }
    createNewNode(){//要创建自己的自定义节点需要重写该方法返回
        return new BaseNode();
    }
}
export default BaseNode;