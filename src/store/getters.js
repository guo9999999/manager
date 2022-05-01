/**
 * 快捷访问
 */
import variables from '../assets/style/variables.scss'
const getters = {
  token: (state) => state.user.token, // token值
  cssVar: (state) => variables,
  userInfo: (state) => state.user.userInfo, //用户信息
  hasUserInfo: (state) => {
    return JSON.stringify(state.user.userInfo) !== '{}' //判断用户信息是否存在，
  },
  actionList: (state) => state.user.actionList // 权限按钮数据
}

export default getters
