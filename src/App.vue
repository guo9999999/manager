<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script>
import {} from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhcn from 'element-plus/lib/locale/lang/zh-cn'
import { generateNewStyle, writeStyle } from './utils/theme.js'
import { useStore } from 'vuex'
export default {
  name: 'App',
  components: {
    [ElConfigProvider.name]: ElConfigProvider
  },
  setup() {
    // 中文
    let locale = zhcn
    const state = useStore()
    generateNewStyle(state.getters.defaultColor).then((res) => {
      writeStyle(res)
    })

    return {
      locale
    }
  }
}
</script>
<style lang="scss"></style>
