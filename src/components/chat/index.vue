<template>
  <div
    class="chat-wrap"
    :class="{ 'chat-vertical': screenVertical }"
    :style="{ backgroundImage: `url(${chatImg})` }"
    ref="chatWrap">
    <div class="announce-box" v-if="announceShow">
      <span class="announce-icon"><i class="iconfont icon-gonggao"></i></span>
      <com-marquee
        @over="announceShow = false"
        class="marquee"
        :content="receiveAnnounce"></com-marquee>
      <i class="iconfont icon-close1" @click="announceShow = false"></i>
    </div>
    <div
      class="bscroll"
      ref="bscroll"
      :class="{
        live: type === 'live',
        pre: type === 'warm' || type === 'pre',
        vod: !(type === 'live' || type === 'pre' || type === 'warm'),
        'over-box': !isOverBox
      }"
      @scroll="scrollEvent($event)">
      <div class="bscroll-content">
        <mt-loadmore :autoFill="false" :top-method="loadTop" ref="loadmore">
          <ol class="chat-list bscroll-container">
            <template v-for="item in filterChat">
              <div :key="item.msg_id">
                <li
                  :data-joinId="item.id"
                  :key="item.msg_id"
                  v-if="item.eventType !== 'RED_PACKET_JOIN'">
                  <template v-if="item.msgType === 'chat' || item.msgType === 'imgChat'">
                    <dl class="clearfix">
                      <dt
                        v-if="
                          !screenVertical &&
                            item.avatar &&
                            item.avatar !==
                              '//static.vhallyun.com/public/static/img/null.png'"
                        style="background-size: cover;background-position: center center;"
                        :style="{backgroundImage: `url(${item.avatar}?x-oss-process=image/resize,m_lfit,w_100${isWebp ? '/format,webp' : ''})`}"></dt>
                      <dt class="avatar" v-else-if="!screenVertical">
                        {{ item.name && item.name.substr(0, 1) }}
                      </dt>
                      <div class="chart-con">
                        <span class="role-name" v-if="item.role == 'host'">主持人</span>
                        <span
                          class="role-name assistant"
                          v-if="item.role == 'assistant'">助理</span>
                        <span
                          class="user-name"
                          :class="{'send-person':loginInfo && item.id == loginInfo.consumer_user_id}">{{item.name && item.name.length > 10 ? item.name.substr(0, 10) + '...' : item.name}}</span>
                        <span
                          class="been-at"
                          :key="atPerson.user_id"
                          v-for="atPerson of item.at_list">@{{ atPerson.nick_name | overHidden(10) }}</span>
                        <span class="txt" v-html="item.txt"></span>
                        <div v-if="item.msgType === 'imgChat'">
                          <div class="chat-img-list">
                            <div
                              class="chat-img-item"
                              v-for="(imgUrl, imgIdx) in item.img_list"
                              :key="imgIdx"
                              :style="{backgroundImage: `url(${imgUrl}?x-oss-process=image/resize,m_lfit,w_300${isWebp ? '/format,webp' : ''})`}"
                              @click="showImgBrowser(imgIdx, item.img_list)"></div>
                          </div>
                        </div>
                      </div>
                    </dl>
                  </template>
                  <template v-else-if="item.msgType === 'marketTool'">
                    <div
                      :class="item.eventType"
                      @click="clickSaleToolItem(item)"
                      class="sales-tool-box">
                      <div class="market-info">
                        <span
                          class="user-name"
                          :class="{'send-person':loginInfo && item.id == loginInfo.consumer_user_id}">{{ item.name }}</span>
                        <span
                          class="user-info"
                          v-if="item.eventType === 'GOODS_PUSH'">推送了
                          <em @click="moreInfo('goods', item.detail.goods_id)">商品</em>，赶快看看吧</span>
                        <span
                          class="user-info"
                          v-if="item.eventType === 'RECOMMEND_CARD_PUSH'">推送了
                          <em @click="moreInfo('cards', item.detail.recommend_card_id)">卡片</em>，赶快看看吧</span>
                        <span
                          class="user-info"
                          v-if="item.eventType === 'NAIRE'"
                        >推送了
                          <em @click="moreInfo('ques', item.detail.naire_id)">问卷</em>，赶快参与吧</span>
                        <span
                          class="user-info"
                          v-if="item.eventType === 'RED_PACKET_PUSH'">推送了
                          <em @click="moreInfo('redpack', item.detail.red_packet_uuid)">红包雨</em>，赶快去抢吧</span>
                        <span
                          class="user-info"
                          v-if="item.eventType === 'LOTTERY_PUSH'">推送了
                          <em @click="moreInfo('lottery', item)">抽奖</em>，赶快去查看吧</span>
                      </div>
                    </div>
                  </template>
                  <!-- 礼物和打赏的聊天 -->
                  <template v-else-if="item.msgType === 'rewardTool'">
                    <!-- 礼物 -->
                    <div class="reward-tool-box" v-if="item.detail.type === 'gift'">
                      <p class="nick-name">
                        {{ item.detail.nickname | overHidden(6) }}:
                      </p>
                      <p class="gift-name">
                        赠送{{ item.detail.name | overHidden(6) }}
                      </p>
                      <div class="gift-info">
                        <span
                          class="gift-img"
                          :class="[item.detail.system_status === '0' ? 'cover-img' : 'contain-img']"
                          :style="{backgroundImage: `url(${$imgHost}/${item.detail.image_url}?x-oss-process=image/resize,m_lfit,w_100)`}"></span>
                        <span class="gift-num">
                          x<span class="num">{{ item.detail.num }}</span>
                        </span>
                      </div>
                    </div>
                    <!-- 打赏 -->
                    <div class="reward-tool-box" v-if="item.detail.type === 'reward'">
                      <p class="nick-name">
                        {{ item.detail.nickname | overHidden(6) }}:
                      </p>
                      <p class="price">{{ `打赏 ${item.detail.money}元` }}</p>
                      <div class="money-img cover-img"></div>
                    </div>
                  </template>
                </li>
              </div>
            </template>
            <!-- 底部间隔 -->
            <div class="empty-bottom"></div>
          </ol>
          <div slot="top" class="mint-loadmore-top">
            <template
              v-if="activityInfo.status === 'PLAYBACK' || activityInfo.status === 'FINISH'">
              <span
                v-show="topStatus === ''"
                :class="{ rotate: topStatus === 'drop' }">下拉加载更多 ↓</span>
              <span v-show="topStatus === 'loading'">Loading...</span>
              <span v-show="topStatus === 'ending'">没有数据了</span>
            </template>
          </div>
        </mt-loadmore>
      </div>
      <div class="empty" v-if="filterChat.length == 0 && historyLoadingEnd">
        <div class="empty-chat-img"></div>
        暂时没有聊天哦～
      </div>
    </div>
    <transition name="fade">
      <div
        class="bottom-tips"
        v-if="(tipsShow && tipsCount > 0) || atContent.show">
        <div
          class="msg-tips"
          @touchstart="doScrollBottom"
          v-if="tipsShow && tipsCount > 0">
          有{{ tipsCount }}条新消息
          <i class="iconfont icon-down"></i>
        </div>
        <div class="atperson-box" v-if="atContent.show">
          <dl class="clearfix at-person-content">
            <dt
              v-if="
                !screenVertical &&
                 atContent.avatar &&
                 atContent.avatar !=='//static.vhallyun.com/public/static/img/null.png'"
              style="background-size: cover;background-position: center center;"
              :style="{backgroundImage: `url(${atContent.avatar}?x-oss-process=image/resize,m_lfit,w_100${isWebp ? '/format,webp' : ''})`}"></dt>
            <dt class="avatar" v-else-if="!screenVertical">
              {{ atContent.nick_name && atContent.nick_name.substr(0, 1) }}
            </dt>
            <div class="chart-con">
              <span class="role-name" v-if="atContent.role == 'host'">主持人</span>
              <span
                class="role-name assistant"
                v-if="atContent.role == 'assistant'">助理</span>
              <span class="user-name send-person">{{
                atContent.nick_name | overHidden(10)
              }}</span>
              <span class="been-at"> @了你</span>
              <div
                class="txt"
                v-if="atContent.stretch"
                v-html="atContent.text_content"></div>
            </div>
          </dl>
          <span
            v-if="atContent.stretch || atContent.text_content == ''"
            class="iconfont icon-close1 close"
            @click="atContent.show = false"></span>
          <span
            v-else
            class="iconfont icon-wenjuan_xialatixialajiantou- stretch"
            @click="atContent.stretch = true"></span>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="user-join-tips" v-if="tipUserList.length > 0">
        <template v-for="(tip, idx) in tipUserList">
          <div class="user-join-tips-item" v-if="tip.name" :key="idx">
            <div class="user-join-tips-con">
              <span class="join-tips-name">
                {{ tip.name | overHidden(10) }}
              </span>
              <span v-if="tip.type === 'join'">来了</span>
              <span v-else>购买了商品</span>
            </div>
          </div>
        </template>
      </div>
    </transition>
    <img-browser
      v-if="imgBrowserShow"
      :showIdx="browserIdx"
      :img-list="browserImgList"
      @quit="quitImgBrowser"></img-browser>
  </div>
</template>

<script>
import { ActivityTool, BusTool } from 'src/utils/ConfigTool'
import EventBus from 'src/utils/eventBus.js'
import { mapMutations, mapState } from 'vuex'
import * as types from 'src/store/mutation-types'
import ImgBrowser from 'src/components/img-browser/index'
export default {
  name: 'chat',
  components: { ImgBrowser },
  data() {
    return {
      isWebp: window.webp,
      vhallParams: {
        token: '',
        appId: '',
        channelId: '',
        accountId: ''
      },
      topStatus: '',
      activity_id: this.$route.params.id,
      imgBrowserShow: false,
      browserImgList: [],
      browserIdx: 0,
      value: '',
      valueAnnounce: '',
      receiveAnnounce: '',
      service: null,
      chatData: [],
      tipUserList: [],
      tipsShow: false,
      announceShow: false,
      faceOpen: false,
      swapAnnounce: true,
      mute: false,
      allMuted: false,
      tipsCount: 0,
      timer: null,
      isLogin: false,
      isOverBox: false, // 竖屏聊天是否超出屏幕
      chatPlaceholder: '聊点什么吧...',
      announcePlaceholder: '请输入公告内容',
      aBScroll: null,
      scrollEvent: null,
      historyPage: 1,
      isEmpty: false, // 没有聊天数据了
      historyParams: {},
      /* 表情数组 */
      realOnlineNum: 0,
      authChatSwitch: false, // 是否开启聊天审核
      chatGap: 0,
      faceArr: [],
      historyLoadingEnd: false, // 读取历史记录是否完成
      chatFrequency: 0, // 聊天频率
      chatFrequencyLevel: 'low', // 频率等级:low低，mid中，high高
      atContent: {
        show: false,
        stretch: false, // 伸展状态
        avatar: '',
        role: '',
        nick_name: '',
        text_content: ''
      },
      live_delay: 8000
    }
  },
  props: {
    scrollDis: {
      // 容器高度 用于判断下拉刷新滚动距离
      type: Number,
      default: 800
    },
    type: {
      // 活动状态 LIVE直播 VOD回放
      type: String,
      default: 'live'
    },
    screenVertical: {
      // 是否竖屏
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('liveMager', {
      activityInfo: state => state.activityInfo, // 活动信息
      visiteInfo: state => state.visiteInfo, // 参会信息
      customTheme: state => state.customTheme,
      barrageSettings: state => state.barrageSettings
    }),
    ...mapState('login', {
      loginInfo: state => state.loginInfo
    }),
    ...mapState('chatLimit', {
      chatOnlyHost: state => state.chatOnlyHost
    }),
    chatImg () {
      if (this.customTheme.chatImg) {
        return this.screenVertical ? '' : `${this.$imgHost}/${this.customTheme.chatImg}?x-oss-process=image/resize,m_lfit,w_1000${this.isWebp ? '/format,webp' : ''}`
      } else {
        return ''
      }
    },
    filterChat() {
      if (this.chatOnlyHost) {
        return this.chatData.filter(msg => {
          return (
            msg.role === 'host' ||
              msg.role === 'assistant' ||
              msg.msgType === 'marketTool'
          )
        })
      } else {
        return this.chatData
      }
    }
  },
  created() {
    this._msgListLocal = [] // 本地消息缓存
    this._chatRender = this.ChatThrottle(() => {
      this._msgListLocal.forEach(item => {
        this.reArrange(item, 'push')
      })
      this._msgListLocal = []
      this.$nextTick(res => {
        if (
          !this.tipsShow &&
            this.activityInfo.status !== ActivityTool.status.PLAYBACK &&
            this.activityInfo.status !== ActivityTool.status.FINISH
        ) {
          this.scrollToBtm()
        }
      })
    }, 500)
  },
  mounted() {
    this.realOnlineNum = this.activityInfo.true_online_num
    const bscrollElment = this.$refs.bscroll
    this.scrollEvent = this.throttle(e => {
      const val =
          bscrollElment.offsetHeight + bscrollElment.scrollTop <
          bscrollElment.scrollHeight - 50
      if (val) {
        if (!this.tipsShow) {
          this.tipsCount = 0
          this.tipsShow = true
        }
      } else {
        this.tipsShow = false
      }
    }, 100)
    this.intPage()
  },
  methods: {
    ...mapMutations('chatLimit', {
      storeMute: types.CHAT_MUTE,
      storeAllMute: types.CHAT_AllMUTE
    }),
    async intPage () {
      if (this.activityInfo.all_gag === 'Y') {
        this.allMuted = true
      }
      this.storeAllMute(this.allMuted)
      this.initEvent()
      // 拉取最近聊天记录
      this.getHistroy(1)
      // 聊天审核状态
      this.initAuthInfo()
      this.initSdk()
    },
    initEvent() {
      // 发送口令
      EventBus.$on('sendPassword', msg => {
        this.value = msg
        this.sendAction('redBag')
      })
      // 发送抽奖口令
      EventBus.$on('sendLotteryPassword', msg => {
        this.value = msg
        this.sendAction('lottery')
      })
      // 接受消息 解决iPhone手机 bug
      EventBus.$onOnly('sendChatMsg', msg => {
        this.value = msg.content
        this.sendAction()
      })
      EventBus.$on(BusTool.LIVE_DELAY, time => {
        // 直播延迟时间
        this.live_delay = Math.round(time + 3) * 1000
      })
    },
    initSdk() {
      const VhallSdk = window.VHALL_ZK
      this.faceArr = VhallSdk.$chat.getEmojiArr()
      VhallSdk.$chat.onChat(this.listenChat)
      VhallSdk.$event.on(VhallSdk.EVENTS.JOIN, this.userJoin)
      VhallSdk.$event.on(VhallSdk.EVENTS.LEAVE, this.userLeave)
      VhallSdk.$event.on(VhallSdk.EVENTS.ANNOUNCEMENT, this.listenAnnounce)
      VhallSdk.$event.on(VhallSdk.EVENTS.KICK, this.listenKick) // 踢出
      VhallSdk.$event.on(VhallSdk.EVENTS.KICK_BATCH, this.listenBatchKick)
      VhallSdk.$event.on(VhallSdk.EVENTS.DISABLE_KICK, this.listenCancelkick)
      VhallSdk.$event.on(VhallSdk.EVENTS.GAG, this.listenMute) // 禁言
      VhallSdk.$event.on(VhallSdk.EVENTS.DISABLE_GAG, this.listenCancelmute)
      VhallSdk.$event.on(VhallSdk.EVENTS.GAG_ALL, this.listenAllmute)
      VhallSdk.$event.on(VhallSdk.EVENTS.DISABLE_GAG_ALL, this.listenCancelallmute)
      VhallSdk.$event.on(VhallSdk.EVENTS.DELETE_MESSAGE, this.delChartByMsgId)
      VhallSdk.$event.on(VhallSdk.EVENTS.CHAT_ADGED, this.initAuthInfo)
    },
    initAuthInfo() {
      let timeOut = 0
      if (this.authChatSwitch) {
        timeOut = 2000
      }
      let s = setTimeout(() => {
        clearTimeout(s)
        VHALL_ZK.$api.getChatSetting().then(res => {
          this.authChatSwitch = res.data.auth_chat === 1 // 自动审核：1.开启 2.关闭
        })
      }, timeOut)
    },
    loadTop() {
      if (
        this.activityInfo.status !== ActivityTool.status.PLAYBACK &&
          this.activityInfo.status !== ActivityTool.status.FINISH
      ) {
        this.$refs.loadmore.onTopLoaded()
        return
      }
      this.topStatus = 'loading'
      if (this.isEmpty) {
        this.topStatus = 'ending'
        let st = setTimeout(() => {
          clearTimeout(st)
          this.$refs.loadmore.onTopLoaded()
        }, 1000)
        return
      }
      this.historyPage++
      this.getHistroy(this.historyPage, e => {
        this.$refs.loadmore.onTopLoaded()
      })
    },
    ChatThrottle(func, mustRun) {
      let timeout
      let startTime = new Date()
      return function () {
        let context = this
        let args = arguments
        let curTime = new Date()
        clearTimeout(timeout)
        // 如果达到了规定的触发时间间隔，触发 handler
        if (curTime - startTime >= mustRun) {
          func.apply(context, args)
          startTime = curTime
          // 没达到触发间隔，重新设定定时器
        } else {
          timeout = setTimeout(() => {
            clearTimeout(timeout)
            func.apply(context, args)
          }, mustRun)
        }
      }
    },
    throttle(func, mustRun) {
      let timeout
      let clock = true
      let startTime = new Date()
      return function () {
        let context = this
        let args = arguments
        let curTime = new Date()
        if (clock) {
          func.apply(context, args)
          clock = false
        }
        clearTimeout(timeout)
        // 如果达到了规定的触发时间间隔，触发 handler
        if (curTime - startTime >= mustRun) {
          // func.apply(context, args)
          clock = true
          startTime = curTime
          // 没达到触发间隔，重新设定定时器
        } else {
          timeout = setTimeout(() => {
            clearTimeout(timeout)
            func.apply(context, args)
            clock = true
          }, mustRun)
        }
      }
    },
    clickSaleToolItem(item) {
      let detailItem = { ...item.detail }
      EventBus.$emit(detailItem.type, { ...detailItem, source: 'chat' })
    },
    changeFace() {
      this.faceOpen = !this.faceOpen
    },
    async sendAction(type) {
      if (!this.value.replace(/\n/g, '').length) {
        this.chatPlaceholder = '聊天内容不能为空'
        return false
      }
      /* 3，根据在线人数,对观众进行聊天频次限制 */
      if (!(type === 'redBag' || type === 'lottery')) {
        // 不是红包和抽奖
        /* 4，根据在线人数,对观众进行聊天频次限制 */
        if (this.chatGap > 0) {
          this.$toast(`您的手速过快，请${this.chatGap}秒后重试`)
          return
        }
        this.chatGap = this.delayTime(this.realOnlineNum)
        this.gapInterval = setInterval(() => {
          this.chatGap--
          if (this.chatGap <= 0) {
            clearInterval(this.gapInterval)
            this.gapInterval = null
            this.chatGap = 0
          }
        }, 1000)
      }
      let obj = {
        txt: this.value.trim() // 输入内容
      }
      if (type === 'redBag' || type === 'lottery') {
        if (type === 'redBag') {
          EventBus.$emit(BusTool.red_packet, {
            condition: 2,
            password: this.value
          })
        } else if (type === 'lottery') {
          EventBus.$emit(BusTool.lottery_send, {
            password: this.value
          })
        }
        obj.passbarrage = 'Y'
        obj.auditStatus = 1 // 自动绕过聊天审核
        VHALL_ZK.$chat.sendChat(obj, 'chat')
      } else {
        let chat = await VHALL_ZK.$chat.sendChat(obj)
        if (this.authChatSwitch) { // 聊天审核打开
          this.listenChat({
            msgId: chat.msgId,
            data: {
              text_content: obj.txt,
              type: 'text'
            },
            context: {
              role: 'watch',
              consumer_user_id: this.loginInfo.consumer_user_id || this.loginInfo.visit_id,
              nick_name: this.loginInfo.nick_name,
              avatar: this.loginInfo.avatar
            },
            msgType: 'self'
          })
        }
      }
      this.value = ''
      this.chatPlaceholder = '聊点什么吧…'
      this.faceOpen = false
      this.$emit('closeChatBox', true)
    },
    quitImgBrowser() {
      this.imgBrowserShow = false
      this.browserIdx = 0
      this.browserImgList = []
    },
    showImgBrowser(idx, imgList) {
      this.imgBrowserShow = true
      this.browserIdx = idx
      this.browserImgList = imgList
    },
    autoAnalysis() {
      this.chatFrequency++
      if (!this.freqTime) {
        this.freqTime = setTimeout(() => {
          clearTimeout(this.freqTime)
          this.freqTime = null
          if (this.chatFrequency > 80) {
            this.chatFrequencyLevel = 'maxHigh'
          } else if (this.chatFrequency > 40) {
            this.chatFrequencyLevel = 'high'
          } else if (this.chatFrequency > 30) {
            this.chatFrequencyLevel = 'mid'
          } else {
            this.chatFrequencyLevel = 'low'
          }
          console.log(
            `count=${this.chatFrequency},  level=${this.chatFrequencyLevel}`
          )
          this.chatFrequency = 0
        }, 5000)
      }
    },
    listenChat(msg) {
      /* 1，如果开启聊天审核, 不接收自己消息 */
      if (msg.context.role === 'watch' && this.authChatSwitch && msg.context.UUID === window.$uuid && (msg.msgType !== 'self' && msg.data.zkType !== 'GIFT_CHAT' && msg.data.zkType !== 'REWARD_CHAT')) {
        return
      }
      if (msg.msgType !== 'chat' && msg.msgType !== 'self') { // 不是聊天消息直接拒绝接收
        /* disable 禁言频道内某个用户的聊天（频道内单个用户的禁言）
          disable_all 禁言整个频道的聊天（全员禁言）
          permit 取消禁言频道内某个用户的聊天（取消频道内单个用户的禁言）
          permit_all 取消禁言整个频道的聊天 （取消全员禁言）
          * */
        return
      }
      /* 自动分析聊天 */
      this.autoAnalysis()
      if (msg.data.zkType === 'MARKET_TOOL') {
        /* 根据直播延迟时间延迟处理营销工具推送消息 */
        let sTime = setTimeout(() => {
          clearTimeout(sTime)
          this.nextListenChat(msg)
        }, this.live_delay)
      } else {
        this.nextListenChat(msg)
      }
    },
    nextListenChat(msg) {
      this.$emit('chartMsg', msg)
      this._msgListLocal.push(msg)
      this._chatRender()
      if (this.tipsShow) {
        this.tipsCount++
      }
      /* @聊天提醒 */
      /* 4，@聊天提醒 */
      if (msg.data.zkType === 'at' && msg.data.at_list.length) {
        const atSelf = msg.data.at_list.find(atPerson => {
          return atPerson.user_id == this.loginInfo.consumer_user_id || atPerson.user_id == this.visiteInfo.visit_id
        })
        if (atSelf) {
          this.atPersonTip(msg)
        }
      }
      /* 发送弹幕 */
      if (!['MARKET_TOOL', 'REWARD_CHAT', 'GIFT_CHAT'].includes(msg.data.zkType)) {
        const text = msg.data.text_content
        if (!msg.data.passbarrage && text !== '') {
          // 过滤掉口令的绕过弹幕标识和发送@消息-图片消息的空信息
          this.sendBarrage(text)
        }
      }
    },
    // 被@的消息提醒
    atPersonTip(msg) {
      this.atContent.show = true
      this.atContent.stretch = false
      this.atContent.text_content = msg.data.text_content
      this.atContent.avatar = msg.context.avatar
      this.atContent.role = msg.context.role
      this.atContent.nick_name = msg.context.nick_name
      // 与消息处理相同的表情和头像处理
      this.atContent.avatar = msg.avatar
      if (
        this.atContent.avatar &&
          this.atContent.avatar.indexOf('//') !== 0 &&
          this.atContent.avatar.indexOf('https') !== 0
      ) {
        this.atContent.avatar = this.atContent.avatar
          ? `${this.$imgHost}/${this.atContent.avatar}`
          : ''
      }
      /* 替换表情图片 */
      for (let i = 0; i < this.faceArr.length; i++) {
        for (let key in this.faceArr[i]) {
          let test = key.replace(/\[/, '\\[').replace(/\]/, '\\]')
          let reg = new RegExp(test, 'g')
          this.atContent.text_content = this.atContent.text_content.replace(
            reg,
            "<img src='//cnstatic01.e.vhall.com/static/img/arclist/Expression_" +
              this.faceArr[i][key] +
              "@2x.png'>"
          )
        }
      }
    },
    listenAnnounce(msg) {
      this.announceShow = true
      this.receiveAnnounce = msg.content
    },
    listenBatchKick(msg) {
      // 批量踢出
      console.log('--------批量踢出---------')
      console.log(JSON.stringify(msg))
      let userList = msg.activity_user_id.join(',')
      userList.every(user_id => {
        if (this.isSelf(user_id)) {
          this.$router.replace('/kicked')
          return false
        }
        this.refreshList(user_id, 'is_kick', 'Y')
        return true
      })
    },
    listenKick(msg) {
      if (this.isSelf(msg.activity_user_id)) {
        this.$router.replace('/kicked')
      } else {
        this.refreshList(msg.activity_user_id, 'is_kick', 'Y')
      }
    },
    listenCancelkick(msg) {
      this.refreshList(msg.activity_user_id, 'is_kick', 'N')
    },
    listenMute(msg) {
      this.refreshList(msg.activity_user_id, 'is_gag', 'Y')
      if (this.isSelf(msg.activity_user_id)) {
        EventBus.$emit('chatClose') // 关闭聊天输入框
        this.mute = true
      }
      this.storeMute(this.mute)
    },
    listenCancelmute(msg) {
      // 如果是自己 的相关操作
      if (this.isSelf(msg.activity_user_id)) {
        this.mute = false
      }
      this.refreshList(msg.activity_user_id, 'is_gag', 'N')
      this.storeMute(this.mute)
    },
    listenAllmute(msg) {
      EventBus.$emit('chatClose') // 关闭聊天输入框
      this.allMuted = true
      this.storeAllMute(this.allMuted)
    },
    listenCancelallmute(msg) {
      this.allMuted = false
      this.storeAllMute(this.allMuted)
    },
    delChartByMsgId(msg) {
      this.chatData.every((chartItem, idx) => {
        if (chartItem.msg_id === msg.msg_id) {
          this.chatData.splice(idx, 1)
          return false
        }
        return true
      })
    },
    isSelf(id) {
      const compareId = this.loginInfo.consumer_user_id || this.visiteInfo.visit_id
      if (compareId === id) {
        return true
      } else {
        return false
      }
    },
    refreshList(id, type, status) {
      this.chatData.forEach(item => {
        if (item.id * 1 === id * 1) {
          item[type] = status
        }
      })
    },
    userLeave() {
      this.realOnlineNum -= 1
    },
    userJoin(msg) {
      this.realOnlineNum += 1
      if (msg.context && typeof msg.context === 'string') {
        msg.context = JSON.parse(msg.context)
        if (
          this.loginInfo &&
            this.loginInfo.consumer_user_id === msg.context.consumer_user_id
        ) {
          // 当前用户
          return
        }
        let obj = {
          msg_id: msg.msg_id || msg.msgId,
          type: 'join',
          name: msg.context.nick_name
        }
        this.pushTipDataOne(obj)
      }
    },
    pushTipDataOne(obj) {
      this.tipUserList = [obj]
      clearTimeout(this.ts)
      this.ts = setTimeout(() => {
        clearTimeout(this.ts)
        this.tipUserList = []
      }, 5000)
    },
    reArrange(msg, type) {
      msg.data = msg.data || msg.msg_data
      msg.msg_id = msg.msgId || msg.msg_id
      try {
        let obj = {}
        if (msg.context && typeof msg.context === 'string') {
          msg.context = JSON.parse(msg.context)
        }
        if (typeof msg.data === 'string') {
          msg.data = JSON.parse(msg.data)
        }
        obj.txt = msg.data.text_content || ''
        obj.role = msg.context.role
        obj.name = msg.context.nick_name
        obj.msg_id = msg.msgId || msg.msg_id
        if (msg.data.zkType === 'MARKET_TOOL' || msg.send_id === 'MARKET_TOOL') { // 营销工具消息
          obj.msgType = 'marketTool'
          obj.detail = JSON.parse(msg.data.text_content)
          obj.eventType = obj.detail.type
          obj.name = obj.name || obj.detail.nick_name
        } else if (msg.data.zkType === 'GIFT_CHAT' || msg.data.zkType === 'REWARD_CHAT') { // 礼物/打赏
          obj.detail = JSON.parse(msg.data.text_content)
          obj.msgType = 'rewardTool'
          obj.eventType = 'chat'
        } else { // 普通聊天消息
          if (msg.data.zkType === 'imgChat') {
            obj.msgType = 'imgChat'
            obj.img_list = msg.data.img_list
          } else {
            obj.msgType = 'chat'
          }
          obj.eventType = 'chat'
          obj.id = msg.context.consumer_user_id
          obj.avatar = msg.context.avatar || msg.avatar
          if (obj.avatar && obj.avatar.indexOf('//') !== 0 && obj.avatar.indexOf('https') !== 0) {
            obj.avatar = obj.avatar ? `${this.$imgHost}/${obj.avatar}` : ''
          }
          obj.date_time = msg.time || msg.send_time
          obj.is_gag = msg.is_gag || 'N'
          obj.is_kick = msg.is_kick || 'N'
          if (obj.txt && obj.role !== 'watch') {
            obj.txt = obj.txt.replace(/</g, '&lt;').replace(/>/g, '&gt;')
            /* 正则匹配校验url */
            /* eslint-disable */
              let reg = /(https:\/\/|http:\/\/|\/\/|www\.)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
              obj.txt = obj.txt.replace(reg, (url) => {
                let href = url
                if (url.indexOf('www.') === 0) {
                  href = `//${url}`
                }
                return `<a class='a_link' href="${href}" title="点击打开链接" target='_blank'>${url}</a>`
              })
              /* eslint-enable */
          }
          /* 替换表情图片 */
          for (let i = 0; i < this.faceArr.length; i++) {
            for (let key in this.faceArr[i]) {
              let test = key.replace(/\[/, '\\[').replace(/\]/, '\\]')
              let reg = new RegExp(test, 'g')
              obj.txt = obj.txt.replace(
                reg,
                "<img src='//cnstatic01.e.vhall.com/static/img/arclist/Expression_" +
                  this.faceArr[i][key] +
                  "@2x.png'>"
              )
            }
          }
          /* 组合atList到消息内  */
          if (msg.data.at_list && msg.data.at_list.length) {
            obj.at_list = msg.data.at_list
          }
        }
        if (this.type === 'vod' || this.type === 'end') {
          if (type === 'push') {
            this.chatData.push(obj)
          } else {
            this.chatData.unshift(obj)
          }
        } else {
          if (this.chatData.length >= 100) {
            let upsetLength = 0 // 用于减少splice操作造成的内存cpu飙升
            if (this.chatFrequencyLevel === 'maxHigh') {
              upsetLength = 40
            } else if (this.chatFrequencyLevel === 'high') {
              upsetLength = 20
            } else if (this.chatFrequencyLevel === 'mid') {
              upsetLength = 10
            }
            let chatList = JSON.parse(JSON.stringify(this.chatData))
            chatList.push(obj)
            this.chatData = chatList.splice(-100 + upsetLength)
          } else {
            this.chatData.push(obj)
          }
        }
      } catch (e) {
        console.warn(e)
      }
    },
    cancelClick() {
      this.$emit('closeChatBox', true)
    },
    doScrollBottom() {
      this.scrollToBtm()
      this.tipsCount = 0
    },
    scrollBottom(speed = 10) {
      // 滚动动画
      let elm = document.querySelector('.bscroll')
      let maxTop = elm.scrollHeight - elm.offsetHeight
      let interId = setInterval(() => {
        if (elm.scrollTop < maxTop) {
          elm.scrollTop += speed
        } else {
          clearInterval(interId)
        }
      }, 0)
      this.tipsCount = 0
    },
    countOver() {
      if (this.screenVertical && this.chatData.length <= 10) {
        let elm = document.querySelector('.bscroll-content')
        if (elm && elm.offsetHeight < elm.parentNode.offsetHeight) {
          this.isOverBox = true
        } else {
          this.isOverBox = false
        }
      } else {
        this.isOverBox = false
      }
    },
    scrollToBtm() {
      // 直接滚动到底部
      this.countOver()
      let elm = document.querySelector('.bscroll')
      let maxTop = elm.scrollHeight - elm.offsetHeight
      elm.scrollTop = maxTop + 20
    },
    scrollTo(speed = 10) {
      this.countOver()
      let elm = document.querySelector('.bscroll')
      if (elm) {
        let top = NaN
        let interId = setInterval(() => {
          // top !== elm.scrollTop 防止初始化1页，时死循环问题
          if (
            top !== elm.scrollTop &&
              elm.scrollTop < this.scrollDis - elm.offsetHeight
          ) {
            top = elm.scrollTop
            elm.scrollTop += speed
          } else {
            clearInterval(interId)
          }
        }, 0)
        /* 5秒如果没有处理完，就结束，防止死循环 */
        let st = setTimeout(() => {
          clearTimeout(st)
          clearInterval(interId)
        }, 5000)
      }
    },
    /* 选择表情 */
    inFace(index) {
      for (let key in this.faceArr[index]) {
        this.value += key
      }
      this.faceOpen = !this.faceOpen
      document.getElementsByClassName('inp')[0].children[0].focus()
    },
    getHistroy(page, successFn) {
      if (
        this.activityInfo.status === ActivityTool.status.PLAYBACK ||
          this.activityInfo.status === ActivityTool.status.FINISH
      ) {
        // 回放拉取所有的 并分页
        this.historyParams = {
          activity_id: this.activity_id,
          page: page
        }
      } else {
        this.historyParams = {
          activity_id: this.activity_id
        }
      }
      if (!this.isEmpty) {
        window.VHALL_ZK.$chat.getChatHistroy({
          ...this.historyParams,
          random: Math.random()
        }).then(res => {
          if (res.data.list.length <= 0) {
            this.isEmpty = true
            if (successFn) successFn('end')
          }
          if (
            this.activityInfo.status === ActivityTool.status.PLAYBACK ||
              this.activityInfo.status === ActivityTool.status.FINISH
          ) {
            res.data.list.forEach(item => {
              this.reArrange(item)
            })
            this.$nextTick(res => {
              if (this.isEmpty) return
              this.scrollTo()
            })
          } else {
            res.data.list.reverse().forEach(item => {
              this.reArrange(item)
            })
            this.$nextTick(() => {
              if (
                !this.tipsShow &&
                  this.activityInfo.status !== ActivityTool.status.PLAYBACK &&
                  this.activityInfo.status !== ActivityTool.status.FINISH
              ) {
                let st2 = setTimeout(() => {
                  clearTimeout(st2)
                  this.scrollToBtm()
                }, 50)
              }
            })
          }
          if (successFn) successFn()
          this.historyLoadingEnd = true
        })
      }
    },
    loginHandler() {
      this.$emit('showLogin')
    },
    moreInfo(type, id) {
      this.$emit('clickTools', {
        type: type,
        id: id
      })
    },
    /**
       * 获取根据人数和系数获取延迟时间
       * @param n 人数
       * @param o 非必传，系数，不传递默认为1
       * @returns {number}
       */
    delayTime(n, o) {
      n = n || 0
      o = o || 1
      let result = 0
      if (n <= 500) {
        result = 3
      } else if (n <= 1000) {
        // 大于500，小于1000
        result = 10
      } else if (n <= 2000) {
        // 大于1000，小于2000
        result = 15
      } else if (n <= 5000) {
        // 大于2000，小于5000
        result = 30
      } else if (n > 5000) {
        // 大于5000
        result = 60
      }
      return result
    },
    sendBarrage(content) {
      if (!this.barrageSettings || !this.barrageSettings.useBarrage) return
      EventBus.$emit('send_barrage', content)
    }
  },
  watch: {
    'loginInfo.consumer_user_id': {
      // 观看端 是否已登陆
      handler(newValue) {
        if (newValue) {
          this.isLogin = true
        }
      },
      immediate: true
    },
    allMuted: {
      handler(newValue) {
        // 是否全体禁言
        if (newValue) {
          this.$emit('isMute', {
            isMute: true,
            type: 'allMuted'
          })
        } else {
          if (this.mute) {
            this.$emit('isMute', {
              isMute: true,
              type: 'mute'
            })
          } else {
            this.$emit('isMute', {
              isMute: false,
              type: 'allMuted'
            })
          }
        }
      },
      deep: true
    },
    mute: {
      handler(newValue) {
        // 是否全体禁言
        if (newValue) {
          this.$emit('isMute', {
            isMute: true,
            type: 'mute'
          })
        } else {
          this.$emit('isMute', {
            isMute: false,
            type: 'mute'
          })
        }
      },
      deep: true
    },
    'activityInfo.setting.gag': {
      handler(newValue) {
        // 是否全体禁言
        if (newValue === 'Y') {
          this.allMuted = true
        } else {
          this.allMuted = false
        }
        this.storeAllMute(this.allMuted)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped src="./chat.scss"></style>
