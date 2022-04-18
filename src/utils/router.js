/**
 * 处理动态路由
 */
// 返回所有子路由
function getRouter(routers) {
  return routers.filter((route) => {
    return route.children && route.children.length > 0
  })
}
/**
 * 清除一级路由，保留子路由
 * @param {*} routers
 */
export const fiterRouter = (routers) => {
  let childrenRoutes = getRouter(routers)
  return routers.filter((router) => {
    return childrenRoutes.find((childrenRouter) => {
      return childrenRouter.path === router.path
    })
  })
}

/**
 * 判断数据是否为空
 * @param {*} data
 */
function isNull(data) {
  if (!data) return true
  if (JSON.stringify(data) === '{}') return true
  if (JSON.stringify(data) === '[]') return true
  return false
}

export const generateMenu = (routers) => {
  const res = []
  routers.forEach((item) => {
    // 1.如果chindren,meta不存在，直接return
    if (isNull(item.children) && isNull(item.meta)) return

    // 2.如果chindren存在，meta不存在，则遍历chindren
    if (!isNull(item.children) && isNull(item.meta)) {
      res.push(...generateMenu(item.children))
      return
    }

    let route = {
      ...item,
      children: []
    }
    // 判断title,icon是否存在，存在表示未menu菜单数据
    if (route.meta.title && route.meta.icon) {
      res.push(route)
    }

    if (item.children) {
      route.children.push(...generateMenu(item.children))
    }
  })

  return res
}
