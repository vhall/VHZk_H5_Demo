<template>
  <div class="q-edit-content">
    <!--<mt-radio-->
      <!--align="right"-->
      <!--v-model="val"-->
      <!--@change="change"-->
      <!--:options="options">-->
    <!--</mt-radio>-->
    <div class="q-checklist">
      <div class="q-checklist-item" :class="{'is-active':op.isActive}"
           v-for="(op,idx) in options"
           :key="idx"
           @click="changeSelect(idx)">
        <span class="q-checklist-label">{{op.label}}</span>
        <div class="q-checklist-box is-right"></div>
      </div>
    </div>
    <div v-if="errorTip" class="error-msg">{{errorTip}}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      val: '',
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
      this.options.forEach((item) => {
        item.isActive = false
      })
      this.options[idx].isActive = true
      this.val = this.options[idx].value
      this.change()
    },
    delItem (index) {
      this.value.detail.list.splice(index, 1)
    },
    change () {
      this.errorTip = ''
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
      if (this.value.required === 'Y' && !this.val) {
        this.errorTip = '此项为必填项'
        return false
      }
      let ext = this.value.ext
      if (this.value.ext.includes('{')) {
        ext = JSON.parse(this.value.ext).key
      }
      return { id: this.value.id, value: this.val, type: ext }
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
        width: 42px;
        height: 42px;
        line-height: 42px;
        border: 1px solid #d9d9d9;
        box-sizing: border-box;
        border-radius: 50%;
      }
      .is-right{
        position: absolute;
        top: 50%;
        right: 20px;
        margin-top: -21px;
      }
      &.is-active{
        transition: all .3s;
        border-color: $color-blue;
        background-color: rgba(75,90,254,.1);
        .q-checklist-box{
          border: 12px solid $color-blue;
          box-sizing: border-box;
          border-radius: 50%;
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
