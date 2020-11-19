<template>
  <div class="tree-view">
    <context-menu
      v-if="contextMenuItems.length && contextMenu"
      :contextMenuItems="contextMenuItems"
    ></context-menu>
    <template v-for="nodeData in data">
      <tree-node
        :key="nodeData.fullPath"
        :renameOnDblClick="renameNodeOnDblClick"
        :data="nodeData"
        :defaultIconClass="defaultIconClass"
        :iconClassProp="iconClassProp"
        :showIcon="showIcons"
        :prependIconClass="prependIconClass"
        :contextMenu="contextMenu"
        ref="rootNodes"
        @nodeSelect="nodeSelect"
      >
      </tree-node>
    </template>
  </div>
</template>

<script>
import TreeNode from "./TreeNode.vue";
import EventBus from "./EventBus.js";
import ContextMenu from "./ContextMenu.vue";
import BaseViewModel from "../viewmodel/base_viewModel";
export default {
  props: {
    allowMultiple: {
      type: Boolean,
      default: false,
    },
    //是否开启菜单栏
    contextMenu: {
      type: Boolean,
      default: true,
    },
    renameNodeOnDblClick: {
      type: Boolean,
      default: true,
    },
    // class added to every icon no matter what
    prependIconClass: {
      type: String,
      default: null,
    },
    // default icon if node icon is not specified
    defaultIconClass: {
      type: String,
      default: null,
    },
    // where to search for node icon
    iconClassProp: {
      type: String,
      default: "icon",
    },
    // show icons
    showIcons: {
      type: Boolean,
      default: false,
    },
    viewModel: {
      type: BaseViewModel,
      default: null,
    },
  },
  data() {
    return {
      draggedNode: null,
      currentNode: null,
      data: this.viewModel.rootNodes,
    };
  },
  components: {
    TreeNode,
    ContextMenu,
  },
  methods: {
    nodeSelect(node, isSelected) {
      this.$emit("nodeSelect", node, isSelected);
      if (isSelected) {
        if (this.selectedNode !== null) {
          this.selectedNode.deselect();
        }
        this.selectedNode = node;
      } else if (node === this.selectedNode) {
        this.selectedNode = null;
      }
    },
    menuItemSelected(item, activeNode) {
      if (this.viewModel) {
        if (item.actionName === "renamed") {
          activeNode.startRenaming();
        } else {
          this.viewModel.execute(item.actionName, activeNode); //执行viewModel的逻辑
        }
      }
    },
    setMenuContent(node) {
      this.currentNode = node.data; //获取当前右击的节点，在computed中更新菜单栏状态
      EventBus.$emit("openNodeContextMenu", node);
    },
    //添加节点后切换到新节点进入重命名模式
    afterAddChild(currentNode, newNodePath) {
      this.$nextTick(() => {
        //节点更新完毕后执行
        if (!newNodePath) return; //说明
        currentNode.selected = false; //当前右击的树节点取消选中
        if (currentNode.$children) {
          currentNode.$children.forEach((element) => {
            if (element.data.fullPath === newNodePath) {
              element.selected = true;
              element.startRenaming();
            }
          });
        }
      });
    },
    renamed(oldFullpath, activeNode) {
      this.$nextTick(() => {
        if (this.viewModel) {
          this.viewModel.execute("renamed", {oldFullpath:oldFullpath, activeNode:activeNode}); //执行viewModel的逻辑
        }
      });
    },
  },

  created() {
    this.selectedNode = null;
    EventBus.$on("contextMenuItemSelect", this.menuItemSelected);
    EventBus.$on("afterAddChild", this.afterAddChild);
    EventBus.$on("setContextMenu", this.setMenuContent);
    EventBus.$on("renamed", this.renamed);
  },
  computed: {
    contextMenuItems: {
      get() {
        if (this.currentNode) {
          return this.currentNode.contextMenuItems;
        } else {
          return [];
        }
      },
    },
  },
};
</script>

<style>
.tree-view {
  text-align: left;
}
</style>
