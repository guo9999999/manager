import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '用户登录'
    },
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
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
      },
      {
        path: '/system/dept',
        name: 'dept',
        component: () => import('../views/dept/dept.vue'),
        meta: {
          title: '部门管理'
        }
      },
      {
        path: '/audit/leave',
        name: 'leave',
        component: () => import('../views/leave/leave.vue'),
        meta: {
          title: '休假审批'
        }
      },
      {
        path: '/audit/approve',
        name: 'approve',
        component: () => import('../views/approve/approve.vue'),
        meta: {
          title: '待审批'
        }
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 判断当前地址是否可以访问
// function checkPermission(path) {
//   let hasPermission = router
//     .getRoutes()
//     .filter((route) => route.path == path).length
//   //  return  router.hasRoute(path)
//   //所有路由的数组
//   if (hasPermission) {
//     return true
//   } else {
//     return false
//   }
// }
// 导航守卫
router.beforeEach((to, from, next) => {
  if (router.hasRoute(to.name)) {
    document.title = to.meta.title
    next()
  } else {
    next('/404')
  }
})

export default router
