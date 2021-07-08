<template>
  <div class="sheet">
    <!-- 按钮面板 -->
    <div key="1" class="sheet__content main-panel" v-if="currentPeanel == 1">
      <div
        class="control-item"
        @click.stop="changePeanel(2)"
        v-if="showResolution"
      >
        <div class="control__icon-container">
          <div
            class="icon-img abs-c"
            :class="[selectQuality === 0 ? 'resolution' : 'resolution-other']"
          ></div>
        </div>
        <p v-if="qualitys.length" class="control__value">
          {{ qualitys[selectQuality] | fmtQuality }}
        </p>
        <p v-else class="control__value">
          原画
        </p>
      </div>
      <div
        class="control-item"
        @click.stop="changePeanel(3)"
        v-if="showPlaySpeed"
      >
        <div class="control__icon-container">
          <div
            class="icon-img abs-c"
            :class="[selectSpeed == 1 ? 'speed' : 'speed-other']"
          ></div>
        </div>
        <p class="control__value">
          {{ selectSpeed == 1 ? '倍速' : speedList[selectSpeed].name }}
        </p>
      </div>
      <div class="control-item" @click.stop="toggleBarrage" v-if="showBarrage">
        <div class="control__icon-container">
          <div
            class="icon-img abs-c"
            :class="[barrageSwtich ? 'barrage-open' : 'barrage-close']"
          ></div>
        </div>
        <p class="control__value">弹幕{{ barrageSwtich ? '开' : '关' }}</p>
      </div>
    </div>
    <div
      key="2"
      class="sheet__content resolution-panel"
      v-if="currentPeanel == 2"
    >
      <div
        class="control-item-buttom"
        :class="{ active: selectQuality == idx }"
        v-for="(item, idx) in qualitys"
        :key="idx"
        @click.stop="selectQualityFn(idx)"
      >
        {{ item | fmtQuality }}
      </div>
    </div>
    <!-- 速率 -->
    <div
      key="3"
      class="sheet__content resolution-panel"
      v-if="currentPeanel == 3"
    >
      <div
        class="control-item-buttom"
        :class="{ active: selectSpeed == idx }"
        v-for="(item, idx) in speedList"
        :key="idx"
        @click.stop="selectPlaySpeed(idx)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="sheet__cancel-button" @click.stop="handleClickCancel">
      取消
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EventBus from 'src/utils/eventBus.js'
export default {
  name: 'control-sheet',
  props: {
    showResolution: {
      type: Boolean,
      default() {
        return false
      }
    },
    showPlaySpeed: {
      type: Boolean,
      default() {
        return false
      }
    },
    showBarrage: {
      type: Boolean,
      default() {
        return false
      }
    },
    showSheetView: {
      type: Boolean
    }
  },
  computed: {
    ...mapState('liveMager', {
      qualitys: state => state.videoQualitys,
      selectQuality: state => state.videoCurrentQuality,
      playType: state => state.videoPlayType,
      selectSpeed: state => state.videoSelectSpeed
    })
  },
  filters: {
    fmtQuality(vals) {
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
  data() {
    return {
      currentPeanel: 1, // 1:main按钮面板;2Resolution清晰度;3speed速率
      showMainPeanel: true,
      barrageSwtich: true,
      speedList: [
        { name: '0.75x', value: 0.75 },
        { name: '1x', value: 1 },
        { name: '1.25x', value: 1.25 },
        { name: '1.5x', value: 1.5 },
        { name: '2x', value: 2 }
      ]
    }
  },
  methods: {
    changePeanel(val) {
      this.currentPeanel = val
    },
    toggleBarrage() {
      this.barrageSwtich = !this.barrageSwtich
      EventBus.$emit('toggle_barrage', this.barrageSwtich)
    },
    handleClickCancel() {
      this.currentPeanel = 1
      this.$emit('closeSheet')
    },
    selectPlaySpeed(...args) {
      EventBus.$emit('select_play_speed', ...args)
      this.handleClickCancel()
    },
    selectQualityFn(...args) {
      EventBus.$emit('select_qualityfn', ...args)
      this.handleClickCancel()
    }
  },
  watch: {
    showSheetView (val) {
      if (val) {
        this.currentPeanel = 1
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sheet {
  min-height: 110px;
  width: 100vw;
  color: #555;
}
.sheet__content {
  background: #f5f2f0;
  // background: #f7f7f7;
  border-radius: 30px 30px 0px 0px;
  padding: 25px 45px;
  .control-item-buttom {
    text-align: center;
    height: 100px;
    line-height: 100px;
    &.active {
      color: #ffd021;
    }
  }
}
.main-panel {
  padding: 45px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
}
.control-item {
  width: 190px;
  display: inline-block;
  text-align: center;
}
.control__icon-container {
  position: relative;
  display: inline-block;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 50%;
  background: #fff;
}
.icon-img {
  width: 50px;
  height: 50px;
  background-size: contain;
  &.barrage-open {
    background-image: url('~assets/image/icon-barrage-open.png');
  }
  &.barrage-close {
    background-image: url('~assets/image/icon-barrage-close.png');
  }
  &.speed {
    background-image: url('~assets/image/icon-speed.png');
  }
  &.speed-other {
    background-image: url('~assets/image/icon-speed-other.png');
  }
  &.resolution {
    background-image: url('~assets/image/icon-resolution.png');
  }
  &.resolution-other {
    background-image: url('~assets/image/icon-resolution-other.png');
  }
}
.control__value {
  text-align: center;
  color: #999;
  font-size: 24px;
}
.sheet__cancel-button {
  height: 110px;
  line-height: 110px;
  font-size: 32px;
  background: #fff;
  text-align: center;
  color: #222;
}
</style>
