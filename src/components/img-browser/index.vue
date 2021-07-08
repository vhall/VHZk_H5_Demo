<template>
  <div class="img-browser-wrap">
    <div class="swipe-box">
      <mt-swipe :auto="0" :show-indicators="true" :defaultIndex="showIdx" :speed="200">
        <mt-swipe-item v-for="item in imgList" :key="item">
          <div class="swipe-box-img" @touchstart="touchStartImg" @touchend="touchEndImg" >
             <img class="img-item" :src="`${item}?x-oss-process=image/resize,m_lfit,w_2000${isWebp ? '/format,webp' : ''}`">
          </div>
        </mt-swipe-item>
      </mt-swipe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'img-browser',
  data () {
    return {
      isWebp: window.webp,
      isSlide: false,
      startX: 0
    }
  },
  props: {
    showIdx: {
      type: Number,
      default: 0
    },
    imgList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    touchStartImg (e) {
      this.startX = e.touches[0].pageX
    },
    touchEndImg (e) {
      let slideWidth = e.changedTouches[0].pageX - this.startX
      if (Math.abs(slideWidth) < 30) { /* 小于30表示点击而非滑动 */
        let s = setTimeout(() => {
          clearTimeout(s)
          this.$emit('quit')
        }, 50)
      }
    },
    quitBrowser () {
      this.$emit('quit')
    }
  }
}
</script>
<style lang='scss' scoped>
  .img-browser-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .5);
    z-index: 99999;
    .swipe-box {
      height: calc(100% - 160px);
      margin-top: 80px;
      .swipe-box-img {
        position: relative;
        height: 100%;
        width: 100%;
        .img-item {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 100%;
          max-height: 100%;
        }
      }
      /deep/ {
        .mint-swipe{
          overflow: visible;
          .mint-swipe-items-wrap{
            overflow: visible;
          }
        }
        .mint-swipe-indicators {
          bottom: 4px;
          .mint-swipe-indicator {
            opacity: .8;
            &.is-active {
              background-color: #FFD021;
            }
          }
          .mint-swipe-items-wrap > div {
            display: block;
          }
        }
      }
    }
  }
</style>
