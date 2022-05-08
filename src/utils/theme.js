//获取当前 element-plus 的默认样式表
// 导入转换RGB(A)颜色为十六进制
import rgbHex from 'rgb-hex'
// 导入在CSS中提出的颜色函数的解析器和转换器
import color from 'css-color-function'
// 导入颜色转换表
import formula from '../constant/formula.json'
import axios from 'axios'
const getElementStyle = async () => {
  // let version = import.meta.globEager('element-plus/package.json')
  // console.log(version)
  let url = `https://unpkg.com/element-plus@2.1.9/dist/index.css`
  const { data } = await axios(url)
  return getStyleTemplate(data)
}
/**
 * 返回 style 的 template
 * @param {*} data
 */
const getStyleTemplate = (data) => {
  // element默认色值
  const colorMap = {
    '#3a8ee6': 'shade-1',
    '#409eff': 'primary',
    '#53a8ff': 'light-1',
    '#66b1ff': 'light-2',
    '#79bbff': 'light-3',
    '#8cc5ff': 'light-4',
    '#a0cfff': 'light-5',
    '#b3d8ff': 'light-6',
    '#c6e2ff': 'light-7',
    '#d9ecff': 'light-8',
    '#ecf5ff': 'light-9'
  }
  Object.keys(colorMap).forEach((key) => {
    const value = colorMap[key]
    data = data.replace(new RegExp(key, 'ig'), value)
  })
  return data
}
/**
 * 根据主色调，生成新的样式表，
 * @param {*} primaryColor 主色调
 */
export const generateNewStyle = async (primaryColor) => {
  // 通过主色调获取色值表
  let colors = primaryColors(primaryColor)

  // 获取element的所有样式getElementStyle 返回的是primary
  let cssText = await getElementStyle()
  // 遍历生成的样式表，在 CSS 的原样式(cssText)中进行全局替换
  Object.keys(colors).forEach((key) => {
    cssText = cssText.replace(
      new RegExp('(:|\\s+)' + key, 'g'),
      '$1' + colors[key]
    )
  })
  return cssText
}
/**
 * 根据主色调生成色值表
 * @param {*} primary 主色调
 */
export const primaryColors = (primary) => {
  if (!primary) return
  let colors = {
    primary
  }
  // 通过Object.keys取出对象里面的key值，并添加成一个数组
  Object.keys(formula).forEach((key) => {
    // 通过正则表达式替换掉所有的primary,替换成传递过来的主颜色，如：#90EE90
    let value = formula[key].replace(/primary/g, primary)
    //
    // 1.通过在CSS中提出的颜色函数的解析器和转换器(转换成rgb)
    // 2.通过rgbHex,转换RGB(A)颜色为十六进制
    // 3.把转换好的添加到对象中
    colors[key] = `#${rgbHex(color.convert(value))}`
  })
  console.log(colors)
  return colors
}
/**
 * 写入新样式到 style
 * @param {*} elNewStyle
 */
export const writeStyle = (elNewStyle) => {
  const style = document.createElement('style')
  style.innerHTML = elNewStyle
  document.head.appendChild(style)
}
