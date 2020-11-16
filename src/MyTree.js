import BaseNode from './TestNode';
import MenuItem from './viewmodel/base_menuItem'
class Mytree {
    constructor(paths) {
        this.paths = paths;
        this.nodes = [];
        this.creatTree(this.paths);
    }
    newAction=function(){
        console.log(this,"新的骚操作!上下文定向到选中节点");
    }
    creatTree(paths) {
        if (!paths)
            return;
        for (let index = 0; index < paths.length; index++) {
            const fullPath = paths[index];
            this.creatNodes(fullPath);
        }

    }

    showContextMenu() {

    }
    nodeSelect() {

    }
    creatNodes(fullPath) {
        if (!fullPath)
            return;
        let arrGroupName = fullPath.split('.'); //分割组名
        if (arrGroupName.length <= 0) {
            return;
        }

        for (let i = 0; i < arrGroupName.length; i++) {
            let parentFullPathToRootName = this.stringJoin(arrGroupName, ".", i); //即将要创建节点的父节点的全路径名
            let Name = arrGroupName[i]; //即将要创建的节点名
            let fullPathToRootName = ""; //即将要创建的节点到根节点的全路径名（含即将要创建的节点名）
            if (!parentFullPathToRootName || parentFullPathToRootName === "") {
                //此处拼接出的parentFullPathToRootName为空，代表是根节点
                fullPathToRootName = Name;
            } else {
                fullPathToRootName = parentFullPathToRootName + "." + Name;
            }

            let newTreeNodeBaseViewModel = null;
            //判断即将要创建的节点是否已经存在，存在，则不创建
            if (this.GetTreeNodeWithFullPathNameToRoot(this.nodes, fullPathToRootName.split('.'), 0) === null) {
                //创建新节点
                newTreeNodeBaseViewModel = new BaseNode(fullPathToRootName);
                //获取父节点
                let parentTreeNodeBaseViewModel = this.GetTreeNodeWithFullPathNameToRoot(this.nodes, parentFullPathToRootName.split('.'), 0);

                if (parentTreeNodeBaseViewModel != null) {
                    newTreeNodeBaseViewModel.parent=parentTreeNodeBaseViewModel;
                newTreeNodeBaseViewModel.registerMenu( new MenuItem({action: 'newAction', label: '新的骚操作', disabled: false, logo: "delete.png"}),this.newAction);
                    parentTreeNodeBaseViewModel.appendChild(newTreeNodeBaseViewModel); //往父节点里面添加一个子节点
                } else {
                    //要创建的节点树里面没有，且找不到父节点。代表当前新增的节点为根节点
                    this.nodes.push(newTreeNodeBaseViewModel);
                    newTreeNodeBaseViewModel.IsExpanded = true; //根节点默认展开
                }
            }
        }
    }
    GetTreeNodeWithFullPathNameToRoot(treeViewNodes, arrSplitGroupName, treeLevel) {
        if (treeViewNodes === null || treeViewNodes.Count <= 0 || arrSplitGroupName.length <= 0 || treeLevel < 0) {
            return null;
        }
        let treeNodeViewModel = null;
        try {
            for (let index = 0; index < treeViewNodes.length; index++) {
                const node = treeViewNodes[index];
                if (node.name === arrSplitGroupName[treeLevel] && arrSplitGroupName.length - 1 == treeLevel) {
                    //同级别下，名字相等，且已到了查找的最后的一层级，则返回找到的结果
                    treeNodeViewModel = node;
                    break;
                } else if (node.name == arrSplitGroupName[treeLevel] && arrSplitGroupName.length - 1 != treeLevel) {
                    //同级别下，找到了名字相等的，但还没到arrSplitGroupName的最后一级，则递归查找下一级
                    treeLevel++;
                    treeNodeViewModel = this.GetTreeNodeWithFullPathNameToRoot(node.childs, arrSplitGroupName, treeLevel);
                    break;
                }
            }
        } catch (ex) {
            console.log(ex);
        }

        return treeNodeViewModel;
    }

    stringJoin(array, char, count) {
        if (array) {
            let result = [];
            let countNum = 0;
            for (let index = 0; index < array.length; index++) {
                if (countNum < count) {
                    let element = array[index];
                    result.push(element);
                } else {
                    break;
                }
                countNum++;
            }
            let resultStr = result.join(char);
            return resultStr;
        }

    }
  
}
export default Mytree;