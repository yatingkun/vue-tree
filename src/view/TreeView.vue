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
    <template v-for="(nodeData, index) in data">
      <tree-node
        :key="nodeData[nodeKeyProp]"
        :keyProp="nodeKeyProp"
        :renameOnDblClick="renameNodeOnDblClick"
        :childrenProp="data.childs"
        :data="nodeData"
        :draggable="nodesDraggable"
        :defaultIconClass="defaultIconClass"
        :iconClassProp="iconClassProp"
        :showIcon="showIcons"
        :prependIconClass="prependIconClass"
        :contextMenu="contextMenu"
        ref="rootNodes"
        @nodeSelect="nodeSelect"
        @nodeDragStart="nodeDragStart"
      >
      </tree-node>
      <drop-between-zone
        :key="index"
        @nodeDrop="dropNodeAtPosition(index + 1)"
        v-if="
          draggedNode !== null &&
          draggedNode.data !== nodeData &&
          (index + 1 >= data.length || draggedNode.data !== data[index + 1])
        "
      >
      </drop-between-zone>
    </template>
  </div>
</template>

<script>
import TreeNode from "./TreeNode.vue";
import EventBus from "./EventBus.js";
import DropBetweenZone from "./DropBetweenZone.vue";
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
    nodeKeyProp: {
      type: String,
      default: "id",
    },
    nodeChildrenProp: {
      type: String,
      default: "children",
    },
    nodesDraggable: {
      type: Boolean,
      default: false,
    },
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
    DropBetweenZone,
    ContextMenu,
  },
  methods: {
    createNodeMap() {
      if (this.nodeMap === undefined) {
        let nodeMap = (this.nodeMap = new Map());

        let nodes = this.$refs.rootNodes.slice();

        for (let i = 0; i < nodes.length; i++) {
          let tmpNode = nodes[i];
          nodes.push(...tmpNode.getChildNodes());
        }

        for (let tmpNode of nodes) {
          nodeMap.set(tmpNode.data[this.nodeKeyProp], tmpNode); // TODO: change to getter
        }
      }
    },
    getNodeByKey(key) {
      return this.nodeMap.get(key);
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
    nodeDragStart() {
      EventBus.$on("dropOK", this.cutNode);
    },
    cutNode() {
      EventBus.$off("dropOK");
      let idx = this.data.indexOf(window._bTreeView.draggedNodeData);
      this.data.splice(idx, 1);
      // let's notify that node data was successfully cut (removed from array)
      EventBus.$emit("cutOK");
    },
    draggingStarted(draggedNode) {
      this.draggedNode = draggedNode;
      // let's listen for the drag end event
      EventBus.$on("nodeDragEnd", this.draggingEnded);
    },
    draggingEnded() {
      // stop listening for the dragging end event
      EventBus.$off("nodeDragEnd", this.draggingEnded);
      this.draggedNode = null;
    },
    dropNodeAtPosition(pos) {
      // position can change if we move node within the same parent node (same level)
      // so it's better to remember node at previous position
      let insertAfter = pos - 1 < 0 ? null : this.data[pos - 1];
      EventBus.$on("cutOK", () => {
        let pos = this.data.indexOf(insertAfter) + 1;
        this.data.splice(pos, 0, window._bTreeView.draggedNodeData);
        delete window._bTreeView.draggedNodeKey;
        delete window._bTreeView.draggedNodeData;
        EventBus.$off("cutOK");
      });
      EventBus.$emit("dropOK");
    },
    menuItemSelected(item, node) {
      switch (item.action) {
        case "removeNode":
          node.data.deleteNode();
          break;
        case "appendChild":
          //node.data.appendChild();
          EventBus.$emit("appendChild", node.data);//交由viewModel
          break;
        case "renaming":
          this.renaming(node.data);
          break;
        default:
          //this.$emit("contextMenuItemSelect", item, node);
          node.data.execute(item.action, node.data);
      }
    },
    setMenuContent(node) {
      this.currentNode = node.data;//获取当前右击的节点，在computed中更新菜单栏状态
      EventBus.$emit("openNodeContextMenu", node);
    },
    renaming(node) {
      console.log(node);
    }
  },
  created() {
    this.selectedNode = null;
    EventBus.$on("nodeDragStart", this.draggingStarted);
    EventBus.$on("contextMenuItemSelect", this.menuItemSelected);
    this.$nextTick(() => {
      //在created()里使用this.$nextTick()可以等待dom生成以后再来获取dom对象//this.$nextTick()方法主要是用在随数据改变而改变的dom应用场景中
      this.createNodeMap();
    });
    EventBus.$on("setContextMenu", this.setMenuContent);
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
