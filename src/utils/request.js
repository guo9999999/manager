/**
 * axios 二次封装
 */
import axios from 'axios'
import config from '../config/'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import { TOKEN_LOSE, NETWORK_ERROR } from '../constant'
import router from '../router'
import store from '../store/index.js'
import { isCheckTime } from './tokenTime.js'

// 创建axios实列对象，添加全局配置
const service = axios.create({
  baseURL: config.baseUrl,
  timeout: 8000
})

// 请求拦截
service.interceptors.request.use((req) => {
  // 需要统一的去注入token
  if (store.getters.token) {
    req.headers.Authorization = `Bearer ${store.getters.token}`

    // 判断当前token是否失效
    if (isCheckTime()) {
      // token失效，调用退出操作方法
      store.commit('user/outLogin')
      ElMessage.error('token已失效')
      return Promise.reject(new Error('token已失效'))
    }
  }

  return req
})
// 响应拦截
service.interceptors.response.use(
  (res) => {
    const { code, data, msg } = res.data
    if (code === 200) {
      return data
    } else if (code === 401) {
      // 提示
      ElMessage.error(TOKEN_LOSE)
      // 1.5秒后跳转回登录页
      setTimeout(() => {
        router.push('/login')
      }, 15000)
      return Promise.reject(TOKEN_LOSE)
    } else {
      ElMessage.error(msg || NETWORK_ERROR)
      return Promise.reject(msg || NETWORK_ERROR)
    }
  },
  (err) => {
    if (err.response && err.response.data && err.response.data.code === 401) {
      // token失效
      store.commit('user/outLogin')
    }
    ElMessage.error(err.message)
    return Promise.reject(err)
  }
)

function request(options) {
  options.method = options.method || 'get'

  // 处理get的参数，统一使用data传递参数
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }

  let isMock = config.mock
  // 判断请求参数是否传递了mock
  if (typeof options.mock != 'undefined') {
    isMock = options.mock
  }
  //判断当前的环境变量
  if (config.env === 'production') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
  }

  return service(options)
}

export default request
