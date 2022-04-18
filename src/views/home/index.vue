<template>
  <div class="home-con">
    <!-- 侧边栏 -->
    <div class="sidlebar">
      <el-menu
        class="el-menu-demo"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#ffffff"
        :default-active="ActivePath"
        router
        unique-opened
      >
        <treeMenu :menuList="menuListData"></treeMenu>
      </el-menu>
    </div>
    <div class="right-con">
      <!-- 面包屑 -->
      <div class="navbar">
        <breadcrumb></breadcrumb>
        <!-- 用户信息 -->
        <div class="outlogin-con">
          <el-badge class="mark" :is-dot="leaveCountData > 0">
            <i class="iconfont guidezhiyin"></i>
          </el-badge>
          用户
        </div>
      </div>
      <div class="main-con">中间内容</div>
    </div>
  </div>
</template>

<script setup>
import treeMenu from '@/components/treeMenu.vue'
import breadcrumb from '@/components/breadcrumb.vue'
import { computed, onMounted, ref } from 'vue'
import { leaveCount, menuList } from '@/api/sys.js'

import { useRoute } from 'vue-router'

/**
 * 获取待审批通知数量
 */
const leaveCountData = ref(0)
const getLeaveCount = async () => {
  try {
    const res = await leaveCount()
    leaveCountData.value = res
  } catch (err) {
    console.log(err)
  }
}

/**
 * 获取菜单列表
 */
const menuListData = ref([])
const getMenuList = async () => {
  try {
    const res = await menuList()
    menuListData.value = res
  } catch (err) {
    console.log(err)
  }
}
onMounted(() => {
  getLeaveCount()
  getMenuList()
})
// 当前菜单激活状态
const route = useRoute()
const ActivePath = computed(() => {
  let { path } = route
  console.log(path)
  return path
})
</script>
<style lang="scss" scoped>
@import './index';
</style>
