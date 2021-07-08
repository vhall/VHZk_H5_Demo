import Com from './com'
import directiveOptions from './directive'
import fun from './fun'

export default (Vue) => {
  Vue.component(Com.name, Com)
  Vue.prototype.$loading = fun
  Vue.directive(Com.name, directiveOptions)
}

export const Loading = fun
