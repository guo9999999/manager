<template>
  <div class="home-con">
    <!-- 侧边栏 -->
    <sidebar></sidebar>
    <div class="right-con">
      <!-- 头部导航栏 -->
      <div class="navbar">
        <el-dropdown class="outLogin-con" trigger="click">
          <div class="avatar-con">
            <el-avatar
              class="avatar"
              :size="40"
              shape="square"
              :src="$store.getters.userInfo.avatar"
            />
            <i class="iconfont icon-shezhi-"></i>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>首页</el-dropdown-item>
              <el-dropdown-item>课程主页</el-dropdown-item>
              <el-dropdown-item @click="outLigin">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- 主体内容 -->
      <div class="main-con">主体内容</div>
    </div>
  </div>
</template>

<script setup>
import sidebar from './sidebar/index.vue'
import { onMounted } from 'vue'
import { useStore } from 'vuex'

// 获取优化信息
const store = useStore()
onMounted(() => {
  store.dispatch('user/getUserInfo')
})

// 退出登录操作
const outLigin = () => {
  store.commit('user/outLogin')
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
