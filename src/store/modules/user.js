import { login, getUserInfo } from '@/api/sys.js'
// 使用MD5进行密码加密
import md5 from 'md5'
import {
  localGetItem,
  localSetItem,
  localRemoveItem
} from '../../utils/storage.js'
import { TOKRN_KEY } from '../../constant/index.js'
import router from '@/router'
import { setTokenTime } from '@/utils/tokenTime.js'

export default {
  // 命名空间
  namespaced: true,
  state: () => ({
    token: localGetItem(TOKRN_KEY) || '',
    userInfo: '' //用户信息
  }),
  mutations: {
    setToken(state, token) {
      localSetItem(TOKRN_KEY, token)
      state.token = token
    },
    setUserInfo(state, userinfo) {
      state.userInfo = userinfo
    },
    // 退出登录
    outLogin(state) {
      state.token = ''
      state.userInfo = ''
      localRemoveItem(TOKRN_KEY)
      router.push('/login')
    }
  },
  actions: {
    // 登录
    login(context, userInfo) {
      let { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({
          username,
          password: md5(password)
        })
          .then((res) => {
            // 成功操作，存储到本地
            context.commit('setToken', res.token)
            // 获取当前登录时的时间，
            setTokenTime()
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 获取用户信息
    async getUserInfo(context) {
      const res = await getUserInfo()
      console.log(res)
      context.commit('setUserInfo', res)
      return res
    }
  }
}