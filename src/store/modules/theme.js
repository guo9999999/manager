import { getItem, setItem } from '../../utils/storage.js'
import { COLOR_KEY, DEFAULT_COLOR } from '../../constant'
import variables from '@/assets/style/variables.module.scss'
export default {
  // 命名空间
  namespaced: true,
  state: () => ({
    defaultColor: getItem(COLOR_KEY) || DEFAULT_COLOR,
    variables
  }),
  mutations: {
    setDefaultColor(state, newColor) {
      state.variables.menuBg = newColor
      setItem(COLOR_KEY, newColor)
    }
  },
  actions: {}
}
