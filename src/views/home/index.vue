<template>
  <div class="home-con">
    <!-- 侧边栏 -->
    <div class="sidlebar">
      <el-menu
        class="el-menu-demo"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#fff"
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
      <div class="main-con">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <div :key="route.path">
                <component :is="Component"></component>
              </div>
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import treeMenu from '@/components/treeMenu.vue'
import breadcrumb from '@/components/breadcrumb.vue'
import { computed, onMounted, ref } from 'vue'
import { leaveCount, menuList, getPermissionList } from '@/api/sys.js'

import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

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
const state = useStore()
const menuListData = ref([])
const getMenuList = async () => {
  try {
    const { menuList, actionList } = await getPermissionList()
    menuListData.value = menuList
    state.commit('user/setMenuList', menuList)
    state.commit('user/setActionList', actionList)
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
let ActivePath = computed(() => {
  let { path } = route
  return path
})
</script>
<style lang="scss" scoped>
@import '@/assets/style/variables.scss';
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}
.home-con {
  position: relative;
  .sidlebar {
    position: fixed;
    left: 0;
    top: 0;
    width: $sideBarWidth;
    height: 100vh;
    overflow: hidden;
    transform: width 0.5s;
    .el-menu-demo {
      width: 100%;
      height: 100%;
    }
  }
  .right-con {
    width: calc(100% - #{$sideBarWidth});
    margin-left: $sideBarWidth;
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      padding: 0 20px;
      border-bottom: 1px solid #ddd;
    }
    .main-con {
      padding: 20px;
      height: calc(100vh - 50px);
      background-color: #eef0f3;
    }
  }
}
</style>
