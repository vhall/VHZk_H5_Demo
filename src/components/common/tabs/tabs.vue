
<script>
import Nav from './nav.vue'

export default {
  name: 'ComTabs',
  components: {
    ComNav: Nav
  },
  props: {
    position: {
      type: String,
      default: ''
    },
    disabled: Boolean,
    type: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      panes: []
    }
  },
  methods: {
    change (index) {
      if (this.disabled) return
      this.$emit('update:value', index)
      this.$emit('change', index)
    }
  },
  updated () {
    if (this.$refs.nav) {
      this.$refs.nav.$forceUpdate()
    }
  },
  render () {
    const navData = {
      props: {
        panels: this.panes,
        currentName: this.value
      },
      ref: 'nav'
    }
    const header = (
      <div class="tab-header">
        <com-nav {...navData}></com-nav>
      </div>
    )
    const panels = (
      <div class="tab-container">
        {this.$slots.default}
      </div>
    )

    const classNames = {
      'com-tabs': true
    }
    if (this.position) {
      classNames[this.position] = true
    }
    if (this.type) {
      classNames[this.type] = true
    }
    return (
      <div class={classNames}>
        {[header, panels]}
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
.com-tabs {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  .tab-header {
    font-size: 0;
    width: 100%;
    height: 80px;
    white-space: nowrap;
    margin-bottom: 15px;
  }
  .tab-container {
    flex: 1;
    position: relative;
  }
  &.slider {
    .tab-header {
      &::after {
        content: '';
        display: inline-block;
        width: 100%;
        height: 2px;
        background-color: #e4e7ed;
      }
    }

    &.left {
      overflow: hidden;
      .tab-header {
        float: left;
        height: 100%;
        margin-right: 15px;
        margin-bottom: 0;
        position: relative;
        &::after {
          position: absolute;
          content: '';
          display: inline-block;
          width: 2px;
          height: 100%;
          right: 0;
          background-color: #e4e7ed;
        }
      }
      .tab-container {
        float: left;
      }
    }
  }
  &.card {
    background: #fff;
    border: 1px solid #dcdfe6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
    .tab-header {
      background-color: #f5f7fa;
      margin-bottom: 0;
      &::after {
        content: '';
        display: inline-block;
        width: 100%;
        height: 1px;
        background-color: #e4e7ed;
      }
    }
    .tab-container {
      padding: 15px;
    }

    &.left {
      overflow: hidden;
      .tab-header {
        float: left;
        height: 100%;
        &::after {
          content: '';
          display: inline-block;
          width: 1px;
          height: 100%;
          background-color: #e4e7ed;
        }
      }
      .tab-container {
        float: left;
      }
    }
  }
}
</style>
