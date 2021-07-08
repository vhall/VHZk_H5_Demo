<template>
  <div class="q-edit-content">
    <div class="q-checklist">
      <div class="q-checklist-item"
           :class="{'is-active':op.isActive}"
           v-for="(op,idx) in options"
           :key="idx"
           @click="changeSelect(idx)">
        <span class="q-checklist-label">{{op.label}}</span>
        <div class="q-checklist-box is-right"></div>
      </div>
    </div>
    <div v-if="errorTip"
         class="error-msg">{{errorTip}}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      valArr: [],
      errorTip: '',
      options: []
    }
  },
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    'value.detail.list': {
      handler (newValue) {
        this.options = []
        newValue.forEach((item) => {
          this.options.push({
            label: item.value,
            value: item.key,
            isActive: false
          })
        })
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    changeSelect (idx) {
      this.options[idx].isActive = !this.options[idx].isActive
      this.change()
    },
    delItem (index) {
      this.value.detail.list.splice(index, 1)
    },
    change () {
      this.errorTip = ''
      let arr = []
      this.options.forEach((item) => {
        if (item.isActive) {
          arr.push(item.value)
        }
      })
      this.valArr = arr
    },
    itemFocus (item) {
      if (item.error) {
        item.error = false
        item.value = ''
      }
    },
    validate () {
      let result = true
      if (!this.value.title) {
        result = false
        this.value.error = true
        this.value.title = '请设置问卷内容'
      }
      this.value.detail.list.forEach(item => {
        if (!item.value) {
          result = false
          item.value = '请设置选项内容'
          item.error = true
        } else {
          item.error = false
        }
      })
      return result
    },
    check () {
      if (this.value.required === 'Y' && (!this.valArr || this.valArr.length === 0)) {
        this.errorTip = '此项为必填项'
        return false
      }
      let ext = this.value.ext
      if (this.value.ext.includes('{')) {
        ext = JSON.parse(this.value.ext).key
      }
      let returnVal = ''
      if (this.valArr) {
        if (this.valArr.length === 1) {
          returnVal = this.valArr[0]
        } else if (this.valArr.length > 1) {
          returnVal = this.valArr.join(',')
        }
      }
      return { id: this.value.id, value: returnVal, type: ext }
    }
  }
}
</script>

<style scoped lang="scss">
  $color-blue: #4B5AFE;
.q-edit-content {
  position: relative;
  padding-bottom: 30px;
  margin-top: -10px;
  .q-checklist{
    .q-checklist-item{
      position: relative;
      line-height: 50px;
      padding: 20px 20px;
      font-size: 28px;
      margin: 20px 0;
      border: 1px solid #d9d9d9;
      border-radius: 5px;
      .q-checklist-label{
        display: inline-block;
        width: calc(100% - 42px);
        line-height: 40px;
        padding-top: 2px;
      }
      .q-checklist-box{
        width: 40px;
        height: 40px;
        line-height: 40px;
        margin-top: 25px;
        border: 1px solid #d9d9d9;
        box-sizing: border-box;
      }
      .is-right{
        position: absolute;
        top: 50%;
        right: 20px;
        margin-top: -20px;
      }
      &.is-active{
        transition: all .3s;
        border-color: $color-blue;
        background-color: rgba(75,90,254,.1);
        .q-checklist-box{
          border: 3px solid $color-blue;
          text-align: center;
          box-sizing: border-box;
          border-radius: 4px;
          background-color: $color-blue;
          &:after{
            position: absolute;
            top: 0;
            left: 10px;
            border: 6px solid #fff;
            border-left: 0;
            border-top: 0;
            content: " ";
            width: 8px;
            height: 22px;
            transition: transform .2s;
            transform: rotate(45deg) scale(1);
            border-radius: 3px;
          }
        }
      }
    }
  }
  .error-msg {
    position: absolute;
    bottom: 16px;
    color: #fc5659;
    padding-left: 10px;
    line-height: 20px;
    font-size: 28px;
  }
}
</style>
