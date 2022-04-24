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
    method: 'get',
    data,
    mock: false
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
/**
 * 菜单创建，删除，编辑
 *
 */
export const menuOperate = (data) => {
  return request({
    url: '/menu/create',
    method: 'post',
    data,
    mock: false
  })
}
/**
 * 获取角色信息
 * @param {*} data
 */
export const roleList = (data) => {
  return request({
    url: '/roles/list',
    method: 'get',
    data,
    mock: true
  })
}
/**
 * 角色创建，编辑，删除
 * @param {*} data
 */
export const roleOperate = (data) => {
  return request({
    url: '/roles/operate',
    method: 'post',
    data,
    mock: true
  })
}
/**
 * 角色设置权限
 * @param {*} data
 */
export const rolesPermission = (data) => {
  return request({
    url: '/roles/update/permission',
    method: 'post',
    data,
    mock: true
  })
}
