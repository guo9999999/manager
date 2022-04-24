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
    component: () => import('@/views/home/index.vue'),
    redirect: '/system/user',
    meta: {
      title: '首页'
    },
    children: [
      {
        path: '/system/user',
        name: 'manage',
        component: () => import('../views/user/userManage.vue'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: '/system/menu',
        name: 'menu',
        component: () => import('../views/menu/menu.vue'),
        meta: {
          title: '菜单管理'
        }
      },
      {
        path: '/system/role',
        name: 'role',
        component: () => import('../views/role/role.vue'),
        meta: {
          title: '角色管理'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
