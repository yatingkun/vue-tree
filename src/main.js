import Vue from 'vue';
import 'bootstrap/dist/css/bootstrap.css';
import treeView from './view/TreeView.vue'
import MyTree from './MyTree'
let arry1 = ["11.22", "11.22.33"]
let treeViewModel = new MyTree(arry1);
import EventBus from './view/EventBus';
new Vue({
    template: `
	<div class="row">
		<div class="col-md-4">
			<div class="card">
				<div class="card-body">
					<b-tree-view
						:data="treeData"
						ref="tree"
						:nodesDraggable="false"
						:contextMenu="true"
						:renameNodeOnDblClick="true"
						:showIcons="true"
						iconClassProp="icon"
						prependIconClass="fas"
						@nodeSelect="nodeSelect"></b-tree-view>
				</div>
			</div>
		</div>
		<div class="col-md-8" v-if="selectedNode">
			<div class="card">
				<div class="card-body">
					Node {{ selectedNode.name }} is selected
				</div>
			</div>
		</div>
	</div>`,
    el: '#app',
    data() {
        return {
            treeData: treeViewModel.nodes,
            selectedNode: null,
            treeViewModel:treeViewModel,
        }
    },
    methods: {
        nodeSelect(node, isSelected) {
            if (isSelected) {
                this.selectedNode = node.data
            } else if (node.data === this.selectedNode) {
                this.selectedNode = null
            }
        },
        appendChild(currentNode) {
           let childrenFullPath= this.treeViewModel.appendChild(currentNode.data);
           EventBus.$emit("afterAddChild",currentNode,childrenFullPath);
           //currentNode.afterAddChild(childrenFullPath);
        }
    },
    components: {
        "b-tree-view": treeView
    },
    created() {
        
    },
    mounted:function(){
        EventBus.$on("appendChild", this.appendChild);
     }
});

