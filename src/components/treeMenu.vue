<template>
  <template v-for="menu in menuList">
    <el-sub-menu
      :index="menu.path"
      v-if="
        menu.children &&
        menu.children.length > 0 &&
        menu.children[0].menuType == 1
      "
      :key="menu._id"
    >
      <template #title>
        <i class="iconfont" :class="menu.icon"></i>
        <span> {{ menu.menuName }}</span>
      </template>
      <!-- 重新调用自己 -->
      <tree-menu :menuList="menu.children"></tree-menu>
    </el-sub-menu>
    <el-menu-item
      v-else-if="menu.menuType == 1"
      :index="menu.path"
      :key="menu._id"
    >
      <i class="iconfont" :class="menu.icon"></i>
      <span> {{ menu.menuName }}</span></el-menu-item
    >
  </template>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  menuList: {
    type: Array,
    required: true
  }
})
</script>
<style lang="scss" scoped>
.iconfont {
  padding-right: 5px;
}
</style>
