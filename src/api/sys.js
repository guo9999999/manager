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
    url: '/users/login',
    method: 'post',
    data
  })
}

/**
 *获取待审批通知数量
 */
export const leaveCount = (data = {}) => {
  return request({
    url: '/leave/count',
    method: 'get',
    data
  })
}
/**
 * 菜单列表
 * @param {*} data
 */
export const menuList = (data) => {
  return request({
    url: '/menu/list',
    method: 'post',
    data
  })
}
