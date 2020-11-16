import BaseNode from './viewmodel/base_node'
class TestNode extends BaseNode {
    constructor(proper) {
        super(proper);
    }
    deleteNode(){
        BaseNode.prototype.deleteNode.call(this);//可以先执行父类的deleteNode()
        console.log("执行了重写的删除逻辑啊");
    }
}
export default TestNode;