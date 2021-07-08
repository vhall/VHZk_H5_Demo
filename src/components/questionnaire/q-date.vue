<template>
  <div class="q-edit-content">
    <input class="q-date-input" type="date" @change="changeTime" v-model="val">
    <div class="q-date-input-show">{{selectTime}}</div>
    <i class="iconfont icon-rili"></i>
    <div v-if="errorTip"
         class="error-msg">{{errorTip}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      val: '',
      errorTip: ''
    }
  },
  computed: {
    selectTime () {
      return this.val ? this.val : '选择日期'
    }
  },
  methods: {
    changeTime () {
      let nowDate = new Date()
      let disTime = nowDate.getTime() - new Date(this.val)
      if (disTime <= 0) {
        this.val = nowDate.format('yyyy-MM-dd')
      }
    },
    focus () {
      this.errorTip = ''
    },
    validate () {
      let result = true
      if (!this.value.title) {
        result = false
        this.value.error = true
        this.value.title = '请设置问卷内容'
      }
      return result
    },
    check () {
      if (this.value.required === 'Y' && !this.val) {
        this.errorTip = '此项为必填项'
        return false
      }
      let ext = JSON.parse(this.value.ext)
      return { id: this.value.id, value: this.val, type: ext.key }
    }
  }
}
</script>

<style scoped lang="scss">
.q-edit-content {
  position: relative;
  .q-date-input-show{
    width: 100%;
    height: 90px;
    line-height: 90px;
    color: rgba(0, 0, 0, 0.65);
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    transition: all 0.3s;
    padding: 0 20px;
    font-size: 28px;
  }
  .q-date-input{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 90px;
    opacity: 0;
    padding: 0 20px;
    color: #222;
    -webkit-appearance: none;
  }
  .iconfont{
    position: absolute;
    right: 16px;
    top: 28px;
    font-size: 28px;
    color: #666;
    z-index: 2;
  }
  /deep/ {
    .error-msg {
      position: absolute;
      bottom: -30px;
      color: #fc5659;
      padding-left: 10px;
      line-height: 20px;
      font-size: 28px;
    }
  }
}
</style>
