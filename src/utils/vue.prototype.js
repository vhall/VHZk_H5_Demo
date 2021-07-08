import Vue from 'vue'
Vue.prototype.$imgHost = window.VHALL_ZK.$imgHost
Vue.prototype.$staticHost = process.env.PUBLIC_PATH
Vue.prototype.$onload = false
let debounceTimeout
Vue.prototype.$debounce = (func, wait = 1000) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  let callNow = !debounceTimeout
  debounceTimeout = setTimeout(() => {
    clearTimeout(debounceTimeout)
    debounceTimeout = null
  }, wait)
  if (callNow) func()
}
Vue.prototype.$isWx = () => {
  let ua = navigator.userAgent.toLowerCase()
  let isWeixin = ua.indexOf('micromessenger') !== -1
  if (isWeixin) {
    return true
  }
  return false
}
Vue.prototype.$throttle = (func, wait) => {
  let previous = 0
  return function() {
    let now = Date.now()
    let context = this
    let args = arguments
    if (now - previous > wait) {
      func.apply(context, args)
      previous = now
    }
  }
}
Vue.prototype.$inIframe = (self != top)
