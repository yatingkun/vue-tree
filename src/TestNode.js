import BaseNode from './viewmodel/base_node'
class TestNode extends BaseNode {
    constructor(proper) {
        super(proper);
        this.defaultNewName="newGroup"
    }
    createNewNode(){
        return new TestNode();
    }
}
export default TestNode;