<template>
  <div class="tree-branch" :class="{ selected: this.selected }">
    <div
      class="tree-node"
      :class="{
        'has-child-nodes': hasChildren,
        'tree-node-expanded': this.data.IsExpanded,
      }"
      @contextmenu="showContextMenu($event)"
    >
      <transition name="rotateArrow">
        <svg
          width="12"
          height="12"
          @click.prevent="toggle"
          class="tree-node-icon"
          v-if="hasChildren"
        >
          <path d="M2 1 L10 6 L2 11 Z" class="svg-icon" />
        </svg>
      </transition>
      <span
        class="tree-node-label"
        @click="toggleSelection"
        @dblclick="dblClickLabel"
      >
        <i
          :class="['label-icon', prependIconClass, iconClass]"
          v-if="showIcon && iconClass !== null"
        ></i>
        <input
          class="form-control form-control-sm input-rename"
          ref="inputRename"
          type="text"
          v-model="renameNewLabel"
          v-if="renaming"
          v-focus
          v-select-text
          @blur="endRenaming"
          v-on:keyup.esc.stop="cancelRenaming"
          v-on:keyup.enter.stop="endRenaming"
        />
        <span v-else>{{ data.name }}</span>
      </span>
    </div>
    <div
      class="tree-node-children"
      v-show="this.data.IsExpanded && data.childs && Array.isArray(data.childs)"
    >
      <template v-for="(nodeData) in data.childs">
        <tree-node
          :data="nodeData"
          :key="nodeData.fullPath"
          ref="childNodes"
          :renameOnDblClick="renameOnDblClick"
          :defaultIconClass="defaultIconClass"
          :iconClassProp="iconClassProp"
          :showIcon="showIcon"
          :prependIconClass="prependIconClass"
          :contextMenu="contextMenu"
          @nodeSelect="childNodeSelect"
        >
        </tree-node>
      </template>
    </div>
  </div>
</template>

<script>
import EventBus from "./EventBus";
import Vue from "vue";
export default {
  name: "tree-node",
  components: {
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    renameOnDblClick: {
      type: Boolean,
      default: false,
    },
    // default icon if node icon is not specified
    defaultIconClass: {
      type: String,
      default: null,
    },
    // where to search for node icon
    iconClassProp: {
      type: String,
      default: null,
    },
    // show icon
    showIcon: {
      type: Boolean,
      default: false,
    },
    // class added to every icon no matter what
    prependIconClass: {
      type: String,
      default: null,
    },
    contextMenu: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selected: this.data.selected,
      enterLeaveCounter: 0,
      renaming: false,
      renameNewLabel: this.data.name,
      currentAddedNode: "",
    };
  },
  directives: {
    focus: {
      // directive definition
      inserted(el) {
        el.focus();
      },
    },
    selectText: {
      inserted(el) {
        el.select();
      },
    },
  },
  watch: {
    selected: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {
        this.$emit("nodeSelect", this, val);
      },
      deep: true, //true 深度监听
    },
  },
  computed: {
    hasChildren() {
      return this.data.childs !== undefined && this.data.childs.length > 0;
    },
    iconClass() {
      return this.iconClassProp && this.data[this.iconClassProp] !== undefined
        ? this.data[this.iconClassProp]
        : this.defaultIconClass;
    },
  },
  methods: {
    toggle() {
      if (
        this.data.childs &&
        Array.isArray(this.data.childs) &&
        this.data.childs.length > 0
      ) {
        this.data.IsExpanded = !this.data.IsExpanded;
      }
    },
    toggleSelection() {
      if (!this.renaming) {
        this.selected = !this.selected;
      }
    },
    select() {
      if (!this.renaming) {
        this.selected = true;
      }
    },
    deselect() {
      if (!this.renaming) {
        this.selected = false;
      }
    },
    expand() {
      if (
        this.data.childs &&
        Array.isArray(this.data.childs) &&
        this.data.childs.length > 0
      ) {
        this.data.IsExpanded = true;
      }
    },
    collapse() {
      this.data.IsExpanded = false;
    },
    childNodeSelect(node, isSelected) {
      // forward event to the parent node
      this.$emit("nodeSelect", node, isSelected);
    },
    getChildNodes() {
      return this.$refs.childNodes || [];
    },
    isDescendantOf(nodeData) {
      if (nodeData.childs === undefined) {
        return false;
      }
      let nodes = [nodeData];
      for (let i = 0; i < nodes.length; i++) {
        let tmpNode = nodes[i];
        if (tmpNode.childs !== undefined) {
          for (let child of tmpNode.childs) {
            if (child === this.data) {
              return true;
            }
          }
          nodes.push(...tmpNode.childs);
        }
      }
    },
    showContextMenu(event) {
      if (this.renaming) {
        this.cancelRenaming();
      }
      this.select();
      if (this.contextMenu) {
        event.preventDefault();
        EventBus.$emit("setContextMenu", this); //先通知主页面设置菜单内容
      }
    },
    delete() {
      this.$emit("deleteNode", this);
    },
    appendChild(childNodeData) {
      if (this.data.childs === undefined) {
        Vue.set(this.data, "childs", []);
      }
      this.data.childs.push(childNodeData);
      this.data.IsExpanded = true;
    },
    startRenaming() {
      this.deselect();
      this.renameNewLabel = this.data.name;
      this.renaming = true;
    },
    cancelRenaming() {
      this.renameNewLabel = this.data.name;
      this.renaming = false;
    },
    endRenaming() {
      let preval=this.data.fullPath;
      this.data.name = this.renameNewLabel;
      this.renaming = false;
      if(preval!==this.data.fullPath){
         EventBus.$emit("renamed", preval ,this.data.name); //
      }
    },
    dblClickLabel() {
      if (this.renameOnDblClick) {
        this.startRenaming();
      }
    }
  },
  created() {
    this.$watch(`data.childs`, function (children) {
      if (children.length === 0 && this.data.IsExpanded) {
        this.data.expanded = false;
      }
    });
    this.$nextTick(() => {
     if (!this.data.parent) {
        //根节点
        this.$emit("nodeSelect", this, true);
      }
    });
  },
};
</script>

<style>
.tree-node-label {
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  -ms-user-select: none;
  user-select: none;
}

.tree-node-label:hover {
  background-color: #EBECEE;
}

.tree-node-icon {
  color: #464646;
  transition: transform 0.3s;
}

.tree-node {
  margin-left: 16px;
}

.tree-node.has-child-nodes {
  margin-left: 0;
}

.tree-node.has-child-nodes .tree-node-icon {
  cursor: pointer;
}

.tree-node-expanded .tree-node-icon {
  transform: rotate(90deg);
  transition: transform 0.3s;
}

.tree-node-children {
  margin-left: 22px;
}

.tree-branch {
  position: relative;
}

.tree-branch.selected > .tree-node > .tree-node-label {
  background-color: #007bff;
  color: #fff;
}

.tree-node.drop-active {
  border: 1px dashed #D2D2D2;
}

.tree-node-label .label-icon {
  font-size: 90%;
}

.tree-node > svg {
  display: inline-block;
  -ms-user-select: none;
  user-select: none;
}

.tree-node .input-rename {
  display: inline-block;
  width: auto;
  font-weight: 400;
  line-height: 1;
  font-size: 1rem;
  padding: 2px 4px;
  height: auto;
  box-sizing: border-box;
}

.tree-node svg > .svg-icon {
  fill: none;
  opacity: 1;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-miterlimit: 4;
  stroke-dasharray: none;
  stroke-opacity: 1;
}

.tree-node.tree-node-expanded > svg > .svg-icon {
  fill: none;
}
</style>
