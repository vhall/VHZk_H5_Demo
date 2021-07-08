<template>
  <div class="live-menu">
    <div
      class="live-list-warp"
      :class="[`set-${menu.type}`]"
      v-comLoading="loading"
    >
      <div
        class="live-item"
        v-for="(item, idx) of liveList"
        :key="idx"
        @click.stop="nav2Link(item)"
      >
        <div
          class="img cover-img"
          :style="{
            backgroundImage: activityImg(item)
          }"
        >
          <div class="status">{{ getPlayStatuTypes(item.status) }}</div>
        </div>
        <div class="tip clamp-2">{{ item.title }}</div>
      </div>
    </div>
    <!-- <div v-else class="loading-contianer">
      <div class="loader"></div>
    </div> -->
  </div>
</template>

<script>
import mixin from '../defaultImgMixins'
import { ActivityTool } from 'src/utils/ConfigTool'

export default {
  name: 'live-menu',
  mixins: [mixin],
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  created() {
    this.getMenuLive()
  },
  data() {
    return {
      loading: false,
      liveList: []
    }
  },
  computed: {
    layout() {
      return this.menu.set || 2
    }
  },
  methods: {
    getPlayStatuTypes(staus) {
      return ActivityTool.playStatuTypes[staus]
    },
    nav2Link(live) {
      if (live.bu === 'saas') {
        window.open(process.env.SAASROUTE.watchPath + '/' + live.relate_activity_id)
      } else {
        // 知客活动
        window.open(`${location.origin}${location.pathname}#watch/${live.relate_activity_id}`)
      }
    },
    getMenuLive() {
      this.loading = true
      VHALL_ZK.$api.getMenuLive(this.menu.menu_id).then(res => {
        this.liveList = res.data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" socped>
@import 'assets/css/mixin.scss';
.live-menu {
  padding: 25px;
  /deep/ .com-notification {
    background: transparent;
  }
}

.live-list-warp {
  min-height: 400px;
  &.set-one {
    .live-item {
      width: 100%;
      margin: 0 0 55px 0;
      .img {
        display: inline-block;
        border-radius: 8px;
        width: 100%;
        height: 388px;
        .status {
          text-align: center;
          width: 77px;
          height: 36px;
          background: #000;
          border-radius: 20px;
          opacity: 0.6;
          color: #fff;
          font-size: 24px;
          font-weight: 400;
          line-height: 36px;
          margin: 20px;
        }
      }
      .tip {
        margin-top: 29px;
        font-size: 32px;
        font-weight: 500;
        color: #222222;
        line-height: 44px;
      }
    }
  }
  &.set-two {
    @include flex();
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    .live-item {
      width: 335px;
      margin-bottom: 37px;
      .img {
        display: inline-block;
        width: 335px;
        height: 194px;
        border-radius: 8px;
        .status {
          text-align: center;
          width: 77px;
          height: 36px;
          background: #000;
          border-radius: 20px;
          opacity: 0.6;
          color: #fff;
          font-size: 24px;
          font-weight: 400;
          line-height: 36px;
          margin: 10px;
        }
      }
      .tip {
        margin-top: 24px;
        font-size: 26px;
        font-weight: 500;
        color: $color-font;
        line-height: 36px;
      }
    }
  }
}
</style>
