<template>
  <div class="tree-view">
    <context-menu
      v-if="contextMenu"
      :contextMenuItems="contextMenuItems"
    ></context-menu>

    <drop-between-zone
      @nodeDrop="dropNodeAtPosition(0)"
      v-if="draggedNode !== null && draggedNode.data !== data[0]"
    >
    </drop-between-zone>
    <template v-for="(nodeData) in data">
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

export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
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
  },
  data() {
    return {
      draggedNode: null,
      currentNode: null,
    };
  },
  components: {
    TreeNode,
    ContextMenu,
  },
  methods: {
    createNodeMap() {
     //把所有节点以字典的方式存入一个集合以便外部进行索引
    },
    getNodeByKey() {
      //return this.nodeMap.get(key);
    },
    // event bubbles up to the roots
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
    menuItemSelected(item, node) {
      switch (item.action) {
        case "removeNode":
          node.data.deleteNode();
          break;
        case "appendChild":
          this.$emit("appendChild", node);
          break;
        case "renaming":
          node.startRenaming();
          break;
        default:
          node.data.execute(item.action, node.data);
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
        if (!newNodePath) return;//说明添加失败，名称有误
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
  },
  created() {
    this.selectedNode = null;
    EventBus.$on("contextMenuItemSelect", this.menuItemSelected);
    EventBus.$on("afterAddChild", this.afterAddChild);
    EventBus.$on("setContextMenu", this.setMenuContent);
     this.$nextTick(() => {
      this.createNodeMap();
    });
  },
  computed: {
    contextMenuItems: {
      get() {
        if (this.currentNode) {
          this.currentNode.contextMenuItems.forEach((element) => {
            if (element.action === "removeNode") {
              if (!this.currentNode.parent) {
                //根节点
                element.disabled = true;
              }
            }
            if (element.action === "renaming") {
              if (!this.currentNode.parent) {
                //根节点
                element.disabled = true;
              }
            }
          });
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
