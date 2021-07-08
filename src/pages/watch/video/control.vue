<template>
  <div class="control-box" @click.stop="" :class="{'control-vertical':  screenVertical}">
    <div class="auto-box"
         :style="{display: displayVal}">
      <div class="mode-item fl"
           v-if="playType!='live'">
        <i v-if="!isPlay"
           @click="playEvent(true)"
           class="iconfont icon-icon_bofang"
           title="暂停"></i>
        <i v-else
           @click="playEvent(false)"
           class="iconfont icon-icon_zanting"
           title="播放"></i>
      </div>
      <div class="mode-item time-box"
           v-if="playType!='live'">
        <span>{{currentDate}}</span>
        <span>/{{allDate}}</span>
      </div>
      <div class="mode-item progress-mode-item"
          v-if="playType!='live'">
        <div class="progress-box">
          <mt-range
            v-model="progress"
            :min="0"
            :max="100"
            :bar-height="3"
            :step="0.1"
            @change="changeVal">
          </mt-range>
          <div class="propress-point"
               v-for="(point, idx) in markPoints"
               @click="seekPoint(point)"
               :style="{ left: leftRatio(point.timePoint) + '%' }"
               :key="idx">
            <span class="propress-point-tips">{{point.msg}}</span>
          </div>
        </div>
      </div>
      <div class="mode-item" v-if="sheetContolBtn">
        <i @click.stop="showControlSheet"
          class="iconfont icon-set"></i>
      </div>
      <div class="mode-item"
           ref="setFullScreen">
        <i @click="fullScreeEvent"
           class="iconfont icon-zuidahua_icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import EventBus from 'src/utils/eventBus.js'
import * as types from '../../../store/mutation-types'
const controlTypes = {
  mute: 'mute',
  play: 'play',
  volumeSize: 'volumeSize',
  fullScree: 'fullScree',
  selectQuality: 'selectQuality',
  selectSpeed: 'selectSpeed',
  fullBrowser: 'fullBrowser',
  barrageSwitch: 'barrageSwitch',
  progress: 'progress'
}
const controlTypeValues = {
  mute: '声音控制',
  play: '播放控制',
  volumeSize: '声音大小',
  fullScree: '全屏控制',
  selectQuality: '画质',
  selectSpeed: '倍速',
  fullBrowser: '浏览器-全屏',
  progress: '播放进度'
}
export default {
  name: 'play-control',
  // components: {
  //   controlSheet
  // },
  data () {
    return {
      mute: false, // 是否禁音
      isPlay: true,
      volumeSize: 100,
      fullScree: false,
      isFullBrowser: false,
      // showQualityBlock: false,
      selectQuality: 0,
      current: 0,
      progress: 0,
      interval: null, // 倒计时
      // showSpeedBlock: false,
      // showBarrageBlock: false,
      barrageSwitch: true,
      speedList: [
        { name: '0.75x', value: 0.75 },
        { name: '1x', value: 1 },
        { name: '1.25x', value: 1.25 },
        { name: '1.5x', value: 1.5 },
        { name: '2x', value: 2 }
      ],
      selectSpeed: 1,
      showSheetView: false
    }
  },
  created () {
    this.initEventBus()
  },
  computed: {
    ...mapState('liveMager', {
      buttonSettings: state => state.buttonSettings,
      barrageSettings: state => state.barrageSettings
    }),
    allDate () {
      return this.formatDate(this.totalTime)
    },
    currentDate () {
      return this.formatDate(this.currentTime)
    },
    rate () {
      return parseInt(100 * this.currentTime / this.totalTime)
    },
    displayVal () {
      return this.playType === 'live' ? 'block' : 'flex'
    },
    showPlaySpeed() {
      return this.playType != 'live' && this.buttonSettings.showPlaySpeed
    },
    sheetContolBtn() {
      return this.showPlaySpeed || this.showResolution || this.showBarrage
    },
    showResolution() {
      return this.playType === 'vod' || (this.playType == 'live' && this.buttonSettings.showResolution)
    },
    showBarrage () {
      return this.barrageSettings.useBarrage && this.playType !== 'warm'
    }
  },
  props: {
    currentTime: {
      type: Number,
      default: 0
    },
    totalTime: {
      type: Number,
      default: 1000
    },
    qualitys: {
      type: Array,
      default () {
        return [{
          idx: 0,
          def: 'same'
        }]
      }
    },
    screenVertical: {
      type: Boolean,
      default: false
    },
    playType: {
      type: String,
      required: true,
      default: '' // 直播(live), 回放(vod), 暖场(warm), 结束(end)
    },
    currentQuality: Object, // 当前清晰度
    markPoints: {
      type: Array,
      required: false,
      default () {
        return []
      }
    }
  },
  watch: {
    currentTime: {
      handler (newVal) {
        this.current = newVal
      },
      immediate: true
    },
    rate: {
      handler (newVal) {
        this.progress = newVal
      },
      immediate: true
    },
    volumeSize (newVal) {
      this.changeControl(controlTypes.volumeSize, newVal)
    },
    currentQuality: {
      handler (newVal) {
        this.qualitys.every((item, idx) => {
          if (item.idx === newVal.idx) {
            return false
          }
        })
      }
    }
  },
  filters: {
    fmtQuality (vals) {
      if (!vals) {
        return '原画'
      }
      const val = vals.def
      if (val === 'a') {
        return '音频'
      } else if (val === 'same') {
        return '原画'
      } else if (val === '720p') {
        return '720p'
      } else if (val === '480p') {
        return '480p'
      } else if (val === '360p') {
        return '360p'
      } else if (val === '1080p') {
        return '超高清'
      }
      return '原画'
    }
  },
  methods: {
    ...mapMutations('liveMager', {
      storeSelectQuality: types.VIDEO_CURRENT_QUALITY,
      storeSelectSpeed: types.VIDEO_SELECT_SPEED
    }),
    leftRatio (val) {
      return val * 100 / this.totalTime
    },
    changeControl (type, value) {
      this.$emit('control', {
        type: type,
        value: value,
        msg: controlTypeValues[type]
      })
    },
    formatTooltip (val) {
      return val + '%'
    },
    seekPoint (point) {
      this.progress = (point.timePoint / this.totalTime) * 100
      this.changeVal()
    },
    changeVal () {
      this.changeControl(controlTypes.progress, this.progress)
    },
    // overQualityEvent () {
    //   this.showQualityBlock = !this.showQualityBlock
    // },
    // overSpeedEvent () {
    //   this.showSpeedBlock = !this.showSpeedBlock
    // },
    // toggleBarrageEvent () {
    //   this.showBarrageBlock = !this.showBarrageBlock
    // },
    playEvent (type) {
      this.isPlay = type
      this.changeControl(controlTypes.play, this.isPlay)
    },
    fullScreeEvent () { // 全屏
      // window.VhallPlayer.setFullScreen(true)
      this.changeControl(controlTypes.fullScree, true)
    },
    fullBrowser () {
      this.isFullBrowser = !this.isFullBrowser
      this.changeControl(controlTypes.fullBrowser, this.isFullBrowser)
    },
    toggleBarrage (open = false) {
      this.barrageSwitch = open
      this.changeControl(controlTypes.barrageSwitch, open)
    },
    formatDate (cTime) {
      let h = ((cTime / 3600 >> 0) + '')
      let m = ((cTime / 60 % 60 >> 0) + '').padStart(2, 0)
      let s = ((cTime % 60 >> 0) + '').padStart(2, 0)
      return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`
    },
    selectQualityFn (idx) {
      if (this.selectQuality === idx) return
      this.selectQuality = idx
      this.storeSelectQuality(idx)
      this.changeControl(controlTypes.selectQuality, this.qualitys[idx])
    },
    selectPlaySpeed (idx) {
      if (this.selectSpeed === idx) return
      this.selectSpeed = idx
      this.storeSelectSpeed(idx)
      this.changeControl(controlTypes.selectSpeed, this.speedList[idx].value)
    },
    initEventBus () {
      EventBus.$on('change_video_layout', (isSmallScreenVideo = false) => {
        this.changeControl(controlTypes.barrageSwitch, isSmallScreenVideo ? false : this.barrageSwitch)
      })
      EventBus.$on('select_play_speed', (...args) => {
        this.selectPlaySpeed(...args)
      })
      EventBus.$on('select_qualityfn', (...args) => {
        this.selectQualityFn(...args)
      })
      EventBus.$on('toggle_barrage', (...args) => {
        this.toggleBarrage(...args)
      })
    },
    showControlSheet () {
      EventBus.$emit('show_control_sheet')
    }
  }
}
</script>

<style scoped lang="scss">
.control-box {
  position: relative;
  width: 100%;
  height: 80px;
  line-height: 80px;
  animation: control-animation-hide 1s linear;
  background-color: rgba(0, 0, 0, 0.75);
  text-align: left;
  color: #fff;
  user-select:none;
  &.control-vertical {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 100px;
    background-color: transparent;
    .progress-box  /deep/ {
      position: relative;
      .mt-range-runway {
        border-top-color: rgba(200, 200, 200, .5);
      }
      .mt-range-progress {
        background-color: #ffd021;
        opacity: .6;
      }
      .mt-range-thumb{
        width: 36px;
        height: 36px;
        top: 0;
        background-image: url("./play_thumb.png");
        background-size: cover;
        &:before {
          display: none;
        }
        &:after {
          display: none;
        }
      }
    }
    .auto-box /deep/{
      .mode-item {
        min-width: 40px;
        .icon-icon_bofang, .icon-icon_zanting, .icon-zuidahua_icon {
          width: 40px;
          font-size: 36px;
        }
      }
    }
  }
  .time-box {
    position: relative;
    top: 1px;
    display: inline-block;
    font-size: 14px;
    margin-left: -10px;
    span {
      color: #ccc;
      &:last-child {
        opacity: 0.8;
      }
    }
  }
  .auto-box {
    padding: 20px 10px 20px 10px;
    text-align: right;
    line-height: 1;
    .progress-mode-item{
      flex: 1;
      padding: 0;
    }
    .mode-item {
      position: relative;
      display: inline-block;
      padding: 0 10px;
      line-height: 40px;
      text-align: center;
      font-size: 24px;
      cursor: pointer;
      color: #fff;
      font-family: '宋体';
      &.time-box {
        margin-right: 10px;
      }
      .el-slider {
        left: 0;
        top: 0;
        width: 100%;
      }
      .mute-block {
        display: inline-block;
        width: 90px;
        vertical-align: middle;
        margin-left: 5px;
        /deep/ {
          .el-slider__bar {
            background-color: #ffd021;
            height: 4px;
          }
          .el-slider__button {
            border: none;
            background-color: #fff;
            width: 8px;
            height: 8px;
            box-shadow: 0 0 10px #fff;
          }
          .el-slider__runway {
            border-radius: 2px;
            height: 4px;
            margin: 4px 0;
            background-color: rgba(255, 255, 255, 0.5);
          }
          .el-slider__button-wrapper {
            top: -18px;
          }
        }
      }
      .quality-info {
        display: inline-block;
        line-height: 40px;
        padding: 0 15px;
        background-color: #333;
        border-radius: 20px;
        opacity: 0.8;
        font-family: 'sans-serif';
        vertical-align: top;
      }
      .qualitys-box {
        position: absolute;
        top: -2px;
        right: 9px;
        width: 80px;
        padding: 5px 0;
        text-align: center;
        transform: translateY(-100%);
        background-color: rgba(20, 20, 20, 0.5);
        border-radius: 4px;
        .quality-item {
          display: block;
          line-height: 50px;
          &:hover {
            cursor: pointer;
            opacity: 0.9;
            color: #5d6afe;
          }
          &.active {
            color: #ffd021;
          }
        }
      }
    }
  }
  .progress-box {
    position: relative;
    top: 2px;
    /deep/ {
      width: 100%;
      .mt-range{
        height: 36px;
        line-height: 36px;
      }
      .mt-range-runway {
        left: 0;
        right: 0;
        border-radius: 10px;
        border-top-color: rgba(100,100,100,.8);
      }
      .mt-range-content {
         margin-right: 0;
      }
      .mt-range-progress {
        background-color: #ffd021;
        opacity: .6;
      }
      .mt-range-thumb{
        background-color: #ffd021;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        top: 8px;
        &:before {
          position: absolute;
          content: '';
          display: block;
          width: 32px;
          height: 32px;
          top: -6px;
          left: -6px;
          border-radius: 50%;
          background-color: rgba(255, 208, 33, 0.3);
        }
        &:after {
          position: absolute;
          content: '';
          display: block;
          width: 70px;
          height: 70px;
          top: -26px;
          left: -24px;
          z-index: 2;
          opacity: 0;
        }
      }
      .el-slider__bar {
        background-color: #ffd021;
        height: 4px;
      }
      .el-slider__button {
        background-color: #ffd021;
        width: 19px;
        height: 19px;
        border-radius: 50%;
        position: absolute;
        top: 12px;
        left: 28px;
      }
      .el-slider__runway {
        border-radius: 1px;
        height: 4px;
        margin: 4px 0;
        background-color: rgba(255, 255, 255, 0.5);
      }
      .el-slider__button-wrapper {
        position: relative;
        top: -20px;
        transition: opacity 0.2s;
        &:before {
          position: absolute;
          content: '';
          display: block;
          width: 32px;
          height: 32px;
          top: 6px;
          left: 22px;
          border-radius: 50%;
          background-color: rgba(255, 208, 33, 0.3);
        }
      }
    }
    .propress-point {
      position: absolute;
      top: 15px;
      width: 6px;
      height: 6px;
      border-radius: 10px;
      background-color: #fff;
      font-size: 24px;
      opacity: .8;
      .propress-point-tips {
        display: none;
        position: absolute;
        top: -40px;
        left: 50%;
        width: 200px;
        padding: 10px;
        line-height: 30px;
        border-radius: 4px;
        color: #FdFdFd;
        word-break: break-all;
        transform: translate(-50%, -100%);
        background-color: rgba(0, 0, 0, .8);
        box-shadow: 0 0 6px rgba(0, 0, 0, .2);
        &.tips-left {
          transform: translate(0, -100%);
        }
        &.tips-right {
          transform: translate(-100%, -100%);
        }
      }
      &:hover {
        cursor: pointer;
        top: 12px;
        width: 11px;
        height: 11px;
        transform: translateX(-3px);
        .propress-point-tips {
          display: block;
        }
      }
    }
  }
  .iconfont {
    vertical-align: top;
    font-size: 30px;
    color: #f5f5f5;
  }
}
</style>
