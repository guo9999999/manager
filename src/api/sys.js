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
    mock: false
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
export const deptList = (data) => {
  return request({
    url: '/dept/list',
    method: 'get',
    data: data,
    mock: false
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
    mock: false
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
    mock: false
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
    mock: false
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
    mock: false
  })
}
// 创建部门信息
export const deptOperate = (data) => {
  return request({
    url: '/dept/operate',
    method: 'post',
    data,
    mock: false
  })
}

// 获取所有用户列表
export const allUserList = () => {
  return request({
    url: '/users/all/list',
    method: 'get',
    data: {},
    mock: false
  })
}
//获取当前用户的权限
export const getPermissionList = () => {
  return request({
    url: '/users/getPermissionList',
    method: 'get',
    data: {},
    mock: false
  })
}
// 获取审批列表·
export const leaveList = (data) => {
  return request({
    url: 'leave/list',
    method: 'get',
    data,
    mock: false
  })
}
//申请休假
export const leaveOperate = (data) => {
  return request({
    url: 'leave/operate',
    method: 'post',
    data,
    mock: false
  })
}
// 审批
export const leaveApprove = (data) => {
  return request({
    url: 'leave/approve',
    method: 'post',
    data,
    mock: false
  })
}
