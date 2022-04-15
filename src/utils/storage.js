/**
 * 封装存储数据
 */

/**
 * 获取数据
 */
export const getItem = (key) => {
  let data = sessionStorage.getItem(key)
  //  对data数据进行转换，如果为错误，表示是简单数据类型
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

//
export const localGetItem = (key) => {
  let data = localStorage.getItem(key)
  //  对data数据进行转换，如果为错误，表示是简单数据类型
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}
/**
 * 存储数据
 * @param {存储的名称} key
 * @param {存储的数据} data
 */
export const setItem = (key, data) => {
  // 判断是否为引用数据类型，如果是，json为字符串
  if (typeof data === 'object') {
    data = JSON.stringify(data)
  }
  sessionStorage.setItem(key, data)
}

export const localSetItem = (key, data) => {
  // 判断是否为引用数据类型，如果是，json为字符串
  if (typeof data === 'object') {
    data = JSON.stringify(data)
  }
  localStorage.setItem(key, data)
}

/**
 *
 * 删除数据
 * @param {*} key
 */
export const removeItem = (key) => {
  sessionStorage.removeItem(key)
}

export const localRemoveItem = (key) => {
  localStorage.removeItem(key)
}
