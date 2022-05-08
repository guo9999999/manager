// 全屏
<template>
  <div class="screenFull">
    <el-tooltip :content="isFull ? '取消全屏' : '全屏'">
      <iconCom
        :icon="isFull ? 'icon-quxiaoquanping' : 'icon-quanping'"
        @click="handleTrigger"
      ></iconCom>
    </el-tooltip>
  </div>
</template>

<script setup>
import iconCom from './iconCom.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import screenfull from 'screenfull'

const isFull = ref(false)
const change = () => {
  isFull.value = screenfull.isFullscreen
}

const handleTrigger = () => {
  screenfull.toggle()
}

// 设置侦听器
onMounted(() => {
  screenfull.on('change', change)
})
onUnmounted(() => {
  screenfull.off('change', change)
})
// 切换
</script>
<style lang="scss" scoped></style>
