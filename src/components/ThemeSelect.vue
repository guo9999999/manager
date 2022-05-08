// 更换主题颜色
<template>
  <div class="ThemeSelect">
    <el-tooltip content="更换主题">
      <iconCom icon="icon-jingzi" @click="handleClick"></iconCom>
    </el-tooltip>
    <!-- 弹出框 -->
    <el-dialog v-model="dialogVisible" title="主题更换">
      <div class="warp">
        <p>主体色更换</p>
        <el-color-picker
          v-model="defultColor"
          :predefine="predefineColors"
          size="large"
        ></el-color-picker>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSumbit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import iconCom from './iconCom.vue'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { generateNewStyle, writeStyle } from '../utils/theme.js'
const state = useStore()
const dialogVisible = ref(false)

// 默认色
const defultColor = ref(state.getters.defaultColor)
// 预设色
const predefineColors = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
]

const handleClick = () => {
  dialogVisible.value = true
}
// 取消
const handleClose = () => {
  dialogVisible.value = false
}
// 确定
const handleSumbit = async () => {
  const newStyle = await generateNewStyle(defultColor.value)
  //  写入最新主题色
  writeStyle(newStyle)
  state.commit('theme/setDefaultColor', defultColor.value)
  handleClose()
}
</script>
<style lang="scss" scoped>
.ThemeSelect {
  .warp {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p {
      padding: 10px 0;
    }
  }
  :deep(.el-overlay) {
    z-index: 2003 !important;
  }
}
</style>
