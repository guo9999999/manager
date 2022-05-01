import { createApp } from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store'

import './assets/style/index.scss'
import './assets/icon/iconfont.css'
// 登录鉴权
import './permission.js'

console.log(import.meta.env)
const app = createApp(App)

// 自定义指令，用于判断按钮权限
app.directive('has', {
  beforeMount: (el, binding) => {
    let actionList = store.getters.actionList
    let value = binding.value
    let hasPermission = actionList.includes(value)
    if (!hasPermission) {
      el.style = 'display:none'
      //延迟删除节点
      setTimeout(() => {
        el.parentNode.removeChild(el)
      }, 0)
    }
  }
})

app.use(router).use(store).mount('#app')
