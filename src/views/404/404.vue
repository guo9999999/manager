<template>
  <div class="warp">
    <img src="../../assets/404.jpg" alt="" />
    <button @click="goHome">返回首页</button>
  </div>
</template>

<script setup>
import {} from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => {
  router.push('/')
}
</script>
<style lang="scss" scoped>
.warp {
  position: relative;
  width: 100%;
  height: 100vh;
  img {
    width: 100%;
    height: 100%;
  }
  button {
    position: fixed;
    left: 50%;
    top: 77%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 40px;
    background: transparent;
    border: 2px solid #ccc;
    color: #fff;
    cursor: pointer;
  }
}
</style>
