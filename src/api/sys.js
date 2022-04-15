/**
 * 封装请求接口
 */
import request from '../utils/request.js'

/**
 * 登录
 * @param {传递的参数}} data  object
 */
export const login = (data) => {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export const getUserInfo = () => {
  return request({
    url: '/sys/profile'
  })
}
