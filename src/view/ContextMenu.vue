<template>
  <vue-context-menu id="context-menu" ref="ctxMenu">
    <div
      id="itemContainer"
      :class="[item.disabled ? 'disabled' : 'active']"
      v-for="(item, index) in contextMenuItems"
      :key="index"
    >
      <img :src="'./images/' + item.logo" />
      <input
        type="button"
        @click.stop.prevent="menuItemSelected(item)"
        :disabled="item.disabled"
        :value="item.label"
      />
    </div>
  </vue-context-menu>
</template>

<script>
import EventBus from "./EventBus";
import VueContextMenu from "vue-context-menu";

export default {
  components: {
    VueContextMenu,
  },
  props: {
    contextMenuItems: {
      type: Array,
      default: () => {
        [];
      },
    },
    disabled: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
  },
  data() {
    return {
      activeNode: null,
    };
  },
  methods: {
    open(node) {
      if(this.$refs.ctxMenu){
      this.activeNode = node;
      this.$refs.ctxMenu.open();
      }
     
    },
    menuItemSelected(item) {
      EventBus.$emit("contextMenuItemSelect", item, this.activeNode);
    },
  },
  created() {
    EventBus.$on("openNodeContextMenu", this.open);
  },
};
</script>

<style>
.ctx-item {
  user-select: none;
}
input {
  display: flex;
  border: 0;
  width: 100%;
  background: transparent;
}
.active {
  color: black;
  cursor: pointer;
}
#itemContainer {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  width: 100%;
}

#itemContainer > img {
  width: 20px;
  margin: 0px 5px;
}
.disabled {
  color: gray;
  background-color: #F5F4F3;
}
</style>