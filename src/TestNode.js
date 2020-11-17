import BaseNode from './viewmodel/base_node'
class TestNode extends BaseNode {
    constructor(proper) {
        super(proper);
        this.defaultNewName="newGroup"
    }
    deleteNode(){
        BaseNode.prototype.deleteNode.call(this);//可以先执行父类的deleteNode()
    }
    createNewNode(){
        return new TestNode();
    }
}
export default TestNode;