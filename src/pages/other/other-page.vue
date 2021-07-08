<template>
  <div class="is-page">
    <dl :class="{offline: type=='off', over: type=='over'}">
      <dt></dt>
      <dd v-if="type=='off'">此活动已下线～</dd>
      <dd v-if="type=='over'">此活动太过火爆，请稍候重试～</dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'other',
  data () {
    return {
      type: 'off'
    }
  },
  created () {
    this.type = this.$route.params.type
  }
}
</script>
<style lang="scss" scoped>
.is-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  dl {
    width: 300px;
    height: 380px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -220px;
    margin-left: -150px;
  }
  dt {
    width: 300px;
    height: 300px;
    margin: 0 auto;
  }
  dd {
    padding-top: 40px;
    font-size: 28px;
    color: #555;
  }
  .offline{
    dt {
      background: url('~assets/image/off-icon.png') no-repeat center;
      background-size: contain;
    }
  }
  .over{
    dt {
      background: url('~assets/image/over-icon.png') no-repeat center;
      background-size: contain;
    }
  }
}
</style>
