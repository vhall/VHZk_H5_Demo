<template>
  <div class="com-zan">
    <span v-if="showIdx==0" class="com-zan-icon com-zan-icon-01 zan-animation-01"></span>
    <span v-if="showIdx==1" class="com-zan-icon com-zan-icon-02 zan-animation-01"></span>
    <span v-if="showIdx==2" class="com-zan-icon com-zan-icon-03 zan-animation-01"></span>
    <span v-if="showIdx==3" class="com-zan-icon com-zan-icon-04 zan-animation-01"></span>
    <span v-if="showIdx==4" class="com-zan-icon com-zan-icon-05 zan-animation-01"></span>
    <span v-if="showIdx==5" class="com-zan-icon com-zan-icon-06 zan-animation-01"></span>
    <span v-if="showIdx==6" class="com-zan-icon com-zan-icon-07 zan-animation-01"></span>
    <span v-if="showIdx==7" class="com-zan-icon com-zan-icon-08 zan-animation-01"></span>
  </div>
</template>

<script>
export default {
  name: 'com-zan',
  props: {
    showIdx: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
  .com-zan{
    position: fixed;
    right: 0;
    bottom: 0;
    display: block;
    width: 100px;
    height: 100px;
    transform: translateY(-100%);
    z-index: 1000;
    .com-zan-icon {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      opacity: 0;
      background-size: cover;
      transform: translate3d(0, 50px, 0);
    }
    .zan-animation-01 {
      animation: topFrame1 2s linear 0s;
    }
    .zan-animation-02 {
      animation: topFrame2 2s linear 0s;
    }
    .com-zan-icon-01 {
      background-image: url('./img/zan-con01.png');
      width: 100px;
      height: 100px;
    }
    .com-zan-icon-02 {
      background-image: url('./img/zan-con02.png');
    }
    .com-zan-icon-03 {
      width: 80px;
      height: 80px;
      background-image: url('./img/zan-con03.png');
    }
    .com-zan-icon-04 {
      width: 40px;
      height: 40px;
      background-image: url('./img/zan-con04.png');
    }
    .com-zan-icon-05 {
      background-image: url('./img/zan-con05.png');
    }
    .com-zan-icon-06 {
      width: 80px;
      height: 80px;
      background-image: url('./img/zan-con06.png');
    }
    .com-zan-icon-07 {
      width: 60px;
      height: 60px;
      background-image: url('./img/zan-con-07.png');
    }
    .com-zan-icon-08 {
      width: 80px;
      height: 80px;
      background-image: url('./img/zan-con03.png');
    }
  }
  @keyframes topFrame1 {
    0% {
      top: 0px;
      opacity: 1;
    }
    10% {
      top: -60px;
      left: -60px;
    }
    20% {
      top: -120px;
      left: 0px;
    }
    30% {
      top: -180px;
      right: -60px;
    }
    40% {
      top: -240px;
      right: 0;
    }
    50% {
      top: -300px;
      left: -60px;
    }
    60% {
      top: -360px;
      left: 0;
    }
    70% {
      top: -420px;
      right: -60px;
    }
    80% {
      top: -480px;
      right: 0;
      opacity: .8;
    }
    90% {
      top: -600px;
      left: -60px;
    }
    100% {
      top: -660px;
      left: 0;
      opacity: 0;
    }
  }
  @keyframes topFrame2 {
    0% {
      top: -60px;
      opacity: 1;
    }
    10% {
      top: -120px;
      right: -60px;
    }
    20% {
      top: -180px;
      right: 0px;
    }
    30% {
      top: -240px;
      left: -60px;
    }
    40% {
      top: -300px;
      left: 0;
    }
    50% {
      top: -360px;
      right: -60px;
    }
    60% {
      top: -420px;
      right: 0;
    }
    70% {
      top: -480px;
      left: -60px;
    }
    80% {
      top: -540px;
      left: 0;
      opacity: .8;
    }
    90% {
      top: -600px;
      right: -60px;
    }
    100% {
      top: -660px;
      right: 0;
      opacity: 0;
    }
  }
</style>
