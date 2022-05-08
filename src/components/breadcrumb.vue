// 面包屑
<template>
  <div class="breadcrumb-con">
    <iconCom :icon="iconName" @click="handleChange"></iconCom>
    <el-breadcrumb separator="/">
      <template v-for="menu in breadcrumbData">
        <el-breadcrumb-item :to="{ path: '/' }">{{
          menu.meta.title
        }}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import iconCom from './iconCom.vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
// 获取面包屑数据
const route = useRoute()
const breadcrumbData = computed(() => {
  return route.matched
})

const state = useStore()
// 切换汉堡屑状态
const handleChange = () => {
  state.commit('user/triggerCollapseOpen')
}
const iconName = computed(() => {
  return state.getters.collapseOpen ? 'icon-hamburger' : 'icon-hamburger-opened'
})
</script>
<style lang="scss" scoped>
.breadcrumb-con {
  display: flex;
  align-items: center;
}
</style>
