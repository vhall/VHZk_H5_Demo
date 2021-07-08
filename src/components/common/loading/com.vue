<template>
  <div v-show="visible" class="com-notification" :class="{'notification-model':type=='model'}" :style="style">
    <div class="inner-wrap">
      <i class="loading-icon"></i>
      <span class="loading-txt" v-if="loadingText">{{loadingText}}</span>
    </div>
    <div class="model-wrap">
      <div class="model-content">
        <i class="loading-icon"></i>
        <p v-if="loadingText" v-html="loadingText"></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComLoading',
  props: {
    type: {
      type: String,
      default: ''
    },
    loadingText: {
      type: String,
      default: 'Loading'
    },
    relative: Boolean
  },
  data () {
    return {
      visible: true
    }
  },
  computed: {
    style () {
      const ret = {}
      if (this.relative) {
        ret.position = 'absolute'
      }
      return ret
    }
  }
}
</script>

<style lang="scss" scoped>
.com-notification /deep/ {
  position: fixed;
  z-index: 15;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  .inner-wrap {
    color: #F7F7F7;
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 28px;
    .loading-txt {
      margin-top: 20px;
      display: block;
    }
  }
  .loading-icon{
    display: inline-block;
    width: 64px;
    height: 64px;
    background-image: url("../../../assets/image/loading-icon.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    animation:gogogo 1s infinite linear;
  }
  .model-wrap{
    display: none;
  }
  @keyframes com-rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
.notification-model{
  background-color: rgba(0, 0, 0, 0);
  .inner-wrap{
    display: none;
  }
  .model-wrap{
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 320px;
    height: 320px;
    background-color: #313131;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 28px;
    border-radius:4px;
    opacity:0.95;
    box-shadow:0px 0 10px rgba(0,0,0,0.4);
    .model-content{
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      text-align: center;
      p {
        font-size: 28px;
        display: block;
        margin: 10px 20px 0 20px;
        color: #F7F7F7;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }
}
@-webkit-keyframes gogogo {
  0%{
    transform: rotate(0deg);
  }
  50%{
    transform: rotate(180deg);
  }
  100%{
    transform: rotate(360deg);
  }
}
</style>
