
class EventBus {
    constructor() {
        this.actions = [];//存储发布的事件集合
    }
     listen(eName, callback, listener) {
        let isNew = true;
        this.actions.forEach(element => {
            if (element.key === eName && element.listener === listener) {
                element.cb = callback;
                isNew = false;
            }
        });
        if (isNew) {
            let obj = {};
            obj.key = eName;
            obj.cb = callback;
            obj.listener = listener;
            this.actions.push(obj);
        }
    }
     trigger(eName, params) {
        this.actions.forEach(item => {
            if (item.key === eName) {
                item.cb.call(this, params);
            }
        })
    }
  
     unListen(eName, listener) {
        let func = this.actions.slice();
        func.forEach((element, index) => {
            if (element.key === eName && element.listener === listener) {
                this.actions.splice(index, 1);
            }
        });
    }
}
export default EventBus;
