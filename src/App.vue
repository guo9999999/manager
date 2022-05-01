<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script>
import {} from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhcn from 'element-plus/lib/locale/lang/zh-cn'
export default {
  name: 'App',
  components: {
    [ElConfigProvider.name]: ElConfigProvider
  },
  setup() {
    // 中文
    let locale = zhcn

    return {
      locale
    }
  }
}
</script>
<style lang="scss">
@import './assets/style/reset.css';
@import './assets/style/index.scss';
</style>
