<template>
  <div class="play-container" :class="{'small-screen': (smallScreen && this.activityInfo.is_portrait == 'N'), 'play-vertical': screenVertical}" v-ComLoading="videoLoading">
    <div class="play-video-box" :id="playBoxId" v-if="playType=='live'"></div>
    <div class="play-video-box" :id="playBoxId" v-else-if="playType=='vod'">
      <!--<div v-html="this.outLineLink" style="width:100%;height: 100%;"></div>-->
      <span class="end-box" v-if="videoConvering">
          <img :src="require('assets/image/watch_liveEnd@2x.png')">
          <p>回放生成中，请稍等</p>
      </span>
    </div>
    <div class="play-video-box" :id="playBoxId" v-else-if="playType=='end'">
      <span class="end-box" v-if="role!=='master'">
        <img :src="require('assets/image/watch_liveEnd@2x.png')">
        <p>{{$t('common["直播已结束"]')}}</p>
      </span>
    </div>
    <div class="play-video-box" :id="playBoxId" v-else>
      <!--<div v-if="imageSrc" :style="{backgroundImage:`url(${imageSrc})`}" class="v-mark-img"></div>-->
    </div>
    <i class="iconfont icon-bofang" v-if="playBtnShow" @click="playVideo"></i>
    <div class="v-click-modal" @click="modalClick" v-if="playType=='vod' || playType=='warm' || (playType=='live' && role=='watcher')">
      <div class="auto-image-bg" v-if="isAuto" :style="{backgroundImage:`url(${imageAutoSrc})`}">
        <span class="end-box default-auto-box">
          <i class="iconfont icon-yinpinx"></i>
          <span>音频模式</span>
        </span>
      </div>
    </div>
    <div class="control-box-div" v-show="!videoConvering && showPersonControl">
      <div v-if="playType=='vod' || playType=='warm' || ( playType=='live' && role=='watcher')" class="control-video-box">
        <video-control :currentTime="currentTime"
                       :totalTime="totalTime"
                       :qualitys="qualitys"
                       :playType="playType"
                       :playState="isPlayState"
                       :screenVertical="screenVertical"
                       ref="mychild"
                       :currentQuality="currentQuality"
                       :markPoints="markPoints"
                       @control="playControl"></video-control>
      </div>
    </div>
    <div class="w-online-num" v-if="playType=='live' && showPersonControl && buttonSettings.showViewCount">
      <i class="iconfont icon-icon_gerenzhongxin"></i>
      <span>{{showPersonCount}}次观看</span>
    </div>
    <div v-show="vMark" class="v-mark" @click="startPlay">
      <div v-if="showImg && imageSrc" :style="{backgroundImage:`url(${imageSrc})`}" class="image-bg"></div>
      <i v-if="playLoading" class="play-btn"></i>
    </div>
  </div>
</template>

<script>
import { AppTool, BusTool } from 'src/utils/ConfigTool'
import { mapMutations, mapState } from 'vuex'
import VideoControl from './control'
import * as types from '../../../store/mutation-types'
import EventBus from 'src/utils/eventBus'
export default {
  name: 'play-video',
  components: { VideoControl },
  data () {
    return {
      default_cover: AppTool.default_cover,
      playComps: {},
      playBtnShow: false,
      imageUrl: '',
      imageAutoUrl: '',
      recordId: '', // 视频id
      playBoxId: `play-vides-box`,
      sdkPlayParam: {
        appId: '',
        accountId: '',
        token: ''
      },
      showPersonControl: false,
      currentTime: 0,
      totalTime: 10000,
      stInterval: '',
      isPlay: false,
      isAutoPlay: false,
      videoConvering: false,
      showImg: false,
      qualitys: [{
        idx: 0,
        def: 'same'
      }], // 视频质量
      currentQuality: {},
      isPlayState: false,
      playLoading: false,
      videoLoading: false,
      smallScreen: false,
      isFullScree: false,
      isAuto: false, // 是否是音频
      markPoints: [] // 打点信息
    }
  },
  props: {
    role: {
      type: String,
      default: 'watcher' // 发起端(master), 观看(watcher)
    },
    playType: {
      type: String,
      required: true
    },
    isDoc: {
      type: Boolean,
      required: true,
      default: false
    },
    startInit: {
      type: Boolean,
      required: true,
      default: false
    },
    screenVertical: {
      type: Boolean,
      default: false
    },
    paasParams: {
      appId: '',
      roomId: '',
      inavId: '',
      token: '',
      accountId: ''
    },
    showPersonCount: {
      type: Number,
      default: 0
    }
  },
  created () {
    EventBus.$on('send_barrage', (content) => {
      if (this.playType === 'warm' || this.playType === 'pre') return // 暖场时不发弹幕
      this.$debounce(() => { // 两秒一条弹幕
        VHALL_ZK.$player.addBarrage(content)
      }, 2000)
    })
  },
  computed: {
    ...mapState('liveMager', {
      activityInfo: state => state.activityInfo,
      barrageSettings: state => state.barrageSettings,
      buttonSettings: state => state.buttonSettings
    }),
    ...mapState('login', {
      loginInfo: state => state.loginInfo
    }),
    imageSrc () {
      let coverImg = this.imageUrl ? `${this.$imgHost}/${this.imageUrl}?x-oss-process=image/resize,m_lfit,w_750${window.webp ? '/format,webp' : ''}` : `${this.default_cover}?x-oss-process=image/resize,m_lfit,w_1000${window.webp ? '/format,webp' : ''}`
      this.$emit('coverImg', coverImg)
      return coverImg
    },
    imageAutoSrc () {
      return this.imageAutoUrl ? `${this.$imgHost}/${this.imageAutoUrl}?x-oss-process=image/resize,m_lfit,w_750${window.webp ? '/format,webp' : ''}` : `${this.default_cover}?x-oss-process=image/resize,m_lfit,w_1000${window.webp ? '/format,webp' : ''}`
    },
    vMark () {
      const result = !this.videoConvering && !this.isPlay && this.playType !== 'end'
      if (result) {
        if (this.playType && this.playType !== 'pre') {
          EventBus.$emit('isPlay', false)
        }
      } else {
        EventBus.$emit('isPlay', true)
      }
      return result
    }
  },
  mounted () {
    this.initPage()
  },
  watch: {
    startInit (newVal) {
      if (!newVal) {
        this.stopPlay()
      }
    },
    playType (val) {
      this.changePlayType()
      this.storeVideoPlayType(val)
    },
    qualitys (val) {
      this.storeVideoQualitys(val)
    }
  },
  beforeDestroy () {
    console.log('--video-com--beforeDestroy')
    clearInterval(this.setIntervalHandler)
    this.destoryComs()
  },
  methods: {
    ...mapMutations('liveMager', {
      storeRoomPaas: types.ROOM_PAAS,
      storeVideoQualitys: types.VIDEO_QUALITYS,
      storeVideoPlayType: types.VIDEO_PLAY_TYPE
    }),
    /* 初始组件 */
    initComponent () {
      this.isPlay = false
      this.showImg = true
      this.destoryComs()
      if (this.playType === 'live') { // 直播
        this.initLivePlay()
      } else if (this.playType === 'pre') {
        this.imageUrl = this.activityInfo.img_url
        this.imageAutoUrl = this.activityInfo.img_url
        EventBus.$emit('playReady', true)
      } else if (this.playType === 'warm') { // 暖场
        this.showImg = false
        this.queryWarmInfo()
      } else if (this.playType === 'vod') { // 回放
        this.showImg = false
        this.initPlayBack()
      } else if (this.playType === 'end') { // 结束
        this.playEnd()
      }
    },
    initPage () {
      EventBus.$on('exitFullScreen', () => {
        this.isPlay = false
        this.smallScreenVideo(false)
      })
      EventBus.$on('smallScreen', (isShow) => {
        this.smallScreenVideo(isShow)
      })
      let that = this
      window.addEventListener(
        'onorientationchange' in window ? 'orientationchange' : 'resize',
        function () {
          if (window.orientation === 90 || window.orientation === -90) {
            that.horizontalScreen() // 横屏
          } else {
            that.herticalScreen() // 竖屏
          }
        },
        false
      )
    },
    /* 改版播放类型 */
    changePlayType () {
      if (!this.startInit) return
      if ('live|warm|vod|end|pre'.indexOf(this.playType) !== -1) {
        this.isAutoPlay = false
        this.initComponent()
      }
    },
    addEventPlayer () {
      VHALL_ZK.$player.on(VHALL_ZK.EVENTS.PLAY, () => {
        this.isPlay = true
        this.$refs.mychild.playEvent(true)
        let seekTime = sessionStorage.getItem(`seekTime_${this.$route.params.id}`)
        seekTime = parseInt(seekTime || 0)
        // 从上次离开的位置开始继续播放
        if (seekTime > 5 && this.playType !== 'live') {
          /* 定时器避免开始时清0操作 */
          let s = setTimeout(() => {
            clearTimeout(s)
            VHALL_ZK.$player.seekTime(seekTime)
            this.dealWithVideo()
          }, 50)
        }
      })
      VHALL_ZK.$player.on(VHALL_ZK.EVENTS.PAUSE, () => {
        if (this.playType === 'live') {
          this.isPlay = false
        }
        this.$refs.mychild.playEvent(false)
      })
      // 视频卡顿时触发
      VHALL_ZK.$player.on(VHALL_ZK.EVENTS.LAG_REPORT, () => {
        console.log('-----视频卡顿-----')
        if (this.isPlay && this.playType !== 'end') {
          this.videoLoading = true
        } else {
          this.videoLoading = false
        }
      })
      // 视频卡顿恢复时触发
      VHALL_ZK.$player.on(VHALL_ZK.EVENTS.LAG_RECOVER, () => {
        console.log('-----卡顿恢复-----')
        this.videoLoading = false
        VHALL_ZK.$player.play()
      })
      // 当前清晰度改变时触发(卡顿时自动切清晰度触发，手动切换不触发)
      VHALL_ZK.$player.on(VHALL_ZK.EVENTS.DEFINITION_CHANGE, () => {
        console.log('-----清晰度改变-----')
        this.currentQuality = VHALL_ZK.$player.getCurrentQuality()
      })
      // 直播时延
      VHALL_ZK.$player.on(VHALL_ZK.EVENTS.TIMEUPDATE, (e) => {
        EventBus.$emit(BusTool.LIVE_DELAY, e.delay)
        this.$refs.mychild.isPlay = true
      })
    },
    playEnd () {
      this.videoLoading = false
      EventBus.$emit('playReady', true)
      clearInterval(this.setIntervalHandler)
    },
    playVideo () {
      this.playBackVideo()
    },
    startPlay () {
      const warm = this.activityInfo.warm
      if (this.playType === 'pre') {
        return
      }
      if (this.playType === 'warm' && (!warm.record || warm.record.video_info.length <= 0)) { /* 未上传视频或者未转码完成 */
        this.$messageBox({
          header: '提示',
          content: '此时没有暖场视频',
          confirmText: '确定'
        })
        return
      }
      this.isPlay = true
      /* 处理视频清晰度 */
      this.dealWithQuality()
      let seekTime = sessionStorage.getItem(`seekTime_${this.$route.params.id}`)
      seekTime = parseInt(seekTime || 0)
      // 从上次离开的位置开始继续播放
      if (seekTime && this.playType !== 'live') {
        VHALL_ZK.$player.seekTime(seekTime)
      } else {
        sessionStorage.removeItem(`seekTime_${this.$route.params.id}`)
      }
      VHALL_ZK.$player.play()
      // 解决华为手机不能关闭小窗的兼容问题
      this.smallScreenVideo(false)
      // 兼容刚进入页面时只有音频的特殊情况
      let st = setTimeout(() => {
        // 防止第一次无法关闭的情况
        this.smallScreenVideo(false)
        clearTimeout(st)
        this.isAuto = this.currentQuality.def === 'a'
      }, 1000)
    },
    /* 初始化直播 */
    initLivePlay () {
      if (this.role === 'watcher') { // 观看端
        this.imageUrl = this.activityInfo.img_url
        this.imageAutoUrl = this.activityInfo.img_url
        this.initPlayer('live')
      }
    },
    initPlayBack () {
      VHALL_ZK.$api.getActivityPlayBackInfo().then((res) => {
        if (res.data) {
          this.imageUrl = res.data.cover || this.activityInfo.img_url
          this.imageAutoUrl = res.data.cover || this.activityInfo.img_url
          if (res.data.replay.video) { // 回放视频
            this.recordId = res.data.replay.video
            this.totalTime = parseInt(res.data.replay.duration)
            this.playBackVideo(res.data.replay.status)
          }
        }
      }).catch(() => {
      })
    },
    /* 播放暖场视频 */
    playBackVideo (stauts) {
      if (this.playType === 'vod' && stauts !== 'SUCCESS') { // 没有回放视频，此时视频转码中
        this.videoConvering = true
        EventBus.$emit('playReady', true)
        this.$nextTick(() => {
          this.showImg = true
        })
        return
      }
      this.showImg = true
      if (!this.recordId) {
        EventBus.$emit('playReady', true)
        console.log('----------没有回放id----------')
        return
      }
      if (this.isDoc && !VHALL_ZK.$doc.initResult) { // 如果文档没有初始化完成，必须文档加载完成再初始化播放器
        VHALL_ZK.$event.on(VHALL_ZK.EVENTS.DocReady, () => {
          this.$debounce(() => {
            this.initPlayer('vod')
          })
        })
      } else {
        this.initPlayer('vod')
      }
    },
    dealWithQuality () {
      /* 获取当前视频播放质量 */
      this.currentQuality = VHALL_ZK.$player.getCurrentQuality()
      /* 获取当前视频播放质量 */
      if (!this.qualitys || this.qualitys.length <= 1) {
        this.qualitys = VHALL_ZK.$player.getQualityList().filter(item => {
          // 暂时屏蔽音频，解决手机端音频sdk不可用问题
          return item.def != 'a'
        })
      }
    },
    dealWithVideo () {
      /* 处理视频清晰度 */
      this.dealWithQuality()
      clearInterval(this.setIntervalHandler)
      this.setIntervalHandler = setInterval(() => {
        this.currentTime = VHALL_ZK.$player.getCurrentTime()
        sessionStorage.setItem(`seekTime_${this.$route.params.id}`, this.currentTime)
        if (this.totalTime <= this.currentTime) {
          clearInterval(this.setIntervalHandler)
          if (this.isAutoPlay) {
            VHALL_ZK.$player.seekTime(0)
            this.$refs.mychild.playEvent(true)
            this.dealWithVideo()
          } else {
            sessionStorage.setItem(`seekTime_${this.$route.params.id}`, 0)
            this.isPlay = false
            this.currentTime = 0
          }
        }
      }, 1000)
    },
    queryWarmInfo () {
      const warm = this.activityInfo.warm
      this.imageUrl = warm.img_url || this.activityInfo.img_url
      this.imageAutoUrl = warm.img_url || this.activityInfo.img_url
      this.playBtnShow = true
      this.filename = warm.filename
      this.recordId = warm.record_id
      this.isAutoPlay = warm.playType === 'AUTO'
      this.isPlayState = this.isAutoPlay
      if (warm.record) {
        this.totalTime = parseInt(warm.record.vod_info.duration)
        this.playBackVideo()
      } else {
        this.showImg = true
      }
    },
    initPlayer (type) {
      // 创建实例
      this.$nextTick(() => {
        this.playLoading = true
        VHALL_ZK.$player.init({
          type: type || 'live', // live 直播  vod 点播  必填
          recordId: this.recordId || '', // type==vod时必传
          videoNode: this.playBoxId // 播放器的容器， div的id 必填
        })
        VHALL_ZK.$event.on(VHALL_ZK.EVENTS.PlayerReady, (res) => {
          console.log('--初始化直播播放器成功--')
          this.markPoints = VHALL_ZK.$player.getMarkPoints()
          this.addEventPlayer()
          this.$emit('playReady', true)
          console.log(this.barrageSettings)
          if (this.barrageSettings.useBarrage) {
            VHALL_ZK.$player.setBarrageOption(this.barrageSettings)
            VHALL_ZK.$player.toggleBarrage(true)
          }
        })
      })
    },
    stopPlay () {
      if (this.playType === 'live') { // 直播
        VHALL_ZK.$player.pause()
      }
    },
    formatTooltip (val) {
      return val / 10000
    },
    horizontalScreen () {
      this.isFullScree = true
      // 横屏
    },
    herticalScreen () {
      this.isFullScree = false
      // 竖屏
    },
    /* 开启，禁止声音 */
    play (e) {
      if (this.playType === 'warm' || this.playType === 'vod' || this.playType === 'live') {
        if (e) {
          VHALL_ZK.$player.play()
          if (this.playType !== 'live') {
            this.dealWithVideo()
          }
        } else {
          VHALL_ZK.$player.pause()
        }
      }
    },
    playControl (e) {
      const controlType = e.type
      if (controlType === 'progress') { // seek播放进度
        this.seekProgress(e.value)
      } else if (controlType === 'play') { // 播放控制
        this.play(e.value)
      } else if (controlType === 'selectQuality') { // 画面质量
        this.isAuto = (e.value.def === 'a' || false)
        VHALL_ZK.$player.setQuality(e.value)
      } else if (controlType === 'fullScree') { // 全屏控制
        VHALL_ZK.$player.enterFullScreen()
      } else if (controlType === 'rePlay') { // 重新播放
        this.play()
        this.dealWithVideo()
      } else if (controlType === 'selectSpeed') { // 设置倍速
        VHALL_ZK.$player.setPlaySpeed(e.value)
      } else if (controlType === 'barrageSwitch') { // 设置弹幕开关
        VHALL_ZK.$player.toggleBarrage(e.value)
      }
    },
    seekProgress (progress) {
      VHALL_ZK.$player.seekTime(this.totalTime * progress / 100)
    },
    destoryComs () {
      clearInterval(this.setIntervalHandler)
      this.videoLoading = false
      console.log('-----销毁--播放器-----')
      VHALL_ZK.$player.destroy()
    },
    modalClick () {
      if (!this.$refs.mychild) return
      if (this.screenVertical && this.playType === 'live') {
        this.showPersonControl = false
      } else {
        this.showPersonControl = !this.showPersonControl
      }
      this.$emit('clickVideo')
    },
    isX5 () {
      let u = navigator.userAgent
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      if (!isiOS && (u.match(/MicroMessenger/i) || u.match(/QQ/i))) {
        return true
      }
      return false
    },
    smallScreenVideo (type = true) {
      if (!this.isPlay) return
      EventBus.$emit('change_video_layout', type)
      this.smallScreen = type
      if (type) {
        this.moveVideo()
      } else {
        if (this.activityInfo.layout === 2 && this.activityInfo.is_portrait === 'Y') { // 文档布局
          let domVideo = document.querySelector('.play-video-section')
          domVideo.setAttribute('class', 'play-video-section')
          domVideo.removeAttribute('style')
        }
      }
    },
    moveVideo () {
      let domVideo = null
      if (this.activityInfo.layout === 2 && this.activityInfo.is_portrait === 'Y') { // 文档布局
        domVideo = document.querySelector('.play-video-section')
        domVideo.setAttribute('class', 'play-video-section small-doc-video')
      } else {
        domVideo = document.getElementById('vh-video')
      }
      if (this.onceEvent) return
      this.onceEvent = true
      let top = 0
      let left = 0
      let w = 0
      let h = 0
      let moveEvent = (e) => {
        if (this.smallScreen) {
          top = e.touches[0].clientY
          left = e.touches[0].clientX
          domVideo.style.top = top - h / 2 + 'px'
          domVideo.style.left = left - w / 2 + 'px'
          domVideo.style.transition = 'none'
        }
      }
      let longTouch = false
      domVideo.addEventListener('touchstart', () => {
        longTouch = true
        let st = setTimeout(() => {
          clearTimeout(st)
          if (!longTouch) {
            if (this.smallScreen) {
              EventBus.$emit('closeSmallScreen')
              this.smallScreenVideo(false)
            }
          }
        }, 300)
        w = domVideo.offsetWidth
        h = domVideo.offsetHeight
        document.addEventListener('touchmove', moveEvent, false)
      }, false)
      document.addEventListener('touchend', () => {
        longTouch = false
        document.removeEventListener('touchmove', moveEvent, false)
        domVideo.style.transition = 'all .2s linear'
      }, false)
    }
  }
}
</script>

<style scoped lang="scss">
  @import '~assets/css/mixin.scss';
  .play-container {
    position: relative;
    height: 100%;
    background-color: #313131;
    &.play-vertical /deep/{
      #vh-video {
        object-fit: cover;
      }
      .v-mark .image-bg {
        background-size: contain;
        background-color: #313131;
      }
    }
    &.small-screen /deep/{
      #vh-video{
        position: fixed;
        left: 480px;
        top: 70%;
        width: 258px !important;
        height: 145px !important;
        margin: 0 !important;
        transition: all .2s linear;
        z-index: 9999;
      }
    }
    /deep/{
      #vh-video{
        position: initial;
      }
      .vjs-control-bar, .vjs-big-play-button { // 隐藏控制条
        display: none !important;
      }
      &.small-screen #vh-video{
        position: fixed;
        left: 480px;
        top: 70%;
        width: 258px !important;
        height: 145px !important;
        margin: 0 !important;
        transition: all .2s linear;
        z-index: 9999;
      }
    }
    .w-online-num{
      display: inline-block;
      position: absolute;
      top: 16px;
      left: 16px;
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      border-radius: 23px;
      color: #fff;
      font-size: 28px;
      background-color: rgba(10,10,10,.5);
      opacity: .9;
      z-index: 1;
      .iconfont{
        font-size: 28px;
      }
    }
    .end-box {
      position: absolute;
      display: block;
      color: #999999;
      text-align: center;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
      p {
        margin-top: 20px;
        line-height: 24px;
      }
    }
    .default-auto-box {
      top: 50px;
      left: 120px;
      border-radius: 5px;
      height: 50px;
      line-height: 50px;
      text-align: left;
      color: #fff;
      padding: 0 20px;
      font-size: 28px;
      .icon-yinpinx {
        color: #1bcab7;
        margin-right: 4px;
        font-size: 28px;
      }
    }
    .play-video-box /deep/{
      height: 100%;
      .v-mark-img {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
      }
      .vjs-big-play-button {
        display: none;
      }
      .end-box {
        position: absolute;
        display: block;
        color: #999999;
        text-align: center;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        img {
          width: 150px;
          height: 150px;
        }
        p {
          margin-top: 20px;
          line-height: 34px;
        }
      }
    }
    .icon-bofang {
      display: none;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 13;
      color: red;
      font-size: 60px;
      &:hover {
        cursor: pointer;
        opacity: 0.8;
      }
    }
    .v-click-modal {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      .auto-image-bg{
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
      }
    }
    .control-box-div {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 80px;
      line-height: 80px;
      z-index: 11;
      .el-slider {
        position: absolute;
        bottom: 0;
        left: 100px;
        z-index: 3;
        width: 500px;
        .el-slider__runway {
          margin: 16px 0;
        }
      }
      .v-fullScreen {
        position: absolute;
        bottom: 10px;
        right: 50px;
        z-index: 3;
        color: #fff;
      }
      .v-play {
        position: absolute;
        bottom: 10px;
        left: 10px;
        z-index: 3;
        color: #fff;
      }
    }
    .v-mark {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 12;
      text-align: center;
      .image-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
        z-index: 1;
      }
      i {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -65px;
        margin-left: -65px;
        width: 130px;
        height: 130px;
        @include webpbg('~assets/image/play-btn.png');
        background-size: cover;
        z-index: 2;
      }
    }
  }
</style>
