// 面包屑
<template>
  <el-breadcrumb separator="/">
    <template v-for="menu in breadcrumbData">
      <el-breadcrumb-item :to="{ path: '/' }">{{
        menu.meta.title
      }}</el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
// 获取面包屑数据
const route = useRoute()
const breadcrumbData = computed(() => {
  return route.matched
})
computed
</script>
<style lang="scss" scoped></style>
