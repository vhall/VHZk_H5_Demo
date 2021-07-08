
<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="slide-router"></router-view>
    </transition>
  </div>
</template>

<script>
import { BusTool, ChartTool } from 'src/utils/ConfigTool'
import EventBus from 'src/utils/eventBus'
import { mapState, mapMutations } from 'vuex'
import * as types from 'src/store/mutation-types.js'
import OverFlex from 'src/utils/over-flex'
export default {
  data () {
    return {
      activity_id: '',
      chatRoomInfo: {},
      transitionName: 'slide-left'
    }
  },
  watch: {
    '$route' (to, from) {
      let isBack = localStorage.getItem('isBack') || false
      if (isBack) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
      localStorage.removeItem('isBack')
    }
  },
  mounted () {
    /* 用于处理手机端局部滚动导致的整体页面滚动 */
    let overFlex = new OverFlex()
    /* 设置允许滚动的区域，其他地方将被禁止 */
    overFlex.setOption([
      '.chat-wrap', // 聊天盒子
      '.chat-section',
      '.cover-play',
      '.play-video-section',
      '#goods-list-box-ID', // 商品列表盒子
      '.goods-info-box' // 商品详情盒子
    ])
    document.addEventListener('focusout', function (e) {
      setTimeout(() => {
        let top = document.body.scrollTop
        document.body.scrollTop = top + 10
      }, 100)
    })
  },
  computed: {
    ...mapState('login', {
      loginInfo: state => state.loginInfo
    }),
    ...mapState('liveMager', {
      roomPaas: state => state.roomPaas
    })
  },
  created () {
    EventBus.$on(BusTool.LAYOUT_CHAT_SERVICE, (activity_id) => {
      if (this.$isWx() && activity_id) {
        this.initChatService(activity_id)
      }
    })
  },
  methods: {
    ...mapMutations('login', {
      storeLoginInfo: types.LOGIN_INFO
    }),
    ...mapMutations('liveMager', {
      storeRoomPaas: types.ROOM_PAAS
    }),
    async initChatService (activity_id) {
      this.activity_id = activity_id
      VHALL_ZK.$event.off(ChartTool.joinLive, this.userJoinCheck)
      /* 监听人员进入直播间,延迟执行，避免监听到自己进入 */
      let s = setTimeout(() => {
        clearTimeout(s)
        VHALL_ZK.$event.on(ChartTool.joinLive, this.userJoinCheck)
      }, 3000)
    },
    userJoinCheck (msg) {
      if (msg.context && typeof msg.context === 'string') {
        msg.context = JSON.stringify(msg.context)
      }
      const uuid = VHALL_ZK.$event.getUUID() // uuid不相等，说明不是一台手机设备
      if (msg.client === 'wechat_browser' && uuid !== msg.context.UUID &&
        this.loginInfo.consumer_user_id + '' === msg.context.consumer_user_id) {
        this.$messageBox({
          header: '提示',
          content: '您的账号在另一地点登录，您已被迫下线',
          confirmText: '确定',
          autoClose: 10,
          handleClick: (e) => {
            window.location.reload()
          }
        })
      }
    }
  }
}
</script>

<style lang='scss'>
@import 'assets/css/mixin.scss';
#app {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  font-size: 28px;
  color: #222222;
}

.box {
  width: 375px;
  height: 375px;
  border-radius: 4px;
  @include border();
  margin-left: 10px;
  margin-top: 10px;
}
</style>
