/**
 * 快捷访问
 */

import { COLOR_KEY } from '../constant/'
import { getItem } from '../utils/storage.js'
import { primaryColors } from '../utils/theme.js'
const getters = {
  token: (state) => state.user.token, // token值
  cssVar: (state) => {
    return {
      ...state.theme.variables,
      ...primaryColors(getItem(COLOR_KEY))
    }
  },
  userInfo: (state) => state.user.userInfo, //用户信息
  hasUserInfo: (state) => {
    return JSON.stringify(state.user.userInfo) !== '{}' //判断用户信息是否存在，
  },
  actionList: (state) => state.user.actionList, // 权限按钮数据
  badgeCount: (state) => state.user.badgeCount,
  collapseOpen: (state) => state.user.collapseOpen,
  defaultColor: (state) => state.theme.defaultColor //默认颜色
}

export default getters
