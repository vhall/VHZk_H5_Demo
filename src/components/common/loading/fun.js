import Vue from 'vue'
import Com from './com.vue'

const ComConstructor = Vue.extend(Com)
let instance = null
export default (options = {}) => {
  let state = true
  let loadingText
  let target
  if (options === false) {
    state = false
  } else {
    ;({ loadingText, target } = options)
  }

  if (!instance && state) {
    instance = new ComConstructor({
      propsData: {
        type: options.type === undefined ? '' : options.type,
        loadingText: loadingText === undefined ? 'Loading' : loadingText,
        relative: !!target
      }
    })

    instance.vm = instance.$mount()
    let root = document.body
    let st = setTimeout(() => {
      clearTimeout(st)
      if (target && document.querySelector(target)) {
        root = document.querySelector(target)
      }
      if (instance && instance.vm) {
        root.appendChild(instance.vm.$el)
      }
    }, 0)
  } else {
    if (instance) {
      instance.vm.visible = state
      if (!state) {
        instance = null
        return null
      }
    }
  }

  return instance ? instance.vm : null
}
