/**
 * 登录鉴权
 * 1.如果用户未登录，不允许用户进入到login页外的其他页面
 * 2.用户已登录，token未过期前，不允许进入login
 */
import router from './router'
import store from './store'

// 设置白名单
const writePage = ['/login']

router.beforeEach(async (to, form, next) => {
  // 2.用户已登录，token未过期前，不允许进入login
  if (store.getters.token) {
    if (to.path === '/login') {
      router.push('/')
    } else {
      // 判断当前用户是否存在,不存在
      if (!store.getters.hasUserInfo) {
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    // 1.如果用户未登录，不允许用户进入到login页外的其他页面
    if (writePage.indexOf(to.path) > -1) {
      next()
    } else {
      router.push('/login')
    }
  }
})
