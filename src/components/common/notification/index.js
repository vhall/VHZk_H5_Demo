import Com from './com'
import fun from './fun'

export default (Vue) => {
  Vue.component(Com.name, Com)
  Vue.prototype.$toast = fun
}

export const Toast = fun
