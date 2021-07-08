<template>
  <div class="iskicked">
    <img src="../../assets/image/kicied@2x.png" alt="">
    <p v-if="type==='audit'">
      抱歉，由于报名审核没有通过
      <br/>
      您已被禁止进入活动
    </p>
    <p v-else>
      抱歉，您已被主持人踢出房间
      <br/>
      如有疑问请联系活动主办方
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: this.$route.query.type
    }
  }
}
</script>

<style lang="scss" scoped>
.iskicked {
  img {
    width: 218px;
    display: block;
    margin: 280px auto 0;
  }
  p {
    font-size: 32px;
    color: #222222;
    text-align: center;
    margin: 60px auto;
  }
}
</style>
