/**
 * 解决手机端局部滚动导致的body滚动（微信中）
 * @export OverFlex
 * @class OverFlex
 * @author yongguan.yang
 */
export default class OverFlex {
  /**
   * @param opt 配置，仅支持class和id两种
   * @returns {OverFlex}
   */
  constructor (opt) {
    this.setOption(opt)
    this.deal()
  }
  /**
   * @param opt 配置，仅支持class和id两种
   */
  setOption (opt) {
    if (!opt) {
      return
    }
    if (opt.constructor === Array) {
      this.dealList = [...opt]
    } else {
      this.dealList = [opt]
    }
  }
  deal () {
    document.body.addEventListener('touchmove', e => {
      let classStr = e.target.getAttribute('class')
      let idStr = e.target.getAttribute('id')
      let matchStr = ''
      let result = this.dealList.every((s) => {
        if (s.substring(0, 1) === '#') {
          matchStr = idStr
        } else {
          matchStr = classStr
        }
        if (matchStr && matchStr.indexOf(s) != -1) {
          return false
        }
        return true
      })
      if (!result) {
        e.preventDefault()
      }
    }, { passive: false })
  }
}
