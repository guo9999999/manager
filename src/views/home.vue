<template>
  <div class="">首页</div>
</template>

<script setup>
import request from '../utils/request'
import { onMounted } from 'vue'
onMounted(() => {
  request({
    url: '/sys/profile',
    method: 'get'
  }).then((res) => {
    console.log(res)
  })
})
</script>
<style lang="scss" scoped></style>
