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
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
// 获取面包屑数据
const breadcrumbData = ref([])
const route = useRoute()
onMounted(() => {
  breadcrumbData.value = route.matched
})
</script>
<style lang="scss" scoped></style>
