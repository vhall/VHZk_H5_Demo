import Vue from 'vue'
import Extend from './extend'

const ComConstructor = Vue.extend(Extend)
let instancesTemp = null
const spacing = 20
let id = 1
export default (options) => {
  if (typeof options === 'string') {
    options = { content: options }
  }
  const {
    autoClose,
    close,
    closed,
    ...rest
  } = options
  const instance = new ComConstructor({
    propsData: {
      ...rest
    },
    data: {
      autoClose: autoClose === undefined ? 2000 : autoClose
    }
  })
  if (instancesTemp) {
    document.body.removeChild(instancesTemp.vm.$el)
    instancesTemp.vm.$destroy()
    instancesTemp = null
  }
  instance.id = `notification_${id++}`
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.visible = true
  let verticalOffset = 0
  verticalOffset += spacing
  instance.verticalOffset = verticalOffset
  instancesTemp = instance
  instance.vm.$on('close', () => {
    close && close()
    document.body.removeChild(instance.vm.$el)
    instance.vm.$destroy()
    instancesTemp = null
  })
  instance.vm.$on('closed', () => {
    closed && closed()
    document.body.removeChild(instance.vm.$el)
    instance.vm.$destroy()
    instancesTemp = null
  })

  return instance.vm
}
