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
app.use(router).use(store).mount('#app')
