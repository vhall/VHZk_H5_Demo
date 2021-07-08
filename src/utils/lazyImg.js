/**
 * 列表图片懒加载
 * @export LazyImg
 * @class LazyImg
 * @author yongguan.yang
 */
export default class LazyImg {
  /**
   * @param option 配置
   * @returns {LazyImg}
   */
  constructor (option) {
    this.lazyItemList = null
    this.domHeight = 0
    this.oldTop = 0
    this.option = {
      ele: '',
      type: 'img', // img | bg
      imgFlg: 'url',
      imgFlgEle: 'img',
      childEle: '',
      scroll: 'Y',
      offsetDistance: 0
    }
    this.option = Object.assign(this.option, option)
    this.option.ele = this.option.ele || document.body
    this.initData()
    return this
  }
  initData () {
    if (typeof this.option.ele === 'string') {
      const ele = document.querySelector(this.option.ele)
      if (!ele) {
        console.error('找不到滚动容器')
        return
      }
      this.option.ele = ele
    }
    this.option.scroll = this.option.scroll.toLocaleUpperCase()
    if (this.option.type === 'bg') {
      if (!this.option.imgFlgEle) {
        console.error('type等于bg时imgFlgEle必传')
        return
      }
    }
    this.loadImg()
  }
  loadImg () {
    if (this.option.childEle) {
      this.lazyItemList = this.option.ele.querySelectorAll(this.option.childEle)
    } else {
      this.lazyItemList = this.option.ele.childNodes
    }
    this.domHeight = this.option.ele.offsetHeight
    this.option.ele.onscroll = (e) => {
      this.domHeight = this.domHeight || this.option.ele.offsetHeight
      if (!this.domHeight) {
        return
      }
      this.checkImg()
    }
  }
  update () {
    if (this.option.childEle) {
      this.lazyItemList = this.option.ele.querySelectorAll(this.option.childEle)
    } else {
      this.lazyItemList = this.option.ele.childNodes
    }
    this.domHeight = this.domHeight || this.option.ele.offsetHeight
    if (!this.domHeight) {
      return
    }
    this.oldTop = 0
    this.checkImg()
  }
  checkImg () {
    let sTop = this.option.ele.scrollTop
    if (this.oldTop > sTop) { // 向上滚动
      return
    }
    this.oldTop = sTop
    if (this.lazyItemList) {
      let temp = []
      let offsetHeight = sTop + this.domHeight + this.option.offsetDistance
      for (let idx = 0; idx < this.lazyItemList.length; idx++) {
        const imgItem = this.lazyItemList[idx]
        let offsetH = offsetHeight - imgItem.offsetTop
        const img = imgItem.querySelector(this.option.imgFlgEle)
        if (offsetH > 0) {
          const url = img.getAttribute(this.option.imgFlg)
          if (this.option.type === 'bg' && url) {
            img.style.backgroundImage = `url(${url})`
            img.removeAttribute(this.option.imgFlg)
            continue
          } else if (this.option.type === 'img' && !img.src) {
            img.src = url
            img.removeAttribute(this.option.imgFlg)
            continue
          }
        }
        temp.push(imgItem)
      }
      // 性能优化,只遍历为加载过的图片
      this.lazyItemList = temp
    }
  }
}
