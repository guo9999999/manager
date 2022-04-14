import { createApp } from 'vue'
import App from './App.vue'
import router from './router/'

console.log(import.meta.env)
const app = createApp(App)
app.use(router).mount('#app')
