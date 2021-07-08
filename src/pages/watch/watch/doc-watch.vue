<template>
  <div class="doc-warp" :class="{'show-doc': showDoc}" v-ComLoading="loading">
    <div class="vh-doc-warp">
      <div class="vh-doc" v-show="currentDocId" id="watch_doc_id"></div>
      <div class="none-data" v-if="!currentDocId">
        <div class="doc-none-img"></div>
        {{$t('common.暂未演示文档')}}
      </div>
      <div class="doc-warp-tool" v-if="playType==='live' && currentDocId">
        <template v-if="screenVertical">
          <span title="关闭" class="doc-warp-tool-icon" @click="hideDoc()">
            <i class="iconfont icon-close1"></i>
          </span>
          </template>
          <template v-else>
          <span title="全屏" v-if="!fullScreen" class="doc-warp-tool-icon" @click="docFull(true)">
            <i class="iconfont icon-quanping"></i>
          </span>
            <span title="退出全屏" v-else class="doc-warp-tool-icon" @click="docFull(false)">
            <i class="iconfont icon-icon_quxiaoquanping"></i>
          </span>
        </template>
        <span title="还原" class="doc-warp-tool-icon" @click="zoomReset">
         <i class="iconfont icon-huanyuan"></i>
      </span>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from 'src/utils/eventBus.js'
export default {
  name: 'doc-watch',
  inject: ['publicApi'],
  data() {
    return {
      startDoc: false,
      isVod: false,
      isVideoFullscreen: false,
      fullScreen: false,
      showDoc: false,
      loading: false,
      currentDocId: ''
    }
  },
  props: {
    screenVertical: {
      type: Boolean,
      default: false
    },
    playType: {
      type: String,
      default: '' // 直播(live), 回放(vod), 暖场(warm), 结束(end), 第三方(third)
    }
  },
  mounted () {
    this.listenEvents()
    this.initDoc()
  },
  methods: {
    listenEvents() {
      EventBus.$on('closeSmallScreen', () => {
        this.hideDoc()
        // 退出全屏
        this.docFull(false)
        // 还原操作
        this.resetDoc()
      })
    },
    async initDoc () {
      if (this.startDoc) {
        this.showDoc = true
        this.resetDoc()
        return
      }
      this.loading = true
      let s = setTimeout(() => {
        clearTimeout(s)
        this.loading = false
      }, 5000)
      this.$nextTick(() => {
        this.startDoc = true
        VHALL_ZK.$doc.init('watch_doc_id')
        /* 当前正在演示文档id */
        VHALL_ZK.$doc.on(VHALL_ZK.EVENTS.DOC_CURRENT_ID, (res) => {
          this.currentDocId = res.id || ''
          EventBus.$emit('docing', this.currentDocId.length > 0)
          this.resetDoc()
        })
        /* 回放正在使用文档id */
        VHALL_ZK.$doc.on(VHALL_ZK.EVENTS.VOD_TIME_UPDATE, (res) => {
          this.currentDocId = res.id || ''
          EventBus.$emit('docing', this.currentDocId.length > 0)
        })
        /* 当前文档加载完成 */
        VHALL_ZK.$doc.on(VHALL_ZK.EVENTS.DOC_LOAD_COMPLETE, () => {
          this.loading = false
        })
        /* 所有文档加载完成 */
        VHALL_ZK.$doc.on(VHALL_ZK.EVENTS.DOC_ALL_COMPLETE, () => {
          this.loading = false
          this.resetDoc()
        })
        /* 回放文件加载完成 */
        VHALL_ZK.$doc.on(VHALL_ZK.EVENTS.DOC_VOD_LOAD_COMPLETE, () => {
          this.loading = false
        })
      })
    },
    zoomReset () {
      VHALL_ZK.$doc.zoomReset()
    },
    hideDoc () {
      this.showDoc = false
      EventBus.$emit('smallScreen', this.showDoc)
    },
    docFull (type) {
      let vhDom = document.querySelector('.doc-warp')
      if (type) {
        vhDom.style.position = 'fixed'
        vhDom.style.top = '0px'
        vhDom.style.left = '0px'
        vhDom.style.zIndex = '4000'
      } else {
        vhDom.style = ''
      }
      this.fullScreen = type
      EventBus.$emit('smallScreen', type)
      let s = setTimeout(() => {
        clearTimeout(s)
        this.resetDoc()
      }, 100)
    },
    switchDoc () {
      this.showDoc = true
      this.initDoc()
      EventBus.$emit('smallScreen', this.showDoc)
    },
    resetDoc () {
      this.$nextTick(() => {
        VHALL_ZK.$doc.resize()
      })
    },
    downEvent(e) {
      console.log('---downEvent---')
      // 兼容触摸屏
      if (e.changedTouches && e.changedTouches.length >= 1) {
        e = e.changedTouches[0]
      }
      let docBar = document.querySelector('.doc-watch-warp')
      if (!docBar) return
      if (e.pageY < 200) {
        docBar.setAttribute('class', 'doc-watch-warp long-touch top-sector')
      } else {
        docBar.setAttribute('class', 'doc-watch-warp long-touch')
      }
      this.disX = e.clientX - docBar.offsetLeft
      this.disY = e.clientY - docBar.offsetTop
      document.addEventListener('mousemove', this.moveEvent, false)
      // 兼容触摸屏
      document.addEventListener('touchmove', this.moveEvent, false)
    },
    upEvent(e) {
      console.log('---upEvent---')
      // 兼容触摸屏
      if (e && e.changedTouches && e.changedTouches.length >= 1) {
        e = e.changedTouches[0]
      }
      let docBar = document.querySelector('.doc-watch-warp')
      if (e && e.clientY < 200) {
        docBar.setAttribute('class', 'doc-watch-warp top-sector')
      } else {
        docBar.setAttribute('class', 'doc-watch-warp')
      }
      this.disX = 0
      this.disY = 0
      document.removeEventListener('mousemove', this.moveEvent, false)
      // 兼容触摸屏
      document.removeEventListener('touchmove', this.moveEvent, false)
    },
    moveEvent(e) {
      // 兼容触摸屏
      if (e && e.changedTouches && e.changedTouches.length >= 1) {
        e = e.changedTouches[0]
      }
      let docBar = document.querySelector('.doc-watch-warp')
      let left = e.clientX - this.disX
      // 计算左右边界
      left = left <= -150 ? -150 : (left >= window.screen.width - 150 ? window.screen.width - 150 : left)
      let top = e.clientY - this.disY
      // 计算上下边界
      top = top < 0 ? 0 : (top >= window.screen.height - 50 ? window.screen.height - 50 : top)
      docBar.style.left = left + 'px'
      docBar.style.top = top + 'px'
      if (e && e.pageY < 200) {
        docBar.setAttribute('class', 'doc-watch-warp long-touch')
      } else {
        docBar.setAttribute('class', 'doc-watch-warp long-touch')
      }
    },
    moveTool () {
      this.$nextTick(() => {
        if (!this.isMove) {
          this.isMove = true
          let docBar = document.querySelector('.doc-watch-warp')
          console.error(docBar.offsetLeft)
          console.error(docBar.offsetTop)
          docBar.style.left = docBar.offsetLeft + 'px'
          if (docBar.style.position === 'fixed') {
            docBar.style.top = docBar.offsetTop + 'px'
          } else {
            docBar.style.top = docBar.offsetTop + 170 + 'px'
          }
          // // 初始化位置
          docBar.style.marginLeft = 0 + 'px'
          docBar.style.bottom = 'auto'
          docBar.style.right = 'auto'
          docBar.style.position = 'fixed'
          docBar.setAttribute('title', '长按拖动')
          docBar.addEventListener('mousedown', this.downEvent, false)
          document.addEventListener('mouseup', this.upEvent, false)
          // 兼容触摸屏
          docBar.addEventListener('touchstart', this.downEvent, false)
          document.addEventListener('touchend', this.upEvent, false)
        }
      })
    },
    resetPosition () {
      console.log('----resetPosition----')
      this.isMove = false
      let docBar = document.querySelector('.doc-watch-warp')
      document.removeEventListener('mouseup', this.upEvent, false)
      docBar.removeEventListener('mousedown', this.downEvent, false)
      // 兼容触摸屏
      document.removeEventListener('touchend', this.upEvent, false)
      docBar.removeEventListener('touchstart', this.downEvent, false)
      docBar.style = ''
      docBar.setAttribute('title', '')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~assets/css/mixin.scss';
  .doc-warp {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: translateY(- 100%);
    background-color: #fff;
    z-index: 4;
    &.show-doc {
      transform: translateY(0);
    }
    .vh-doc-warp {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .vh-doc /deep/ {
        width: 100%;
        height: 100%;
        #VHALL_ZK_DOC_WATCH_ID {
          overflow: hidden !important;
        }
      }
      .doc-warp-tool {
        position: absolute;
        top: 38px;
        left: 38px;
        z-index: 2;
        font-size: 0;
        .doc-warp-tool-icon {
          display: inline-block;
          width: 72px;
          height: 72px;
          line-height: 74px;
          margin-right: 20px;
          border-radius: 50%;
          background-color: rgba(20, 20, 20, .7);
          color: #fff;
          text-align: center;
          font-family: sans-serif;
          @media only screen and (-webkit-min-device-pixel-ratio: 3), only screen and (min-device-pixel-ratio: 3) {
            line-height: 75px;
          }
          .iconfont {
            font-size: 30px;
            font-style: normal !important;
            font-family: sans-serif;
          }
        }
      }
      .none-data {
        position: absolute;
        width: 100%;
        top: 50%;
        margin-top: -150px;
        text-align: center;
        color: #888;
        font-size: 28px;
        .doc-none-img {
          width: 200px;
          height: 200px;
          margin: 0 auto 20px auto;
          background-image: url("~assets/image/doc-empty.png");
          background-size: cover;
        }
      }
    }
  }
</style>
