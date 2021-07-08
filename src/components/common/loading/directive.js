import Vue from 'vue'
import Com from './com.vue'

export default {
  bind (el, binding, vnode) {},
  inserted (el, binding, vnode) {
    const txt = el.getAttribute('com-loading-text')
    const ComConstructor = Vue.extend(Com)
    const instance = new ComConstructor({
      propsData: {
        loadingText: txt === undefined ? 'Loading' : txt,
        relative: true
      },
      data: {
        visible: binding.value
      }
    })
    instance.vm = instance.$mount()
    el.style.position = 'relative'
    el.appendChild(instance.vm.$el)
    el.instance = instance
  },
  componentUpdated (el, binding, vnode) {
    el.instance.vm.visible = binding.value
  },
  unbind (el, binding, vnode) {
    el.removeChild(el.instance.vm.$el)
    el.instance.vm.$destroy()
  }
}
