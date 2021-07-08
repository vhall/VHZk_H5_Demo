<script>
export default {
  props: {
    panels: {
      type: Array,
      required: true
    },
    currentName: [String, Number]
  },
  methods: {
    handleClick (index) {
      this.$parent.change(index)
    }
  },
  render () {
    const tabs = this.panels.map((panel, index) => {
      const tab = panel.$slots.label || <span>{panel.label}</span>
      const classNames = {
        'tab-item': true,
        active: this.panels.length === 1 ? false : this.currentName === panel.index
      }
      let countNums = ''
      if (panel.nums) {
        countNums = <em>{panel.nums}</em>
      }
      return (
        <li type={panel.index} class={classNames} on-click={() => { this.handleClick(panel.index) }}>
          {tab}
          {countNums}
        </li>
      )
    })
    return (
      <ul class="tab-header-wrap">
        {tabs}
      </ul>
    )
  }
}
</script>

<style lang="scss" scoped>
.tab-header-wrap{
  width:100%;
  display: flex;
  text-align: center;
  flex-direction: row;
  overflow-x:scroll;
  overflow-y:hidden;
  -webkit-overflow-scrolling: touch;
}
.tab-item {
  position: relative;
  display: inline-block;
  height: 80px;
  // min-width:120px;
  line-height: 80px;
  text-align: center;
  font-size: 30px;
  color: #555;
  span{
    font-weight: 500;
    padding: 0px 15px;
  }
  em{
    display: inline-block;
    position: absolute;
    top: 6px;
    right: -20px;
    max-height: 30px;
    padding: 6px 10px 5px 10px;
    border-radius: 15px;
    color: #fff;
    font-size: 20px;
    line-height: 20px;
    background-color: #FC5659;
  }
  &.active {
    color: #FFD021;
    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 4px;
      background-color: #FFD021;
      border-radius: 3px;
      position: absolute;
      bottom: 1px;
      left: 0px;
      // margin-left: -35px;
    }
  }
}
.slider {
  .tab-header-wrap {
    margin-bottom: -2px;
    position: relative;
    z-index: 1;
  }
  .tab-item.active {
    & > * {
      display: inline-block;
      height: 100%;
      border-bottom: 2px solid #409eff;
    }
  }
  &.left {
    .tab-header-wrap {
      float: left;
      margin-bottom: 0;
    }
    .tab-item {
      display: block;
      text-align: right;
      border-right: 2px solid transparent;
      &.active {
        border-right: 2px solid #409eff;
      }
      & > * {
        display: inline-block;
        border-bottom: 0;
      }
    }
  }
}
.card {
  .tab-header-wrap {
    margin-bottom: -1px;
    position: relative;
    z-index: 1;
  }
  .tab-item {
    &.active {
      border-bottom: 1px solid transparent;
      border-left: 1px solid #e4e7ed;
      border-right: 1px solid #e4e7ed;
      // background-color: white;
      &:first-child {
        border-left: 0;
      }
    }
  }
  &.left {
    .tab-header-wrap {
      float: left;
      margin-right: -1px;
      margin-bottom: 0;
    }
    .tab-item {
      display: block;
      border-left: 0;
      &.active {
        border-right: 1px solid transparent;
        border-top: 1px solid #e4e7ed;
        border-bottom: 1px solid #e4e7ed;
        &:first-child {
          border-top: 0;
        }
      }
    }
  }
}
</style>
