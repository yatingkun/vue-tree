
class MenuEventBus {
    constructor(content) {
        this.self=content;//当前上下文
        this.actions = [];//存储发布的事件集合
    }
     listen(eName, callback) {
        let isNew = true;
        this.actions.forEach(element => {
            if (element.key === eName) {
                element.cb = callback;
                isNew = false;
            }
        });
        if (isNew) {
            let obj = {};
            obj.key = eName;
            obj.cb = callback;
            this.actions.push(obj);
        }
    }
     trigger(eName, params) {
        this.actions.forEach(item => {
            if (item.key === eName) {
                item.cb.call(this.self, params);
            }
        })
    }
  
     unListen(eName) {
        let func = this.actions.slice();
        func.forEach((element, index) => {
            if (element.key === eName) {
                this.actions.splice(index, 1);
            }
        });
    }
}
export default MenuEventBus;
