// 面包屑
<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
onMounted(() => {
  console.log(route.matched)
})
</script>
<style lang="scss" scoped></style>
