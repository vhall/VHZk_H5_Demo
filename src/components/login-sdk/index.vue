<template>
  <div class="login-sdk-wrap">
    <div class="login-sdk-box">
      <div class="login-sdk-title">SDK初始化参数</div>
      <div class="login-input">
        <span class="title">app_id：</span>
        <com-input v-model="sdkParams.app_id"
                   :error-tips="sdkParamsError.app_id"
                   @focus="sdkParamsError.app_id=''"/>
      </div>
      <div class="login-input">
        <span class="title">sign：</span>
        <com-input v-model="sdkParams.sign"
                   :error-tips="sdkParamsError.sign"
                   @focus="sdkParamsError.sign=''"/>
      </div>
      <div class="login-input">
        <span class="title">signed_at：</span>
        <com-input v-model="sdkParams.signed_at"/>
      </div>
      <div class="login-input">
        <span class="title">account：</span>
        <com-input v-model="sdkParams.account"
                   :error-tips="sdkParamsError.account"
                   @focus="sdkParamsError.account=''"/>
      </div>
      <div class="login-input">
        <span class="title">activity_id：</span>
        <com-input class="disabled" v-model="sdkParams.activity_id"/>
      </div>
      <button class="default-button primary-button" @click="initSdk">初始化</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login-sdk',
  data () {
    return {
      sdkParams: {
        app_id: '',
        sign: '',
        account: '',
        activity_id: this.$route.params.id,
        signed_at: ''
      },
      sdkParamsError: {
        sign: '',
        app_id: '',
        account: ''
      }
    }
  },
  created () {
    let params = localStorage.getItem('test-params')
    if (params) {
      this.sdkParams = JSON.parse(params)
      this.sdkParams.activity_id = this.$route.params.id
    }
  },
  methods: {
    initSdk () {
      if (!this.sdkParams.app_id) {
        this.sdkParamsError.app_id = 'app_id不能为空'
        return
      }
      if (!this.sdkParams.sign) {
        this.sdkParamsError.sign = 'asign不能为空'
        return
      }
      if (!this.sdkParams.account) {
        this.sdkParamsError.account = 'account不能为空'
        return
      }
      localStorage.setItem('test-params', JSON.stringify(this.sdkParams))
      this.$emit('complete', { ...this.sdkParams })
    }
  }
}
</script>
<style lang='scss' scoped>
  @import "assets/css/mixin.scss";
  .login-sdk-wrap {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(200, 180, 30, .3);
    z-index: 99999;
    .login-sdk-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      padding: 50px;
      border-radius: 10px;
      background-color: #fff;
      .login-sdk-title {
        text-align: center;
        font-size: 36px;
        color: #222;
        font-weight: bold;
        line-height: 40px;
      }
      .login-input {
        margin-top: 20px;
        font-size: 0;
        .title {
          display: block;
          width: 50px;
          font-size: 30px;
          line-height: 40px;
        }
        .com-input {
          width: 100%;
          height: 80px;
          line-height: 80px;
          font-size: 14px;
        }
      }
      .primary-button {
        width: 100%;
        height: 80px;
        border-radius: 40px;
        margin-top: 40px;
      }
    }
  }
</style>
