class BaseNode {
    constructor(fullPath, reNameDefaultMenu = null) {
        this.childs = [];
        this.parent = null;
        this.contextMenuItems = [];
        this._fullPath = fullPath;
        this.disableAdd = false;
        this.disableDelete = false;
        this.disableReName = false;
        this.IsExpanded = false;
        this.selected = false;
        if (reNameDefaultMenu && this.contextMenuItems) {//更新默认的菜单栏名称
            reNameDefaultMenu.forEach(element => {
                this.contextMenuItems.forEach(item => {
                    if (element.action === item.action) {
                        item.label = element.newName;
                    }
                });
            });
        }
        this.defaultNewName = "newGroup";
    }
    get name() {
        return this.getName(this._fullPath);
    }
    set name(v) {
        if (this.checkSelfName(v)) {
            if (this.parent) {
                this._fullPath = this.parent.fullPath + "." + v;
            }
        }
    }
    set fullPath(v) {
        this._fullPath = v;
    }
    get fullPath() {
        return this.parent ? this.parent.fullPath + `.${this.name}` : this.name;
    }
    getName(str) {
        let result;
        if (str) {
            let arr = this._fullPath.split(".");
            result = arr[arr.length - 1];
        }
        return result;
    }
    appendChild() {
        let newNode = this.createNewNode();
        if (!newNode) return null;
        newNode.parent = this;
        newNode.selected = true;
        newNode.name = this.GetNewGroupName(this.defaultNewName, 1);
        this.childs.push(newNode);
        return newNode;
    }
    deleteNode(index = -1) {
        if (this.parent) {
            if (index !== -1) {
                this.parent.childs.splice(index, 1);
            } else {
                this.parent.childs.forEach((child, index) => {
                    if (child.name === this.name) {
                        this.parent.childs.splice(index, 1);
                    }
                });
            }
        }

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
    checkSelfName(str) {
        let result = true;
        if (this._parent) {
            this.parent.childs.forEach(child => {
                if (child.name === str)
                    result = false;
            });
        }
        return result;
    }
    GetNewGroupName(strName, num) {
        let name = strName;
        if (name == null || name.replace(/\s*/g, "") == "") {
            name = this.defaultNewName;
        }
        try {
            //拼接名字
            name = name + num;
            if (!this.checkChildName(name))//判断同级下是否存在相同的名字
            {
                //如果存在，则递归
                name = this.GetNewGroupName(strName, num + 1);
            }
        }
        catch (e) {
            console.log(e);
        }
        return name;
    }
    createNewNode() {//要创建自己的自定义节点需要重写该方法返回
        return new BaseNode();
    }
}
export default BaseNode;