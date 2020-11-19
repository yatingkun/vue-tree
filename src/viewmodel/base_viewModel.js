import MenuEventBus from "./base_menuEvent";
import MenuItem from "./base_menuItem";
class BaseViewModel {
    constructor(paths) {
        this.paths = paths;
        this.menuEventBus = new MenuEventBus(this);
        this.rootNodes = [];
        this.defaultMenuItem = { actionName: 'myAction', label: '自定义操作', disabled: false, logo: "delete.png" , fn: this.myAction };

    }
    registerMenu(currentNode, obj) {
        let menu = new MenuItem(obj);
        if (menu && currentNode) {
            this.menuEventBus.listen(menu.actionName, menu.fn);
            currentNode.contextMenuItems.push(menu);
        }
    }
    registerDefault(node) {
        this.registerMenu(node, this.defaultMenuItem);
        if (node.childs) {
            node.childs.forEach(child => {
                this.registerDefault(child);
            });
        }

    }
    execute(name, params) {
        this.menuEventBus.trigger(name, params);
    }
    loadModel() {//注册默认的菜单
        this.rootNodes.forEach(node => {
            this.registerDefault(node);
        });
       
    }
    myAction(node) {
        console.log(node);
    }
}
export default BaseViewModel;