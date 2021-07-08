<script>
export default {
  name: 'ComTab',
  props: {
    index: {
      required: true,
      type: [Number, String]
    },
    label: {
      type: String,
      default: 'tab'
    },
    nums: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      width: 0,
      height: 0,
      offsetLeft: 0,
      offsetTop: 0
    }
  },
  mounted () {
    this.$parent.panes.push(this)
  },
  render () {
    return (
      <div class="tab-content" v-show={this.index === this.$parent.value}>{this.$slots.default}</div>
    )
  }
}
</script>

<style lang="scss" scoped>
.tab-content {
  position: relative;
}
</style>
