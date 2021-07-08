const emojiFace = VHALL_ZK.$chat.getEmojiArr()
/* 将文本中的表情文字转为图片 */
export const convertEmoji = stringTxt => {
  let relt = stringTxt
  for (let i = 0; i < emojiFace.length; i++) {
    for (let key in emojiFace[i]) {
      let test = key.replace(/\[/, '\\[').replace(/\]/, '\\]')
      let reg = new RegExp(test, 'g')
      relt = relt.replace(
        reg,
        "<img src='//cnstatic01.e.vhall.com/static/img/arclist/Expression_" +
          emojiFace[i][key] +
          "@2x.png'>"
      )
    }
  }
  return relt
}
/* 将文本中的链接文字转为a标签 */
export const convertLink = stringTxt => {
  let relt = ''
  /* eslint-disable */
  let reg = /(https:\/\/|http:\/\/|\/\/|www\.)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g
  relt = stringTxt.replace(reg, url => {
    let href = url
    if (url.indexOf('www.') === 0) {
      href = `//${url}`
    }
    return `<a class='a_link' href="${href}" title="点击打开链接" target='_blank'>${url}</a>`
  })
  return relt
}
/* 将文本中的富文本标签转义 */
export const convertXss = stringTxt => {
  let relt = ''
  relt = stringTxt.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return relt
}
/* 获取根据人数和系数获取延迟时间 */
export function delayTime(n, o) {
  n = n || 0
  o = o || 1
  let result = 0
  if (n <= 500) {
    result = 3
  } else if (n <= 1000) {
    // 大于500，小于1000
    result = 10
  } else if (n <= 2000) {
    // 大于1000，小于2000
    result = 15
  } else if (n <= 5000) {
    // 大于2000，小于5000
    result = 30
  } else if (n > 5000) {
    // 大于5000
    result = 60
  }
  return result
}
