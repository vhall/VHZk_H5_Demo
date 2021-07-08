<template>
  <div class="cards-box">
    <div class="wrap-cover"></div>
    <div class="cards-wrap">
      <img class="cov_img" :src="`${$imgHost}/${cardData.pic}?x-oss-process=image/resize,m_lfit,w_600${isWebp ? '/format,webp' : ''}`">
      <div class="desc">{{cardData.desc}}</div>
      <a v-if="cardData.btn_display === 'Y'" :href="cardData.btn_link" target="_blank"><button  round class='btn default-button primary-button' @click='view(cardData.recommend_card_id)'>{{cardData.btn_text}}</button></a>
      <i class="close" @click='close'></i>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isWebp: window.webp,
      activity_id: this.$route.params.id
    }
  },
  props: {
    cardData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    view (id) {
      VHALL_ZK.$api.viewCard(id).then((res) => {
        console.log(res)
      })
    },
    close () {
      this.$emit('closeCards')
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~assets/css/mixin.scss';
.cards-box{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3001;
  .wrap-cover{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 3001;
    background: rgba(0, 0, 0, 0.7);
  }
  .cards-wrap {
    text-align: center;
    width: 550px;
    background: rgba(255, 255, 255, 1);
    height: auto;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(34, 34, 34, 0.5);
    z-index: 9999;
    padding-bottom: 40px;
    .cov_img {
      width: 100%;
      max-height: 550px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    a {
      display: inline-block;
    }
    .desc {
      word-break: break-all;
      color: $color-font-sub;
      padding: 30px;
      font-size: 28px;
      text-align: left;
    }
    .btn {
      padding: 0;
      min-width: 300px;
      height: 60px;
      border-radius: 30px;
      line-height: 60px;
      margin: 20px 0 10px 0;
      font-size: 24px;
    }
    .close {
      cursor: pointer;
      z-index: 99;
      width: 53px;
      height: 53px;
      border-radius: 200px;
      position: absolute;
      bottom: -69px;
      left: 50%;
      margin-left: -26.6px;
      background: url('~assets/image/card-close.png') no-repeat center;
      background-size: contain;
    }
  }
}
</style>
