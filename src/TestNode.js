import BaseNode from './viewmodel/base_node'
class TestNode extends BaseNode {
    constructor(proper) {
        super(proper);
    }
    deleteNode(){
        console.log("这是重写的删除方法");
    }
}
export default TestNode;