<template>
  <div class="home-con">
    <!-- 侧边栏 -->
    <div :class="['sidlebar', $store.getters.collapseOpen ? 'hide' : 'open']">
      <el-menu
        class="el-menu-demo"
        :background-color="$store.getters.cssVar.menuBg"
        :text-color="$store.getters.cssVar.menuText"
        :active-text-color="$store.getters.cssVar.menuActiveText"
        :default-active="ActivePath"
        router
        unique-opened
        :collapse="$store.getters.collapseOpen"
      >
        <treeMenu :menuList="menuListData"></treeMenu>
      </el-menu>
    </div>
    <div
      :class="[
        'right-con',
        $store.getters.collapseOpen ? 'hideright' : 'openright'
      ]"
    >
      <div class="navbar">
        <!-- 面包屑 -->
        <breadcrumb></breadcrumb>
        <!-- 用户信息 -->
        <div class="outlogin-con">
          <!-- 全屏 -->
          <screenfull></screenfull>
          <!-- 更换主题 -->
          <ThemeSelect></ThemeSelect>
          <el-badge class="mark" :value="leaveCountData" @click="handleApprove">
            <i class="iconfont icon-xiaoxi"></i>
          </el-badge>
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ $store.getters.userInfo.userName }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>我的邮箱</el-dropdown-item>
                <el-dropdown-item @click="handleOut">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
import screenfull from '@/components/screenfull.vue'
import ThemeSelect from '../../components/ThemeSelect.vue'
import { computed, onMounted, ref } from 'vue'
import { leaveCount, menuList, getPermissionList } from '@/api/sys.js'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

/**
 * 获取待审批通知数量
 */
const state = useStore()

const getLeaveCount = async () => {
  const res = await leaveCount()
  state.commit('user/setBadgeCount', res)
}

/**
 * 获取菜单列表
 */
const leaveCountData = computed(() => {
  return state.getters.badgeCount
})
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

// 退出登录
const handleOut = () => {
  state.commit('user/outLogin')
}
const router = useRouter()
const handleApprove = () => {
  if (leaveCountData.value) {
    router.push('/audit/approve')
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/variables.module.scss';
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
    height: 100vh;
    overflow: hidden;
    transition: width 0.3s;
    .el-menu-demo {
      width: 100%;
      height: 100%;
    }
  }

  .right-con {
    transition: all 0.3s;
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      padding: 0 20px;
      border-bottom: 1px solid #ddd;
      .outlogin-con {
        display: flex;
        align-items: center;
        .mark {
          margin: 0 20px;
          cursor: pointer;
          .iconfont {
            font-size: 20px;
          }
        }
      }
    }
    .main-con {
      padding: 20px;
      height: calc(100vh - 50px);
      background-color: #eef0f3;
    }
  }
  .open {
    width: $sideBarWidth;
  }
  .hide {
    width: $hidesideBarWidth;
  }
  .hideright {
    width: calc(100% - $hidesideBarWidth);
    margin-left: $hidesideBarWidth;
  }
  .openright {
    width: calc(100% - $sideBarWidth);
    margin-left: $sideBarWidth;
  }
}
</style>
