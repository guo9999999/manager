/**
 * 处理token是否失效
 *
 */
import { LOGIN_TIME, LOGIN_LOSE_TIME } from '@/constant/index.js'
import { localGetItem, localSetItem } from './storage.js'

export const getTokenTime = () => {
  return localGetItem(LOGIN_TIME)
}
export const setTokenTime = () => {
  // 获取当前时间戳
  let time = Date.now()
  return localSetItem(LOGIN_TIME, time)
}

export function isCheckTime() {
  // 获取当前时间
  let nowTime = Date.now()
  // 存储的时间戳
  let getTime = getTokenTime()
  // 如果当前时间-缓存时间，大于设定的时间戳，表示token已过期
  return nowTime - getTime > LOGIN_LOSE_TIME
}
