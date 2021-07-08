<template>
  <div class="q-edit-content">
    <select
      v-model="val"
      @focus="isFocus=true"
      @blur="isFocus=false"
      @change="change">
      <option value="">{{value.placeholder||'请选择'}}</option>
      <option v-for="(item,index) in value.detail.list"
              :value="item.key"
              :key="index">{{item.value}}</option>
    </select>
    <i class="iconfont icon-wenjuan_xialatixialajiantou-" :class="{'icon-up':isFocus}"></i>
    <div v-if="errorTip"
         class="error-msg">{{errorTip}}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      val: '',
      isFocus: false,
      errorTip: ''
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
  methods: {
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
      let ext = JSON.parse(this.value.ext)
      return { id: this.value.id, value: this.val, type: ext.key, list: this.value.detail.list }
    }
  }
}
</script>

<style scoped lang="scss">
.q-edit-content {
  position: relative;
  margin-bottom: 30px;
  select{
    width: 100%;
    height: 90px;
    color: rgba(0, 0, 0, 0.65);
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    transition: all 0.3s;
    padding: 0 20px;
    font-size: 28px;
    color: #222;
    -webkit-appearance: none;
  }
  .iconfont{
    display: inline-block;
    position: absolute;
    right: 16px;
    top: 28px;
    font-size: 28px;
    color: #d9d9d9;
  }
  .icon-up{
    transition: transform .3s ease;
    transform: rotate(180deg);
  }
  .error-msg {
    position: absolute;
    color: #fc5659;
    padding-top: 14px;
    padding-left: 10px;
    line-height: 20px;
    font-size: 28px;
  }
}
</style>
