import Com from './com.vue'

export default {
  extends: Com,
  props: {
    position: {
      type: String,
      default: 'center'
    }
  },
  data () {
    return {
      verticalOffset: 0,
      height: 0,
      width: 0,
      halfWidth: 0,
      visible: false,
      autoClose: 2000,
      timerId: 0
    }
  },
  mounted () {
    this.createTask()
  },
  beforeDestory () {
    this.clearTask()
  },
  methods: {
    createTask () {
      if (!this.autoClose) return
      this.timerId = setTimeout(() => {
        this.$emit('close')
        // this.visible = false
      }, this.autoClose)
    },
    clearTask () {
      if (!this.timerId) return
      clearTimeout(this.timerId)
    },
    afterEnter () {
      this.height = this.$el.offsetHeight
    }
  }
}
