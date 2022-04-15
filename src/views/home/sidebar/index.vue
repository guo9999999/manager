// 侧边栏
<template>
  <el-menu
    class="sidebar-con"
    unique-opened
    :background-color="$store.getters.cssVar.menuBg"
    :text-color="$store.getters.cssVar.menuText"
    :active-text-color="$store.getters.cssVar.menuActiveText"
    :unique-opened="true"
  >
    <el-menu-item index="1">1</el-menu-item>
    <el-sub-menu index="2">
      <template #title>2</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>3</template>
      <el-menu-item index="3-1">item one</el-menu-item>
      <el-menu-item index="3-2">item two</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import {} from 'vue'
</script>
<style lang="scss" scoped>
.sidebar-con {
  width: 210px;
  height: 100%;
}
</style>
