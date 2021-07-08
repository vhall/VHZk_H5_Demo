import {
  Loadmore,
  Swipe,
  SwipeItem,
  Range,
  Popup,
  Switch,
  Picker
} from 'mint-ui'

const components = [
  Loadmore,
  Swipe,
  SwipeItem,
  Range,
  Popup,
  Switch,
  Picker
]

const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default install
