import Vue from 'vue';
import 'bootstrap/dist/css/bootstrap.css';
import treeView from './view/TreeView.vue'
import Tree from './MyTree'
let arry1=["11.22","11.22.33"]
let treeViewModel=new Tree(arry1);
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
						@contextMenuItemSelect="menuItemSelected"
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
        }
    },
    methods: {
        nodeSelect(node, isSelected) {
            console.log('Node ' + node.data.name + ' has been ' + (isSelected ? 'selected' : 'deselected'))
            if (isSelected) {
                this.selectedNode = node.data
            } else if (node.data === this.selectedNode) {
                this.selectedNode = null
            }
        },
        menuItemSelected(item, node) {      
            console.log(item,node);
        }
    },
    components: {
        "b-tree-view": treeView
    },
    updated() {

    }
});

