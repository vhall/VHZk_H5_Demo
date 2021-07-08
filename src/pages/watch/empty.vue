<template>
  <div class="isEmpty">
    <img src="../../assets/image/empty@2x.png"
         alt="">
    <p>
      该活动尚未发布
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.isEmpty {
  img {
    width: 150px;
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
