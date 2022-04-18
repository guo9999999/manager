import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
