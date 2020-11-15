import EventBus from "./EventBus"
class BaseNode {
    constructor(fullPath, reNameDefaultMenu = null) {
        this.childs = [];
        this.parent = null;
        this.contextMenuItems = this.defaultContextMenu;
        this.fullPath = fullPath;
        this.disableAdd = false;
        this.disableDelete = false;
        this.disableReName = false;
        if (reNameDefaultMenu && this.contextMenuItems) {//更新默认的菜单栏名称
            reNameDefaultMenu.forEach(element => {
                this.contextMenuItems.forEach(item => {
                    if (element.action === item.action) {
                        item.label = element.newName;
                    }
                });
            });
        }
        this.EventBus = new EventBus();
        this._name =this.getName(fullPath);
    }
    defaultContextMenu = [
        { action: 'removeNode', label: '删除节点', disabled: this.disableDelete, logo: "delete.png" },
        { action: 'appendChild', label: '添加子节点', disabled: this.disableAdd, logo: "add.png" },
        { action: 'renaming', label: '重命名', disabled: this.disableReName, logo: "default.png" }];
    get name() {     
        return _name;
    }
    set name(v) {
        if (this.checkName(v)) {
            this._name = v;
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
    removeNode() {
        if (this.parent) {
            this.parent.childs.forEach((child, index) => {
                if (child.name === this.name) {
                    this.parent.childs.splice(index, 1);
                }
            });

        }
    }
    appendChild(node) {
        if (this.parent) {
            if (checkName(node.name)) {
                this.parent.childs.push(node);
            }
        }
    }

    registerMenu(menus) {
        if (menus) {
            menus.forEach(element => {
                if (element.fn) {
                    this.EventBus.listen(element.action, element.fn)
                }
                this.contextMenuItems.push(element);
            });
        }
    }
    execute(name, params) {
        this.EventBus.trigger(name, params);
    }
    checkName(str) {
        let result = true;
        if (this.parent) {
            this.parent.childs.forEach(child => {
                if (child.name === str)
                    result = false;
            });
        }
        return result;
    }
}
module.exports = BaseNode;