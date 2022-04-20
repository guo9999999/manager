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
export const leaveCount = () => {
  return request({
    url: '/leave/count',
    method: 'get',
    data: {},
    mock: true
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
    data,
    mock: true
  })
}
/**
 * 用户列表
 * @param {*} data
 */
export const usersList = (data) => {
  return request({
    url: '/users/list',
    method: 'get',
    data,
    mock: false
  })
}
/**
 * 删除用户
 * @param {*} data
 */
export const usersDel = (data) => {
  return request({
    url: '/users/delete',
    method: 'delete',
    data
  })
}
/**
 * 获取部门信息
 */
export const deptList = () => {
  return request({
    url: '/dept/list',
    method: 'get',
    data: {},
    mock: true
  })
}
/**
 * 获取角色名称列表
 */
export const rolesOperate = () => {
  return request({
    url: '/roles/operate',
    method: 'get',
    data: {},
    mock: true
  })
}
/**
 * 创建用户
 */
export const userCreate = (data) => {
  return request({
    url: '/users/create',
    method: 'post',
    data
  })
}
