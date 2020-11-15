import Vue from 'vue';
import 'bootstrap/dist/css/bootstrap.css';
import treeView from './view/TreeView.vue'
let count = 100;

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
						:contextMenuItems="contextMenuItems"
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
            treeData: [
                {
                    "name": "Books",
                    "children": [
                        {
                            name: "Neptune",
                        }
                    ]
                },
            ],
            selectedNode: null,
            contextMenuItems: [
                { code: 'DELETE_NODE', label: 'Delete node', disabled: true, logo: "delete.png" },
                { code: 'ADD_CHILD_NODE', label: 'Add child', disabled: false, logo: "add.png"}, 
                { code: 'RENAME_NODE', label: 'Rename', disabled: false, logo: "default.png" }]
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
            if (item.code === 'ADD_CHILD_NODE') {
                node.appendChild({
                    id: count++,
                    name: 'My new node'
                })
            }
        }
    },
    components: {
        "b-tree-view": treeView
    },
    updated() {

    }
});
