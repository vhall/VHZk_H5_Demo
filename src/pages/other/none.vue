<template>
  <div class="exit-email-box">
    <div>
      <div class="content">
        <i class="iconfont icon-delete" style="font-size:36px"></i>
        <span>无效页面</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'invalid-page'
}
</script>
<style lang="scss" scoped>
.exit-email-box {
  height: 100vh;
  background-color: #f5f5f5;
  div {
    position: relative;
    height: 100vh;
    background-color: #fff;
    border: solid 1px #e2e2e2;
    border-radius: 4px;
    .icon-Shapex{
      color: #FC5659;
      font-size: 50px;
    }
    span {
        display: block;
        line-height: 60px;
        font-size: 24px;
        text-align: center;
        color: #222;
    }
    .content {
      position: absolute;
      top: 30%;
      left: 50%;
      width: 314px;
      height: 90px;
      margin-left: -157px;
      border: none;
      text-align: center;
    }
  }
}
</style>
