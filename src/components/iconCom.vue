<template>
  <div class="icon-com">
    <i class="iconfont" :class="icon"></i>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps(['icon'])
</script>
<style lang="scss" scoped>
.icon-com {
  padding: 0 10px;
  .iconfont {
    font-size: 25px;
    cursor: pointer;
  }
}
</style>
