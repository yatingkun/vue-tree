import Vue from 'vue';
import 'bootstrap/dist/css/bootstrap.css';
import treeView from './view/TreeView.vue'
import MyTree from './MyTreeViwModel'
let arry1 = ["11.22", "11.22.33","11.22.44"]
let treeViewModel = new MyTree(arry1);
new Vue({
    template: `
	<div class="row">
		<div class="col-md-4">
			<div class="card">
				<div class="card-body">
					<b-tree-view
						ref="tree"
						:contextMenu="true"
						:renameNodeOnDblClick="true"
                        :showIcons="true"
                        :viewModel="treeViewModel"
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
        }
    },

    components: {
        "b-tree-view": treeView
    },
    created() {
        
    },
    mounted:function(){
     }
});

