<template>
  <div class="watch-warp" :class="{'vertical-screen':vScreen, 'full-screen':isFullScreen}">
    <div class="w-header">
      <div class="header-logo">
        <span class="img-box">
          <img v-if="customLogo" :src="customLogo">
          <img v-else-if="isWebp" src="../../../assets/image/logo_h5.webp">
          <img v-else src="../../../assets/image/logo_h5.png">
        </span>
        <span class="logo-info" v-if="vScreen">
          <span style="font-size: 12px;">{{activityInfo.sponsor}}</span>
          <span style="font-size: 10px;" v-if="buttonSettings.showViewCount">{{showPersonCount}}次观看</span>
        </span>
      </div>
      <span class="w-status">
        <i v-if="activityStatus === '直播中'"></i>{{ $t(`watch.${activityStatus}`) }}
      </span>
      <div class="w-header-right">
        <!-- 视频控制 -->
        <a href="javascript:;" @click="showSheetView = true" v-if="sheetContolBtn">
          <i class="iconfont icon-set"></i>
        </a>
      </div>
    </div>
    <div class="w-main-content">
      <component :is="currentView" :paasParams="vhallParams" :domShow="!isFullScreen" ref="playContents"></component>
    </div>
    <!-- 抽奖 -- 倒计时 -->
    <message-box
      v-if="showDraw"
      class="draw-wrap">
      <div slot="msgBox" class="draw-box">
        <span class="close-btn" @click="showDraw = false">
          <i class="iconfont icon-delete"></i>
        </span>
        <div class="draw-pic">
          <img :src="lotteryPic">
        </div>
        <div class="award-info">
          <div class="award-name">{{lotteryInfo.award_name}}</div>
          <div class="award-des">{{lotteryInfo.award_desc|fmtAwardDesc}}<a v-if="lotteryInfo.link_url" :href="lotteryInfo.link_url" target="_blank">查看奖品</a></div>
        </div>
        <div class="lottery-animation-pic" :style="{backgroundImage: `url(${lotteryInfo.icon})`}"></div>
        <div class="draw-tip-txt">
          <!--立即开始 正在抽奖-->
          <p v-if="lotteryInfo.lottery_status == 0 && drawTime == 0" class="drawing">正在进行抽奖…</p>
          <!--间隔开始 等待抽奖-->
          <p v-if="drawTime > 0 && shareCondition" class="draw-down">抽奖还需<span>{{drawTime|fmtTimer}}</span>开始哦～</p>
          <!--口令-->
          <p v-if="loginInfo && drawTime > 0 && lotteryInfo.lottery_type == 8 && lottery_isSend">您已成功发送口令</p>
          <p v-if="loginInfo && drawTime > 0 && lotteryInfo.lottery_type == 8 && !lottery_isSend" class="draw-code">发送口令<span class="send-extension">"{{lotteryInfo.extension|ftmExtension}}"</span>参与抽奖吧！</p>
          <!--分享-->
          <p v-if="loginInfo && drawTime > 0 && lotteryInfo.lottery_type == 9 && !lottery_isShare">赶快分享参与抽奖吧！</p>
          <!--邀请-->
          <span class="invite-tip" v-if="loginInfo && drawTime > 0 && lotteryInfo.lottery_type == 10">赶快邀请{{lotteryInfo.invite_number}}位好友参与抽奖吧！</span>
          <p v-if="loginInfo && drawTime > 0 && lotteryInfo.lottery_type == 10" class="refresh-invite-number" @click.stop="queryInviteToLotteryUsers">刷新邀请列表</p>
          <!--发送口令-->
          <button class="primary-button send-extension-btn" v-if="loginInfo && drawTime > 0 && lotteryInfo.lottery_type == 8" :disabled="lottery_isSend" @click.stop="lotterySendChat">{{lottery_isSend ? '发送成功' : '立即发送'}}</button>
          <!--立即分享-->
          <button class="primary-button share-btn" v-if="loginInfo && drawTime > 0 && lotteryInfo.lottery_type == 9" :disabled="lottery_isShare" @click.stop="lotteryShare">{{lottery_isShare ? '分享成功' : '立即分享'}}</button>
          <!--填写问卷-->
          <button class="primary-button fill-question" v-if="loginInfo && drawTime > 0 && lotteryInfo.lottery_type == 6" @click.stop="handleFillQuestion">填写问卷</button>
          <!--立即邀请-->
          <button class="primary-button invite-btn" v-if="loginInfo && drawTime > 0 && lotteryInfo.lottery_type == 10" @click.stop="lotteryShare">立即邀请</button>
          <!--立即邀请-->
          <button class="primary-button invite-btn" v-if="loginInfo && drawTime > 0 && lotteryInfo.lottery_type == 11" @click.stop="goShopping" :disabled="lottery_isShopping">{{lottery_isShopping ? '下单成功' : '立即下单'}}</button>
          <div class="not-out-link" v-if="loginInfo && drawTime > 0 && lotteryInfo.lottery_type == 11">暂不支持外链商品</div>
          <span class="invite-users-list" v-if="loginInfo && lotteryInfo.lottery_type == 10 && drawTime > 0">已成功邀请{{inviteUsers}}人</span>
          <button class="primary-button invite-btn" v-if="!loginInfo" @click.stop="clickLoginUser" :disabled="lottery_isShopping">马上登录</button>
        </div>
      </div>
    </message-box>
    <!-- 抽奖 -- 中奖 和 未中奖  -->
    <message-box
      class="draw-success-wrap"
      v-if="showDrawResult"
      @handleClick="showDrawResult = false">
      <div slot="msgBox" class="draw-success-box">
        <span class="close-btn" @click="showDrawResult = false">
          <i class="iconfont icon-delete"></i>
        </span>
        <span class="not-win-test" v-if="!isWin">很遗憾，您与大奖擦肩而过！</span>
        <!-- <span class="not-win-test" v-if="!isWin">感谢您的参与!</span> -->
        <span class="win-test" v-else>恭喜您中奖了!</span>
        <div class="award-pic">
          <img :src="lotteryPic" />
        </div>
        <div class="award-info">
          <div class="award-name">{{lotteryInfo.award_name}}</div>
          <div class="award-des">
            <div>{{lotteryInfo.award_desc|fmtAwardDesc}}<a v-if="lotteryInfo.link_url" :href="lotteryInfo.link_url" target="_blank">查看奖品</a></div>
          </div>
        </div>
        <button class="primary-button" v-if="isWin && lotteryInfo.is_address && !hasFillOutLotteryForm" @click.stop="inputDrawForm">立即领奖</button>
        <button class="primary-button" v-else @click.stop="handleShowWinsList">查看中奖名单</button>
      </div>
    </message-box>
    <!-- 抽奖 -- 填写表单-->
    <message-box
      v-if="showDrawForm"
      class="draw-form-wrap"
      @handleClick="handleDrawForm">
      <div slot="msgBox" class="draw-form-box">
        <span class="close-btn" @click="handleDrawForm">
          <i class="iconfont icon-delete"></i>
        </span>
        <div class="draw-pic">
          <img :src="lotteryPic">
        </div>
        <div class="award-info">
          <div class="award-name">{{lotteryInfo.award_name}}</div>
          <div class="award-des">{{lotteryInfo.award_desc|fmtAwardDesc}}<a v-if="lotteryInfo.link_url" :href="lotteryInfo.link_url">查看奖品</a></div>
        </div>
        <span class="form-tip">请填写您的领奖信息，方便主办方与您联系</span>
        <div class="form-box-warp">
          <div class="form-box">
            <div class="form-label"><i class="red-star">*</i>姓名:</div>
            <div class="form-content">
              <com-input :maxLength='10'
                         :errorTips="nameErrorTips"
                         @focus="nameErrorTips=''"
                         v-model="winnerInfo.nickname"
                         placeholder="请输入姓名"></com-input>
            </div>
          </div>
          <div class="form-box">
            <div class="form-label"><i class="red-star">*</i>手机号码:</div>
            <div class="form-content">
              <com-input v-model="winnerInfo.phone"
                :errorTips="phoneErrorTips"
                @focus="phoneErrorTips=''"
                class="mobile"
                type="mobile"
                placeholder="请输入手机号码"></com-input>
            </div>
          </div>
          <div class="form-box">
            <div class="form-label">地址:</div>
            <div class="form-content">
              <com-input class="award-desc"
                type="textarea"
                v-model="winnerInfo.address"
                placeholder="请输入地址"></com-input>
            </div>
          </div>
        </div>
        <button @click.stop="handleUploadForm" class="primary-button">提交</button>
      </div>
    </message-box>
    <!-- 抽奖 -- 填写成功  -->
    <message-box
      v-if="showDrawFormSuccess"
      class="draw-form-wrap-success"
      @handleClick="showDrawFormSuccess = false">
      <div slot="msgBox" class="draw-form-success-box">
        <span class="close-btn" @click="showDrawFormSuccess = false">
          <i class="iconfont icon-delete"></i>
        </span>
        <div class="draw-pic">
          <img :src="lotteryPic">
        </div>
        <div class="award-info">
          <div class="award-name">{{lotteryInfo.award_name}}</div>
        </div>
        <div class="pic"></div>
        <span class="success-tip">信息提交成功</span>
        <button class="primary-button" @click="handleShowWinsList">查看中奖名单</button>
      </div>
    </message-box>
    <!-- 抽奖 -- 中奖列表 -->
    <message-box
      v-if="showDrawWinnersList"
      class="draw-success-list"
      @handleClick="showDrawWinnersList = false">
      <div slot="msgBox" class="draw-win-list">
        <span class="close-btn" @click="showDrawWinnersList = false">
          <i class="iconfont icon-delete"></i>
        </span>
        <div class="draw-pic">
          <img :src="lotteryPic">
        </div>
        <div class="award-info">
          <div class="award-name">{{lotteryInfo.award_name}}</div>
        </div>
        <div class="win-warp" v-if="winLotteryLists.data && winLotteryLists.data.length > 0">
          <div class="win-wrap-header">
            <div class="header-title">序号</div>
            <div class="name">昵称</div>
            <div class="phone">手机号</div>
          </div>
          <div class="win-wrap-content">
            <div class="winner-item" v-for="(item, index) in winLotteryLists.data" :key="index">
              <div class="title">{{index >= 9 ? index + 1 : '0' + (index + 1)}}</div>
              <div class="name">
                <!--<img v-if="item.logo" :src="item.logo">-->
                <span v-if="item.logo"
                      class="img_header"
                      :style="{backgroundImage: `url(${item.logo}?x-oss-process=image/resize,m_lfit,w_100${isWebp ? '/format,webp' : ''})`}"></span>
                <span class="no-logo" v-else>{{item.lottery_user_nickname.substring(0, 1)}}</span>
                <span>{{item.lottery_user_nickname|fmtWinnerName}}</span>
              </div>
              <div class="phone">{{item.lottery_user_phone}}</div>
            </div>
          </div>
        </div>
        <div v-else class="none-data">暂无中奖人</div>
      </div>
    </message-box>
    <!-- 红包雨 -- 降临 -->
    <message-box v-if="redBagTipShow" @handleClick="handleRedBagClick">
      <div slot="msgBox" class="red-bag-box">
        <span class="close-btn" @click="handleRedBagClick">
          <i class="iconfont icon-delete"></i>
        </span>
        <div class="red-bag-content red-bag-content-mid" style="top: 53%;">
          <p class="red-bag-title" style="font-size: 20px;">红包雨还剩{{downTimer|fmtTimer}}到来</p>
          <p class="red-bag-info" style="margin-top: 10px;" v-if="!loginInfo">快来登录参与红包雨领取现金吧</p>
          <p class="red-bag-info" v-if="loginInfo && redBagInfo.condition==0">手速越快，抢到的红包越大哦~</p>
          <p class="red-bag-info" v-if="loginInfo && redBagInfo.condition==1">分享直播链接参与红包雨</p>
          <p class="red-bag-info" v-if="loginInfo && redBagInfo.condition==2" style="margin: 0 0 10px 0;font-size: 12px;">发送口令参与红包雨</p>
          <p class="red-bag-info tip-info" v-if="loginInfo && redBagInfo.condition==2">
            <span class="red-bag-tip">{{redBagInfo.password}}</span>
          </p>
          <p class="red-bag-info" v-else-if="redBagInfo.condition==3">填写问卷参与红包雨</p>
          <p class="red-bag-info" v-else-if="redBagInfo.condition==4">邀请{{redBagInfo.ext}}人参与红包雨</p>
        </div>
        <span class="red-bag-info-btn" v-if="!loginInfo" @click="clickLoginUser">马上登录</span>
        <span class="red-bag-info-btn" v-if="loginInfo && redBagInfo.condition==1" @click="immShare">马上分享</span>
        <span class="red-bag-info-btn" v-if="loginInfo && redBagInfo.condition==2" @click="sendPassword(isSent)">{{isSent ? `您已成功发送口令` : `发送口令`}}</span>
        <span class="red-bag-info-btn" v-if="loginInfo && redBagInfo.condition==3" @click="immInputQuestions">马上填写</span>
      </div>
    </message-box>
    <!-- 红包雨 -- 倒计时-->
    <message-box v-if="redBagTimeDownShow" @handleClick="handleRedBagClick">
      <div slot="msgBox" class="red-bag-box">
        <span class="close-btn" @click="handleRedBagClick">
          <i class="iconfont icon-delete"></i>
        </span>
        <div class="red-bag-content">
          <p class="red-bag-title" style="margin-top: 6vw;">红包雨降临倒计时</p>
          <span class="time-down">{{timer}}</span>
          <p class="red-bag-info" style='position:relative;bottom:10.5vw;' v-if="!loginInfo">快来登录参与红包雨领取现金吧</p>
          <p class="red-bag-info" style="width: 65%;margin:-14px auto 10px auto;" v-else>点击屏幕上落下的红包 手速越快红包越大！</p>
        </div>
        <span class="red-bag-info-btn" v-if="!loginInfo" @click="clickLoginUser">马上登录</span>
      </div>
    </message-box>
    <!-- 红包雨 -- 抢到红包 -->
    <message-box v-if="redBagShow" type="noneModal" @handleClick="handleRedBagClick">
      <div slot="msgBox" class="red-bag-box get-red-bag">
        <span class="close-btn" @click="handleRedBagClick">
          <i class="iconfont icon-delete"></i>
        </span>
        <div class="red-bag-content">
          <p class="red-bag-title">恭喜您抢到</p>
          <span class="red-bag-money">￥{{redBagResultInfo.amount}}</span>
          <span class="red-bag-detail detail-top">超过了<span style="color: #fff;">{{redBagResultInfo.percent}}%</span>的小伙伴</span>
          <span class="red-bag-detail detail-bottom">已收入钱包，请到个人中心提现</span>
          <span class="red-bag-bank-btn" @click="showRedBagList(redBagResultInfo.red_packet_uuid)">查看红包排行</span>
        </div>
      </div>
    </message-box>
    <!-- 红包雨 -- 未抢到红包 -->
    <message-box v-if="redBagNoneShow" type="noneModal" @handleClick="handleRedBagClick">
      <div slot="msgBox" class="red-bag-box red-bag-top">
        <span class="close-btn" @click="handleRedBagClick">
          <i class="iconfont icon-delete"></i>
        </span>
        <div class="red-bag-result">
          <p class="red-bag-title" v-if="redBagResultInfo.amount">红包排行榜</p>
          <p class="red-bag-title" v-else>天呐，您与红包擦肩而过～</p>
          <div class="top-content">
            <p class="red-bag-title" style="margin-left: 4px;"><i class="iconfont icon-maisuizuo"></i>手气榜 TOP10<i class="iconfont icon-maisuiyou"></i></p>
            <ul class="red-bag-list">
              <li v-if="redBagrecordList.length<=0">
                <span class="none-data">暂无排行</span>
              </li>
              <li v-else
                  v-for="(redBagInfo, idx) in redBagrecordList" :key="idx">
              <span class="head-icon"
                    v-if="!redBagInfo.avatar"></span>
                <span class="head-icon"
                      v-else
                      :style="{backgroundImage: `url(${redBagInfo.avatar})`}"></span>
                <span class="nick-name">{{redBagInfo.nick_name}}</span>
                <span class="red-bag-money fr">￥{{redBagInfo.amount}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </message-box>
    <!--资料下载分享-->
    <div class="share-link" v-if="shareDocShow" @click="shareDocShow=false"></div>
    <!-- 分享tips -->
    <div class="share-link" v-if="shareShow" @click="shareShow=false"></div>
    <!-- 抽奖浏览器分享 -->
    <div class="pc-share-link" :class="{portraitArrow: this.vScreen}" v-if="showLotteruWindowsShow" @click="showLotteruWindowsShow=false"></div>
    <red-bag-rain v-if="showRedBagRain"
                  @endRain="endRainHandler"
                  @selectOk="selectRedBag"></red-bag-rain>
    <mt-popup
      class="control-sheet"
      v-model="showSheetView"
      position="bottom">
      <video-control-sheet
        @closeSheet="showSheetView = false"
        :showSheetView="showSheetView"
        :showResolution="showResolution"
        :showPlaySpeed="showPlaySpeed"
        :showBarrage="showBarrage"/>
    </mt-popup>
    <login-sdk v-if="loginSdk" @complete="initPage"/>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import PlayContent from './play-content' // 内容组件
import VerticlPlayContent from './vertical-play-content' // 内容组件
import * as types from 'src/store/mutation-types'
import EventBus from 'src/utils/eventBus'
import RedBagRain from './red-bag-rain' // 红包雨
import VePagination from 'src/components/ve-pagination'
import { ActivityTool, BusTool, RedBagTool, LocalKey, Lottery } from 'src/utils/ConfigTool'
import videoControlSheet from './video-control-sheet'
import LoginSdk from 'src/components/login-sdk'
export default {
  name: 'watch-main',
  components: { RedBagRain, VePagination, videoControlSheet, LoginSdk },
  data () {
    return {
      isWebp: window.webp,
      MOBILE_HOST: process.env.MOBILE_HOST,
      skType: '', // goods
      activity_id: '',
      playType: '', // 直播(live), 回放(vod), 暖场(warm), 结束(end)，预告(pre)
      vScreen: false, // 是否竖屏直播
      loginSdk: true,
      playStatus: '',
      imgUrl: '',
      currentView: '',
      vhallParams: {
        token: '',
        appId: '',
        channelId: '',
        accountId: ''
      },
      business_user_id: '', // 企业账户id
      shareShow: false,
      wxShare: { // 微信分享数据
        wxShareData: {
          appId: '',
          timestamp: '',
          nonceStr: '',
          signature: ''
        },
        shareData: {
          title: '', // 分享标题
          shareDatadesc: '', // 分享简介
          shareDatalink: '', // 分享链接
          shareDataimgUrl: '' // 分享图片
        }
      },
      isFullScreen: false, // 非x5横屏
      showPersonCount: 0,
      sdkVisitorId: '',
      sdkVisitorName: '',
      logoImg: '',
      red_packet_uuid: '',
      chat_red_packet_uuid: '',
      redBagTipShow: false,
      redBagNoneShow: false,
      redBagShow: false,
      redBagTimeDownShow: false,
      redBagrecordList: [],
      redBagResultInfo: {
        red_packet_uuid: '',
        avatar: '',
        nick_name: '',
        amount: '',
        amount_ranking: '',
        percent: ''
      },
      isiOS: false,
      showRedBagRain: false,
      redBagInfoing: {},
      redBagInfo: {},
      autoTime: 0,
      // rainTime: 0,
      timer: 10,
      timerInterval: 0,
      redBagStartTimer: 0,
      redBagStartTimerInterval: 0,
      isSent: false,
      shareDocShow: false, // 资料下载分享
      showDraw: false, // 显示抽奖等待等弹窗
      showDrawResult: false, // 抽奖结果
      showDrawForm: false, // 中奖信息填报
      showDrawWinnersList: false, // 抽奖中奖人信息
      showDrawFormSuccess: false, // 中奖信息填报成功
      lottery_id: '',
      chat_lottery_id: '',
      drawTime: 0, // 抽奖倒计时
      drawCountTimer: null,
      refreshInviteToLottery: null,
      hasFillOutLotteryForm: false, // 是否提交中奖表单
      lottery_isSend: false, // 是否发送口令
      lottery_isShare: false, // 是否分享
      lottery_isShopping: false, // 是否下单
      showLotteruWindowsShow: false, // 移动端浏览器提示
      lotteryInfo: {
        lottery_type: '', // 参与条件 4->全体观众（无限制），6->填写问卷，8->口令参与，9->分享参与，10->邀请人数，11->下单用户
        lottery_status: 1, // 1 抽奖结束 0 正在抽奖
        extension: '', // 口令 问卷id 邀请人数 根据类型判断
        award_name: '',
        image_url: '', // 奖品封面
        link_url: '', // 奖品链接地址 有连接显示简介
        award_desc: '', // 奖品描述
        invite_number: '', // 邀请人数
        is_address: false,
        icon: '' // 抽奖转盘图片url
      },
      winnerInfo: {
        nickname: '',
        phone: '',
        address: ''
      },
      nameErrorTips: '',
      phoneErrorTips: '',
      isWin: false, // 当期账号是否中奖
      inviteUsers: 0, // 所有被邀请参与抽奖用户信息
      winLotteryLists: {
        data: [],
        page: 1,
        page_size: 10,
        total: 0
      },
      live_delay: 8000,
      showSheetView: false
    }
  },
  filters: {
    fmtTimer (value) {
      let m = ((value / 60 % 60 >> 0) + '').padStart(2, 0)
      let s = ((value % 60 >> 0) + '').padStart(2, 0)
      return `${m}:${s}`
    },
    fmtAwardDesc (value) {
      if (value && value.length > 45) {
        return value.substring(0, 45) + '...'
      } else {
        return value
      }
    },
    ftmExtension (value) {
      if (value && value.length > 4) {
        return value.substring(0, 4) + '...'
      } else {
        return value
      }
    },
    fmtWinnerName (value) {
      if (value && value.length > 4) {
        return value.substring(0, 4) + '...'
      } else {
        return value
      }
    }
  },
  computed: {
    ...mapState('liveMager', {
      activityInfo: state => state.activityInfo,
      joinInfo: state => state.joinInfo,
      roomPaas: state => state.roomPaas,
      downTimer: state => state.downTimer,
      buttonSettings: state => state.buttonSettings,
      barrageSettings: state => state.barrageSettings
    }),
    ...mapState('tokenMager', {
      chatParams: state => state.chatParams
    }),
    ...mapState('login', {
      loginInfo: state => state.loginInfo
    }),
    activityStatus () {
      return this.activityInfo.status_name
    },
    lotteryPic () {
      return this.lotteryInfo.image_url ? `${this.$imgHost}/${this.lotteryInfo.image_url}` : ''
    },
    customLogo () {
      const logo = this.logoImg
      return logo ? `${this.$imgHost}/${logo}?x-oss-process=image/resize,m_lfit,h_100${this.isWebp ? '/format,webp' : ''}` : ''
    },
    shareCondition () {
      let bool = false
      if ((this.lotteryInfo.lottery_type == 9 && !this.lottery_isShare) ||
        (this.lotteryInfo.lottery_type == 8 && !this.lottery_isSend) ||
        (this.lotteryInfo.lottery_type == 10 && this.inviteUsers <= 0) ||
        (this.lotteryInfo.lottery_type == 11 && !this.lottery_isShopping)
      ) {
        bool = false
      } else {
        bool = true
      }
      return bool
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
  beforeDestroy () {
    clearInterval(this.timerInterval)
    clearInterval(this.redBagStartTimerInterval)
    this.clearDrawInfo()
    document.body.removeEventListener('touchmove', this.bodyTouchMove, { passive: false })
  },
  mounted () {
    this.initReady()
  },
  created () {
    this.$i18n.locale = this.$route.query.lang || 'zh_CN'
    this.isIOS()
    this.initEventBus()
  },
  methods: {
    ...mapMutations('tokenMager', {
      setChatParams: types.CHAT_PARAMS
    }),
    ...mapMutations('liveMager', {
      storeActivityInfo: types.ACTIVITY_INFO,
      storeDownTimer: types.DOWN_TIMER,
      storeLotteryDownTimer: types.LOTTERY_DOWN_TIMER,
      storeVisiteInfo: types.VISITE_INFO,
      storeCustomTheme: types.CUSTOM_THEME,
      storeBarrageSettings: types.BARRAGE_SETTINGS,
      storeButtonSettings: types.BUTTON_SETTINGS
    }),
    ...mapMutations('login', {
      storeLoginInfo: types.LOGIN_INFO
    }),
    async initPage (params) {
      window.VHALL_ZK.init({
        app_id: params.app_id,
        activity_id: params.activity_id,
        sign: params.sign,
        account: params.account,
        signed_at: params.signed_at,
        refer: this.$route.query.refer || '', // 非必传, 渠道来源: 0邮件，1微信，2短信
        share_id: this.$route.query.shareId || '' // 非必传, 分享人id
      })
      window.VHALL_ZK.$event.on(window.VHALL_ZK.EVENTS.initReady, () => {
        this.loginSdk = false
        this.sdkInitReady()
      })
      window.VHALL_ZK.$event.on(window.VHALL_ZK.EVENTS.ERROR, (e) => {
        console.error(e)
        if (e.code === 50000) { // 套餐用尽
          if (e.data.can_login === 'N') {
            let type = e.data.package === 'FLOW' ? 'off' : 'over'
            window.location.replace(`${this.MOBILE_HOST}other/${type}`)
          }
        }
      })
      window.VHALL_ZK.$event.on(window.VHALL_ZK.EVENTS.KICK, () => { // 当前用户被踢出
        this.$router.replace('/kicked')
      })
    },
    async sdkInitReady () {
      /* 获取用户详情 */
      let login = window.VHALL_ZK.$api.getUser()
      localStorage.setItem('login', JSON.stringify(login))
      this.storeLoginInfo(login)
      /* 获取用户绑定的游客信息 */
      let visitorInfo = window.VHALL_ZK.$api.visitorInfo()
      this.storeVisiteInfo(visitorInfo)
      /* 监听消息通知 */
      this.initMsgServe()
      /* 获取活动观看页配置 */
      await this.initWatchPageSetting()
      /* 查询活动详情 */
      let activityInfo = window.VHALL_ZK.$api.getActivityInfo()
      activityInfo.status_name = ActivityTool.playStatuTypes[activityInfo.status]
      document.title = activityInfo.title
      this.vScreen = activityInfo.is_portrait === 'Y'
      /* 把活动详情存储到vuex */
      this.storeActivityInfo(activityInfo)
      // 匹配
      this.playType = ActivityTool.playTypes[activityInfo.status]
      // 如果是预告状态
      if (activityInfo.status === 'PREPARE') {
        /* 查询暖场信息 */
        await window.VHALL_ZK.$api.getWarmInfo().then((res) => {
          activityInfo.warm = res.data
          this.storeActivityInfo(activityInfo)
        })
      }
      /* 5, 选择横竖屏模板 */
      if (this.vScreen) {
        this.currentView = VerticlPlayContent
      } else {
        this.currentView = PlayContent
      }
      /* 6, 邀请卡数据上报 */
      let query = this.$route.query
      if (query.log_type === 'card' && query.card_id) {
        window.VHALL_ZK.$api.logInviteCard({
          business_uid: query.business_uid, // b端用户id
          inviter_type: query.inviter_type, // 邀请人类型，1：主办方，2：c端用户
          invitation_card_id: query.card_id, // 邀请卡id
          inviter_id: query.inviter_consumer_id || query.inviter_visitor_id // 邀请人用户id
        }).then((res) => {
          console.log(res)
        })
      }
    },
    initReady () {
      window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', () => {
        if (window.orientation === 90 || window.orientation === -90) { // 横屏
          this.isFullScreen = true
        } else { // 竖屏
          this.isFullScreen = false
        }
      }, false)
      document.body.addEventListener('touchmove', this.bodyTouchMove, { passive: false })
    },
    initWatchPageSetting () {
      /* 获取活动观看页配置 */
      return window.VHALL_ZK.$api.getWatchPageSetting().then((res) => {
        this.logoImg = res.data.logo_url
        this.storeCustomTheme({
          bgImg: res.data.background_url,
          logoImg: res.data.logo_url,
          chatImg: res.data.chat_url
        })
        this.storeButtonSettings({
          showPlaySpeed: res.data.show_play_speed == 1,
          showResolution: res.data.show_video_resolution == 1,
          showInviteCard: res.data.show_invite_card == 1,
          showSubscribe: res.data.show_sub == 1,
          showViewCount: res.data.show_view_count == 1 // 是否显示观看人数1.开启 2.关闭
        })
        this.storeBarrageSettings({
          useBarrage: res.data.video_tip == 1,
          barrageFontSize: res.data.video_tip_size,
          barrageFontColor: res.data.video_tip_color
        })
        return res
      })
    },
    initEventBus () {
      // 显示资料下载提示弹窗
      EventBus.$on('showDocTip', (bool) => {
        this.shareDocShow = bool
      })
      EventBus.$on('loginUser', () => {
        this.doLogin()
      })
      EventBus.$on(BusTool.LIVE_DELAY, (time) => {
        // 直播延迟时间
        this.live_delay = Math.round(time + 3) * 1000
      })
      EventBus.$on('play_back_video_completed', (a) => {
        _log.track(Vhall_User_Actions.LEAVE)
        console.log('回放播放完成了')
      })
      // 更新展示人数
      EventBus.$on('showPersonCount', (num) => {
        this.showPersonCount = num
      })
      EventBus.$on(BusTool.RED_PACKET_PUSH, (msg) => {
        // 防止快速点击导致的问题
        if (this.red_si) return
        this.red_si = setTimeout(() => {
          clearTimeout(this.red_si)
          this.red_si = null
        }, 1000)
        if (this.red_packet_uuid === msg.red_packet_uuid) { // 当前有正在进行的红包
          console.log('push-redBagStartTimer', this.redBagStartTimer)
          if (this.redBagStartTimer > 10) {
            this.redBagTipShow = true
          } else {
            if (this.timer > 0 && this.timer < 10) {
              this.redBagTimeDownShow = true
            } else {
              this.chat_red_packet_uuid = msg.red_packet_uuid
              this.dealWithRedBag(false)
            }
          }
        } else {
          this.chat_red_packet_uuid = msg.red_packet_uuid
          this.dealWithRedBag(false)
        }
      })
      EventBus.$on(BusTool.lottery_send, (msg) => {
        if (this.lotteryInfo.lottery_status == 0) {
          if (this.lotteryInfo.lottery_type == 8 && !this.lottery_isSend) {
            window.VHALL_ZK.$api.unLockLottery({
              lottery_id: this.lottery_id,
              password: msg.password
            }).then((res) => {
              this.lottery_isSend = true
            })
          }
        }
      })
      EventBus.$on(BusTool.LOTTERY_PUSH, (msg) => { // 点击聊天区域抽奖
        // lottery_status: 1 抽奖结束 0 正在抽奖
        if (this.lotteryInfo.lottery_status == 0 && msg.lottery_id == this.lottery_id) {
          this.showDraw = true
          this.showDrawResult = false
          // 11->下单用户
          if (this.lotteryInfo.lottery_type == 11) {
            this.checkIsShopping()
          }
        } else if (this.lotteryInfo.lottery_status == 0 && msg.lottery_id != this.lottery_id) {
          // 获取当前是否中奖
          this.getIsWinLottery(msg.lottery_id)
        } else if (this.lotteryInfo.lottery_status == 1) {
          this.chat_lottery_id = msg.lottery_id
          this.clearDrawInfo()
          // 获取当前是否中奖
          this.getIsWinLottery(msg.lottery_id)
        }
      })
      EventBus.$on(BusTool.red_packet, (data) => {
        /* 解决聊天时频繁调用红包解锁接口
       * 优化后红包解锁逻辑：
       * 1,当前有红包在进行中
       * 2,红包为口令红包
       * 3,聊天内容符合口令内容
       * 4,没有触发过解锁
       * 5,符合上述4个条件之后每次发起红包，解锁接口将只触发一次 */
        if (this.downTimer || this.timer || this.showRedBagRain) { // 当前有红包活动正在进行
          /*
          * this.isSent==false 没有发送过口令
          * 聊天内容符合红包口令
          */
          if (!this.isSent && this.redBagInfo &&
            ~~this.redBagInfo.condition === 2 &&
            this.redBagInfo.password === data.password) {
            window.VHALL_ZK.$api.unLockRedBag({
              red_packet_uuid: this.red_packet_uuid,
              condition: data.condition,
              password: data.password
            }).then(() => {
              this.isSent = true // 已经发送过口令
            })
          }
        }
      })
      EventBus.$on('show_control_sheet', () => {
        this.showSheetView = true
      })
    },
    sendUserShare () {
      window.VHALL_ZK.$api.userShareRecord().then((res) => {
        console.log('用户分享')
      })
    },
    bodyTouchMove (e) {
      let touchDom = e.target
      let nodeName = touchDom.nodeName.toLowerCase()
      let nodeClass = touchDom.getAttribute('class')
      /* 处理小屏幕下拖动视频导致整个页面滚动 */
      if (nodeName === 'video') {
        e.preventDefault()
      }
      /* 阻止视频区域滑动导致整个页面滚动 */
      if (nodeClass && (nodeClass.includes('v-click-modal') || nodeClass.includes('image-bg'))) {
        e.preventDefault()
      }
    },
    isIOS () {
      let u = navigator.userAgent
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      this.isiOS = isiOS
    },
    isWx () {
      var ua = navigator.userAgent.toLowerCase()
      var isWeixin = ua.indexOf('micromessenger') !== -1
      if (isWeixin) {
        return true
      }
      return false
    },
    isQQ () {
      var ua = navigator.userAgent.toLowerCase()
      if (ua.indexOf('qq') >= 0) {
        return true
      }
      return false
    },
    initMsgServe () {
      /* 监听直播结束 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.FINISH_LIVE, () => {
        let st = setTimeout(() => {
          clearTimeout(st)
          this.addEventLiveEnd()
        }, 10000)
      })
      /* 监听红包，抽奖通知消息 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.MARKET_TOOL, (msg) => {
        let sTime = setTimeout(() => {
          clearTimeout(sTime)
          this.delayMarketTool(msg)
        }, this.live_delay)
      })
      this.initRedBagInfo()
      this.initLotteryInfo()
      this.checkIsShopping()
    },
    delayMarketTool (msg) {
      switch (msg.type) {
        case RedBagTool.createRedBag:
          console.log('--创建红包--消息--')
          this.stopRedBag()
          this.autoTime = msg.time ? parseFloat(msg.time) : 0
          this.red_packet_uuid = msg.red_packet_uuid
          this.$get(msg.url).then((data) => {
            this.dealWithRedBag(true, data)
          })
          break
        case Lottery.createLottery:
          console.log('--创建抽奖--消息--')
          this.clearDrawInfo()
          // 获取当前抽奖信息
          this.$get(msg.url).then((data) => {
            this.dealWithLottery(data)
          })
          break
        case Lottery.endLottery:
          console.log('--抽奖结束--消息--')
          this.clearDrawInfo()
          // 获取当前是否中奖
          this.getIsWinLottery(msg.lottery_id)
          break
      }
    },
    addEventLiveEnd () { // 直播结束
      // 停止红包
      this.stopRedBag()
      this.clearDrawInfo()
      this.$messageBox({
        header: '当前直播已结束',
        type: 'single',
        content: '',
        cancelText: '',
        confirmText: '确定'
      })
    },
    immInputQuestions () { // 填写问卷
      this.handleRedBagClick()
      EventBus.$emit(BusTool.showQuestion)
    },
    sendPassword (arg) { // 发送口令
      if (arg) return
      this.redBagTipShow = false
      EventBus.$emit(BusTool.sendPassword, this.redBagInfo.password)
      this.isSent = true
    },
    immShare () {
      this.shareShow = true
      this.handleRedBagClick()
      this.sendUserShare()
    },
    handleRedBagClick (e) {
      this.redBagTipShow = false
      this.redBagTimeDownShow = false
      this.redBagShow = false
      this.redBagNoneShow = false
      this.redBagrecordList = []
      this.redBagInfo = { ...this.redBagInfoing }
    },
    selectRedBag (count) { // 选中红包雨红包
      if (this.red_packet_uuid && count === 1) {
        this.joinRedBag()
      }
    },
    /* 抢红包接口 */
    joinRedBag () {
      window.VHALL_ZK.$api.grabRedBag(this.red_packet_uuid).then((res) => {
        this.redBagResultInfo = res.data
        this.redBagResultInfo.red_packet_uuid = this.red_packet_uuid
      }).catch((e) => {
        console.warn(e)
      })
    },
    /* 红包雨结束 */
    async endRainHandler (count) {
      console.log('----endRainHandler----')
      this.showRedBagRain = false
      /* 延迟1.5秒，防止红包接口过慢导致问题 */
      let s = setTimeout(() => {
        clearTimeout(s)
        if (count) {
          if (this.redBagResultInfo && this.redBagResultInfo.amount) {
            // 抢到红包
            this.redBagShow = true
          } else {
            window.VHALL_ZK.$api.grabRedBag(this.red_packet_uuid).then((res) => {
              if (res.data && res.data.amount) {
                // 抢到红包
                this.redBagShow = true
                this.redBagResultInfo = res.data
                this.redBagResultInfo.red_packet_uuid = this.red_packet_uuid
              } else {
                // 没有抢到红包
                // 延迟1秒执行，保证本次红包活动已经结束
                let st = setTimeout(() => {
                  clearTimeout(st)
                  this.queryRedBagrecordList(true)
                }, 1000)
              }
            }).catch(() => {
              // 延迟1秒执行，保证本次红包活动已经结束
              let st = setTimeout(() => {
                clearTimeout(st)
                this.queryRedBagrecordList(true)
              }, 1000)
            })
          }
        } else {
          let st = setTimeout(() => {
            clearTimeout(st)
            this.queryRedBagrecordList(true)
          }, 1000)
        }
      }, 1500)
    },
    /* 我抢红包结果信息 */
    redBagRecord (id) {
      let uuid = id || this.red_packet_uuid
      return window.VHALL_ZK.$api.getRedBagRecord(uuid).then(res => {
        if (res.data && res.data.amount) {
          this.redBagShow = true
          this.redBagResultInfo = res.data
          this.redBagResultInfo.red_packet_uuid = uuid
        } else {
          this.queryRedBagrecordList(false)
        }
      })
    },
    showRedBagList (uuid) {
      this.redBagShow = false
      this.getRedBagList(uuid)
    },
    queryRedBagrecordList (immediately) {
      let uuid = immediately ? this.red_packet_uuid : this.chat_red_packet_uuid
      this.getRedBagList(uuid)
    },
    getRedBagList (uuid) {
      if (!uuid) return
      window.VHALL_ZK.$api.getRedBagList(uuid).then(res => {
        this.redBagNoneShow = true
        this.redBagrecordList = res.data.list.map(item => {
          if (item.avatar && item.avatar.indexOf('http') !== 0) {
            item.avatar = `${this.$imgHost}/${item.avatar}?x-oss-process=image/resize,m_lfit,w_100${this.isWebp ? '/format,webp' : ''}`
          }
          return item
        })
      })
    },
    /* 停止红包操作 */
    stopRedBag () {
      clearInterval(this.timerInterval)
      clearInterval(this.redBagStartTimerInterval)
      this.timerInterval = 0
      this.redBagStartTimerInterval = 0
      this.redBagTimeDownShow = false
      this.redBagTipShow = false
      this.redBagResultInfo = {
        red_packet_uuid: '',
        avatar: '',
        nick_name: '',
        amount: '',
        amount_ranking: '',
        percent: ''
      }
      this.timer = 0
      this.redBagStartTimer = 0
      this.storeDownTimer(0)
      EventBus.$emit(BusTool.PUSH_TOOL_ICON, {
        name: '红包雨',
        type: 'red_packet',
        toolType: 'remove'
      })
      // this.rainTime = 0
      this.autoTime = 0
      this.handleRedBagClick()
    },
    /* 刷新页面或者后进入时 */
    initRedBagInfo () {
      window.VHALL_ZK.$api.getNowRedBagInfo().then((res) => {
        if (res.data) {
          this.red_packet_uuid = res.data.red_packet_uuid
          this.redBagInfo = { condition: res.data.condition, password: res.data.password, ext: res.data.ext }
          this.redBagInfoing = { ...this.redBagInfo }
          if (res.data.time) {
            // 减去1秒纠正查询接口时间误差
            this.autoTime = (res.data.time - 1) / 60
            this.initRedBagDownTimer()
          } else if (res.data.valid_time) {
            if (res.data.valid_time > 20) {
              this.redBagTimeDownShow = true
              this.initRedBayRainTimer(res.data.valid_time - 20)
            } else {
              this.queryRedBagrecordList(true)
            }
          }
        }
      })
    },
    dealWithRedBag (immediately, data) {
      if (data) {
        this.dealWithRedBagData(immediately, data)
      } else {
        let uuid = immediately ? this.red_packet_uuid : this.chat_red_packet_uuid
        return window.VHALL_ZK.$api.getRedBagInfo(uuid).then(res => {
          this.dealWithRedBagData(immediately, res.data)
        })
      }
    },
    dealWithRedBagData (immediately, data) {
      this.redBagInfo = { condition: data.condition, password: data.password, ext: data.ext }
      if (immediately) {
        // 临时存放，解决点击聊天区域和正在进行红包互串
        this.redBagInfoing = { ...this.redBagInfo }
        this.initRedBagDownTimer()
      } else {
        if (data.valid_time) {
          if (data.valid_time > 60) { // 大于60秒显示倒计时
            this.autoTime = (data.time - 1) / 60
            this.initRedBagDownTimer()
          } else if (data.valid_time > 20) { // 大于20秒进行10秒倒计时
            this.autoTime = 0
            this.initRedBagDownTimer()
          } else {
            this.redBagRecord(data.red_packet_uuid)
          }
        }
      }
    },
    initRedBagDownTimer () {
      console.log('----initRedBagDownTimer----:1')
      if (this.autoTime === 0) { // 立即开始
        this.redBagTimeDownShow = true
        this.initRedBayRainTimer(10)
      } else {
        console.log('----initRedBagDownTimer----:2')
        // 红包雨活动已推送,倒计时
        this.redBagTipShow = true
        this.isSent = false
        this.redBagStartTimer = Math.round(this.autoTime * 60)
        if (this.redBagStartTimerInterval) return
        console.log('----initRedBagDownTimer----:3')
        this.redBagStartTimerInterval = setInterval(() => {
          this.storeDownTimer(this.redBagStartTimer)
          if (this.redBagStartTimer === 10) {
            console.log('----initRedBagDownTimer----:4')
            clearInterval(this.redBagStartTimerInterval)
            this.redBagStartTimerInterval = null
            this.redBagStartTimer = 0
            this.storeDownTimer(0)
            this.redBagTipShow = false
            // 10秒倒计时
            this.redBagTimeDownShow = true
            this.initRedBayRainTimer(10)
            return
          }
          this.redBagStartTimer = this.redBagStartTimer - 1
          if (this.redBagStartTimer < 0) {
            clearInterval(this.redBagStartTimerInterval)
            this.redBagStartTimerInterval = null
          }
        }, 1000)
      }
    },
    /* 控制红包雨倒计时 */
    initRedBayRainTimer (time) {
      this.timer = time
      if (this.timerInterval) return
      this.timerInterval = setInterval(() => {
        if (this.timer === 0) {
          clearInterval(this.timerInterval)
          this.timerInterval = null
          this.redBagTimeDownShow = false
          // this.rainTime = 10
          this.showRedBagRain = true
          return
        }
        this.timer--
      }, 1000)
    },
    showDownTip () {
      if (this.redBagStartTimer > 10) {
        this.redBagTipShow = true
      }
    },
    showLotteryDownTip () {
      if (this.drawTime > 0) {
        this.checkIsShopping()
        this.showDraw = true
        this.showDrawResult = false
      }
    },
    PlaybackVideo () {
      EventBus.$on('play_back_video_completed', (a) => {
        _log.track(Vhall_User_Actions.LEAVE)
        console.log('回放播放完成了')
      })
    },
    clickLoginUser () {
      this.redBagTipShow = false
      this.doLogin()
    },
    // 获取当期抽奖信息
    initLotteryInfo (id = '') {
      window.VHALL_ZK.$api.getLotteryInfo(id).then(res => {
        if (res.data) {
          this.dealWidthLotteryData(res.data)
          // 判断是否分享过抽奖
          if (res.data.lottery_type == 9) {
            this.checkIsShare()
          }
        }
      })
    },
    /***
     * 处理当前抽奖信息
     * @params: immediately true 主持人操作 false 聊天区点击操作
     * @params: data 抽奖信息
    */
    dealWithLottery (data) {
      if (data) {
        this.dealWidthLotteryData(data)
      } else {
        return window.VHALL_ZK.$api.getLotteryInfo().then(res => {
          if (res.data) {
            this.dealWidthLotteryData(res.data)
          }
        })
      }
    },
    dealWidthLotteryData (data) {
      if (!data) return
      this.lottery_id = data.id
      this.drawTime = data.left_seconds ? parseInt(data.left_seconds) : 0 // 距离开始抽奖剩余时间
      this.lotteryInfo = {
        lottery_type: data.lottery_type,
        lottery_status: data.lottery_status == 0 ? data.lottery_status : 1,
        extension: data.extension, // 口令 问卷id 邀请人数 根据类型判断
        award_name: data.award_snapshoot.award_name,
        image_url: data.award_snapshoot.image_url, // 奖品封面
        link_url: data.award_snapshoot.link_url, // 奖品链接地址
        award_desc: data.award_snapshoot.award_desc, // 奖品描述
        invite_number: data.invite_number,
        lotteryCount: data.lottery_users ? data.lottery_users.length : 0,
        is_address: data.write_address === 'Y', // 是否填写领奖信息: Y=>是，N=>否
        icon: data.icon // 抽奖转盘图片url
      }
      if (this.lotteryInfo.lottery_status == 0) { // 抽奖中
        this.initLotteryTimer()
      }
    },
    // 设置抽奖时间
    initLotteryTimer () {
      if (this.lotteryInfo.lottery_status == 0) {
        this.showDraw = true
        this.showDrawResult = false
        if (this.drawTime > 0) { // 抽奖倒计时
          this.lotteryDownTime()
        }
      } else if (this.lotteryInfo.lottery_status == 1) { // 抽奖结束
        this.clearDrawInfo()
      }
    },
    // 抽奖倒计时计时器
    lotteryDownTime () {
      if (this.drawCountTimer) clearInterval(this.drawCountTimer)
      EventBus.$emit(BusTool.PUSH_TOOL_ICON, {
        name: '抽奖',
        type: 'lottery',
        toolType: 'add'
      })
      this.drawCountTimer = setInterval(() => {
        if (this.drawTime == 0) {
          clearInterval(this.drawCountTimer)
          this.storeLotteryDownTimer(0)
          EventBus.$emit(BusTool.PUSH_TOOL_ICON, {
            name: '抽奖',
            type: 'lottery',
            toolType: 'remove'
          })
          return
        }
        this.drawTime--
        this.storeLotteryDownTimer(this.drawTime)
      }, 1000)
    },
    // 判断当前是否中奖
    async getIsWinLottery (id) {
      // 1 抽奖结束 0 正在抽奖
      if (this.lotteryInfo.lottery_status == 1) {
        await this.initLotteryInfo(id)
      }
      if (!(this.loginInfo && this.loginInfo.consumer_user_id)) { // 未登录
        this.clearDrawInfo()
        this.showDrawResult = true
        this.isWin = false
        return
      }
      await this.getIsReceiveAward(id)
      await window.VHALL_ZK.$api.checkIsLottery(id).then((res) => {
        // 判断是否有提交过表单
        this.showDraw = false
        if (res.data) { // 中奖
          this.showDrawResult = true
          this.isWin = true
        } else { // 未中奖
          this.showDrawResult = true
          this.isWin = false
        }
      }).catch((e) => {
        this.showDraw = false
      })
    },
    // 判断当前用户是否领奖
    getIsReceiveAward(id) {
      // 判断是否中奖
      // 未中奖显示未中页面 并 可查看列表。
      // 中奖用户 请求接口判断是否领奖
      // 未领奖 显示领奖操作
      // 领奖 显示中奖列表
      window.VHALL_ZK.$api.checkLotteryAddress(id).then((res) => {
        if (res.data) { // 提交
          this.hasFillOutLotteryForm = true
        } else {
          this.hasFillOutLotteryForm = false
        }
      })
    },
    // 检查是否下过单
    checkIsShopping () {
      window.VHALL_ZK.$api.checkHasOrder().then((res) => {
        if (res.data) {
          this.lottery_isShopping = true
        } else {
          this.lottery_isShopping = false
        }
      })
    },
    checkFormContent () {
      if (!this.winnerInfo.nickname) {
        this.nameErrorTips = '联系人不能为空'
        return false
      }
      if (!this.winnerInfo.phone) {
        this.phoneErrorTips = '手机号不能为空'
        return false
      }
      let PHONE_RegExp = /^([0-9-]+)$/
      if (!PHONE_RegExp.test(this.winnerInfo.phone)) {
        this.phoneErrorTips = '手机号格式不正确'
        return
      }
      return true
    },
    // 提交中奖表单
    handleUploadForm () {
      if (!this.checkFormContent()) return
      localStorage.setItem(LocalKey.WINNER_INFO, JSON.stringify(this.winnerInfo))
      window.VHALL_ZK.$api.submitLotteryAddress({
        lottery_id: this.lottery_id,
        name: this.winnerInfo.nickname,
        phone: this.winnerInfo.phone,
        address: this.winnerInfo.address
      }).then((res) => {
        this.showDrawForm = false
        this.showDrawResult = false
        this.showDrawFormSuccess = true
      })
    },
    // 获取所有被邀请抽奖人
    queryInviteToLotteryUsers () {
      if (this.refreshInviteToLottery) clearTimeout(this.refreshInviteToLottery)
      this.refreshInviteToLottery = setTimeout(() => {
        window.VHALL_ZK.$api.getAllInviteLotteryUsers({
          activity_id: this.activity_id
        }).then((res) => {
          this.inviteUsers = res.data ? res.data.inviter_count : 0
        })
      }, 500)
    },
    inputDrawForm () {
      this.showDrawForm = true
      let info = localStorage.getItem(LocalKey.WINNER_INFO)
      if (info) {
        this.winnerInfo = JSON.parse(info)
      }
    },
    // 获取中奖列表
    handleShowWinsList () {
      window.VHALL_ZK.$api.getWinLotteryList({
        lottery_id: this.lottery_id ? this.lottery_id : this.chat_lottery_id,
        page: this.winLotteryLists.page,
        page_size: 10
      }).then((res) => {
        res.data.list = res.data.list || []
        this.winLotteryLists.data = res.data.list.map((item) => {
          item.logo = item.lottery_user_avatar ? `${this.$imgHost}/${item.lottery_user_avatar}` : ''
          return item
        })
        this.winLotteryLists.page = res.data.page
        this.winLotteryLists.page_size = res.data.page_size
        this.winLotteryLists.total = res.data.total
        this.showDrawFormSuccess = false
        this.showDrawResult = false
        this.showDrawWinnersList = true
      }).catch((e) => {
        this.showDrawFormSuccess = false
        this.showDrawResult = false
      })
    },
    handleDrawForm (e) {
      this.showDrawForm = false
      this.nameErrorTips = ''
      this.phoneErrorTips = ''
    },
    // 抽奖分享
    lotteryShare () {
      if (this.isWx()) {
        this.shareShow = true
      } else {
        this.showLotteruWindowsShow = true
      }
      this.showDraw = false
      window.VHALL_ZK.$api.userShareRecord().then((res) => {
        this.lottery_isShare = true
      })
    },
    // 检查是否分享过抽奖
    checkIsShare () {
      window.VHALL_ZK.$api.getShareCount().then((res) => {
        if (res.data > 0) {
          this.lottery_isShare = true
        } else {
          this.lottery_isShare = false
        }
      })
    },
    // 发送口令
    lotterySendChat () {
      if (this.lottery_isSend) return
      this.showDraw = false
      EventBus.$emit(BusTool.sendLotteryPassword, this.lotteryInfo.extension)
      this.lottery_isSend = true
    },
    // 抽奖填写问卷
    handleFillQuestion () {
      this.showDraw = false
      EventBus.$emit(BusTool.showQuestion, this.lotteryInfo.extension)
    },
    // 立即下单
    goShopping () {
      this.showDraw = false
      this.$refs.playContents.showGoodList()
    },
    clearDrawInfo () {
      this.drawTime = 0
      this.storeLotteryDownTimer(0)
      EventBus.$emit(BusTool.PUSH_TOOL_ICON, {
        name: '抽奖',
        type: 'lottery',
        toolType: 'remove'
      })
      this.lottery_isSend = false
      this.lottery_isShare = false
      this.lottery_isShopping = false
      this.showDraw = false
      this.showDrawResult = false
      this.showDrawForm = false
      this.showDrawWinnersList = false
      this.showDrawFormSuccess = false
      this.hasFillOutLotteryForm = false
      this.showLotteruWindowsShow = false
      this.shareShow = false
      this.isWin = false
      this.inviteUsers = 0
      this.winLotteryLists = {
        data: [],
        page: 1,
        page_size: 10,
        total: 0
      }
      this.winnerInfo = {
        nickname: '',
        phone: '',
        address: ''
      }
      this.lotteryInfo.lottery_status = 1
      clearInterval(this.drawCountTimer)
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'assets/css/mixin.scss';
.watch-warp {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  &.full-screen /deep/{
    .play-video{
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
    .w-header {
      display: none;
    }
  }
  &.vertical-screen /deep/{
    position: relative;
    display: block;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: rgba(0, 0 ,0 , .3);
    .w-header{
      position: fixed;
      top: 30px;
      left: 0;
      padding: 0 24px;
      background-color: transparent;
      color: #eee;
      z-index: 22;
      &:after, .w-status {
        display: none;
      }
      .header-logo{
        height: 72px;
        line-height: 72px;
        border-radius: 50px;
        padding: 0 30px 0 10px;
        background-color: rgba(0, 0, 0, .3);
        font-family: sans-serif;
        opacity: .8;
        .img-box {
          display: inline-block;
          height: 60px;
          width: 60px;
          margin-top: 6px;
          line-height: 60px;
          border-radius: 50%;
          background-color: #fff;
          text-align: center;
          vertical-align: top;
          overflow: hidden;
        }
        img {
          display: inline-block;
          margin: 0;
          max-height: 60px;
          max-width: 60px;
          background-color: #fff;
          vertical-align: middle;
        }
        .logo-info {
          display: inline-block;
          margin-top: 6px;
          margin-left: 4px;
          vertical-align: top;
          color: #fff;
          span {
            display: block;
            height: 30px;
            line-height: 30px;
            &:nth-child(1) {
              max-width: 300px;
              font-size: 24px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            &:nth-child(1) {
              font-size: 20px;
            }
          }
        }
      }
      .w-header-right {
        a {
          display: inline-block;
          width: 60px;
          height: 60px;
          line-height: 64px;
          border-radius: 50%;
          text-align: center;
          background-color: rgba(0, 0, 0, .3);
          opacity: .8;
        }
      }
    }
    .com-dialog .dialog-wrap {
      position: fixed;
    }
    .w-main-content{
      flex: none;
      width: 100%;
      height: 100%;
    }
  }
  .w-main-content{
    width: 100%;
    height: calc(100% - 100px);
  }
  .w-header{
    width: 100%;
    height: 100px;
    background-color: #fff;
    padding: 0 38px;
    font-size: 24px;
    overflow: hidden;
    @include border-1px(#d4d4d4, bottom);
    &:after{
      transform: translateY(.7px);
    }
    .header-logo{
      display: inline-block;
      position: relative;
      height: 100%;
      min-width: 20px;
      max-width: 500px;
      margin-right: 20px;
      vertical-align: middle;
      background-color: rgba(255, 255, 255, .5);
      img{
        max-height: 50px;
        margin-top: 25px;
      }
    }
    .w-status{
      position: relative;
      display: inline-block;
      top: 2px;
      height: 36px;
      line-height: 36px;
      color: #fff;
      text-align: center;
      background-color: rgba(10, 10, 10, 0.8);
      border-radius: 50px;
      padding: 0 14px;
      margin-right: 10px;
      font-size: 20px;
      vertical-align: middle;
      font-family: "宋体";
      i {
        position: relative;
        display: inline-block;
        width: 10px;
        height: 10px;
        background-color: #fc5659;
        border-radius: 50%;
        margin-right: 6px;
        margin-top: -4px;
        vertical-align: middle;
      }
    }
    .w-header-right{
      display: inline-block;
      float: right;
      line-height: 100px;
      font-size: 0;
      a {
        margin-right: 24px;
        &:last-child {
          margin-right: 0px;
        }
      }
      .iconfont{
        font-size: 40px;
      }
    }
  }
  /deep/ {
    .login-container {
      .com-dialog {
        position: absolute;
        .dialog-wrap {
          top: 52%;
        }
      }
    }
    .vjs-loading-spinner {
      top: 48%;
    }
    .ve-message-box {
      &::before {
        height: 0;
      }
      .v-logo {
        display: block;
        width: 130px;
        height: 130px;
        margin: 40px auto 0;
      }
      .v-success {
        display: block;
        width: 288px;
        margin: 80px auto 0;
      }
      .v-title {
        text-align: center;
        word-break: break-all;
        font-size: 32px;
        color: #222;
        margin-top: 8px;
        &.v-success-title {
          margin-bottom: 140px;
        }
      }
      .v-from {
        margin: 60px 15px 50px;
        .v-explain {
          text-align: left;
          word-break: break-all;
          font-size: 24px;
          color: #555;
          margin-bottom: 20px;
        }
        .com-input {
          input {
            height: 70px;
            line-height: 70px;
          }
          .limit {
            display: none;
          }
        }
      }
      .ve-message-box__btns {
        margin: 0 auto;
        text-align: center;
        width: 80%;
        .button--primary {
          margin: 0 auto;
          display: block;
          width: 528px;
          width: 100%;
          height: 94px;
          line-height: normal;
          border-radius: 8px;
          font-size: 28px;
        }
      }
    }
    .custom-box {
      margin-top: -30px;
      padding-bottom: 60px;
    }
  }
  .pc-share-link {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.8);
    z-index: 3000;
    &:after{
      content: '';
      position:absolute;
      bottom: 80px;
      left: 70%;
      transform: translateX(-50%);
      display: block;
      width: 255px;
      height: 252px;
      background-image: url('~assets/image/pc-arrow-down.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
  .portraitArrow {
    &:after{
      bottom: 280px;
    }
  }
  .share-link{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.8);
    z-index: 3000;
    &:after{
      float: right;
      content: '';
      display: block;
      width: 255px;
      height: 252px;
      margin-top: 60px;
      margin-right: 90px;
      background-image: url('~assets/image/share-line.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
  .red-bag-box {
    position: relative;
    width: 100vw;
    height: 130vw;
    /*background-image: url('~assets/image/red-bag-bg@2x.png');*/
    @include webpbg('~assets/image/red-bag-bg@2x.png');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    color: #ffd021;
    .close-btn {
      display: block;
      position: absolute;
      width: 52px;
      height: 52px;
      left: 50%;
      margin-left: -26px;
      bottom: -20px;
      text-align: center;
      &:hover {
        cursor: pointer;
        opacity: 0.8;
      }
      .icon-delete {
        font-size: 54px;
        color: #fff;
      }
      .icon-close {
        font-size: 30px;
        font-weight: 900;
        color: #fff;
        line-height: 30px;
      }
    }
    .red-bag-content {
      position: absolute;
      top: 52%;
      left: 50.6%;
      width: 70vw;
      margin-left: -35vw;
      padding: 0 20px;
    }
    .red-bag-info-btn {
      display: block;
      position: absolute;
      left: 184px;
      bottom: 120px;
      width: 390px;
      height: 70px;
      line-height: 70px;
      border-radius: 34px;
      text-align: center;
      background-color: $color-default;
      color: #333;
      font-family: '宋体';
      opacity: 0.9;
      &:hover {
        cursor: pointer;
        background-color: $color-default-hover;
      }
      &.isSent {
        background: rgba(238, 238, 238, 0.8);
        &:hover {
          cursor: default;
          background: rgba(238, 238, 238, 0.8);
        }
      }
    }
    .red-bag-content-mid {
      top: 60%;
    }
    &.get-red-bag {
      /*background-image: url('~assets/image/red-bag-bg-success@2x.png');*/
      @include webpbg('~assets/image/red-bag-bg-success@2x.png');
      background-size: contain;
      background-repeat: no-repeat;
      .red-bag-content {
        top: 30%;
      }
      .red-bag-title {
        font-size: 6vw;
        line-height: 10vw;
        color: #ba5003;
      }

      .red-bag-money {
        font-size: 52px;
        color: #ec0827;
        padding-right: 20px;
      }
      .detail-top {
        margin-top: 220px;
        font-size: 48px;
      }
      .detail-bottom {
        margin-top: 40px;
        font-size: 28px;
      }
    }

    &.red-bag-top {
      width: 80vw;
      height: auto;
      margin-bottom: -2px;
      color: #333;
      border-radius: 10px;
      padding-bottom: 50px;
      background-image: none;
      .red-bag-result {
        width: 100%;
        padding: 30px;
        border-radius: 10px;
        background-color: #ec0627;
        background: linear-gradient(#ff6700, #fe0025);
      }
      .red-bag-title {
        font-size: 28px;
        line-height: 10vw;
        color: #fff;
      }
      .icon-close {
        font-size: 34px;
        font-weight: 900;
        float: right;
      }
      .top-content {
        background-color: #fff;
        border-radius: 10px;
        margin-bottom: 4px;
        .red-bag-title {
          color: #4b5afe;
          font-size: 28px;
        }
      }
    }
    .red-bag-title {
      font-size: 6vw;
      line-height: 10vw;
      color: #ffd021;
    }
    .red-bag-info {
      font-size: 28px;
      &.tip-info {
        background-color: #d90b25;
        padding: 20px;
        margin: 3.6vw 0;
        border-radius: 8px;
        color: #fff;
        opacity: 0.8;
        font-size: 28px;
        height: 34vw;
        width: 65vw;
      }
      .login-link {
        color: #fff;
        &:hover {
          cursor: pointer;
          text-decoration: underline;
          transition: color 0.2s;
        }
      }
    }

    .red-bag-tip {
      display: inline-block;
      color: #fff;
      font-size: 30px;
      line-height: 30px;
      margin-top: 40px;
    }

    .time-down {
      display: inline-block;
      margin: 10px 0 66px -6px;
      font-size: 72px;
      color: #fff;
      text-align: center;
    }
    .red-bag-money {
      color: $color-red;
      font-size: 30px;
      line-height: 50px;
    }
    .red-bag-bank-btn {
      display: block;
      height: 60px;
      width: 240px;
      line-height: 58px;
      margin: 60px auto 0 auto;
      background-color: $color-default;
      color: #333;
      font-size: 28px;
      border-radius: 30px;
      font-family: '宋体';
      user-select: none;
    }
    .red-bag-detail {
      display: block;
      font-size: 28px;
      line-height: 30px;
    }
    .red-bag-list {
      list-style: none;
      user-select: none;
      max-height: 44vh;
      overflow-y: auto;
      li {
        position: relative;
        width: 100%;
        padding: 20px;
        text-align: left;
        &:after{
          content: '';
          display: block;
          position: relative;
          bottom: -20px;
          width: 200%;
          height: 1px;
          border-bottom: 1px solid #d9d9d9;
          border-radius: 6px;
          transform: scale(0.5);
          transform-origin: 0 0;
          pointer-events: none;
          z-index: 2;
        }
        &:last-child{
          padding-bottom: 30px;
          &:after {
            display: none;
          }
        }
        .head-icon {
          display: inline-block;
          width: 90px;
          height: 90px;
          line-height: 90px;
          border-radius: 50%;
          margin-right: 16px;
          border: solid 1px $color-bd;
          text-align: center;
          vertical-align: middle;
          background-image: url('~assets/image/avatar@2x.png');
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
        }
        .nick-name {
          display: inline-block;
          max-width: 230px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 90px;
          vertical-align: middle;
          font-size: 28px;
        }
        .red-bag-money {
          font-size: 28px;
          line-height: 90px;
        }
      }
    }
    .none-data {
      display: block;
      width: 100%;
      line-height: 50px;
      text-align: center;
      color: #888;
      font-size: 28px;
      margin-bottom: 20px;
      &:before{
        content: '';
        display: block;
        width: 200px;
        height: 200px;
        margin: 10px auto;
        background-image: url("~assets/image/red-bag-none-data.png");
        background-size: cover;
      }
    }
  }
  .draw-wrap, .draw-form-wrap, .draw-success-wrap, .draw-form-wrap-success, .draw-success-list {
    &.ve-message-box__wrapper /deep/ {
      text-align: left;
      .ve-message-box{
        overflow: visible;
      }
    }
  }
  .draw-box, .draw-form-box, .draw-success-box, .draw-form-success-box, .draw-win-list {
    position: relative;
    width: 580px;
    min-height: 200px;
    background:#fff;
    box-sizing: border-box;
    padding: 94px 44px 40px 44px;
    border-radius:24px;
    .close-btn {
      display: block;
      position: absolute;
      width: 52px;
      height: 52px;
      left: 50%;
      margin-left: -26px;
      bottom: -80px;
      text-align: center;
      &:hover {
        cursor: pointer;
        opacity: 0.8;
      }
      .icon-delete {
        font-size: 54px;
        color: #fff;
      }
      .icon-close {
        font-size: 30px;
        font-weight: 900;
        color: #fff;
        line-height: 30px;
      }
    }
    .draw-pic{
      position:absolute;
      top: -70px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
      width: 140px;
      height: 140px;
      border-radius: 75px;
      border: 10px solid #fff;
      overflow: hidden;
      & > img {
        display:block;
        width: 100%;
        height: 100%;
        border-radius: 75px;
        background: #fff;
      }
    }
    .award-info{
      width: 100%;
      text-align: center;
      margin-bottom: 30px;
      .award-name{
        font-size: 32px;
        color: #222222;
        line-height: 40px;
      }
      .award-des {
        font-size: 26px;
        color: #555555;
        line-height: 40px;
        word-break: break-all;
        a{
          color: #4a5bfe;
        }
      }
    }
    .lottery-animation-pic{
      width: 380px;
      height: 302px;
      /*background: url('~assets/image/lottery-animation.gif');*/
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      margin: 0px auto;
      margin-bottom: 32px;
    }
    .draw-tip-txt{
      text-align: center;
      font-size: 32px;
      line-height: 40px;
      .drawing, .draw-down, .send-extension{
        color: #FF5659;
      }
      .refresh-invite-number{
        color: #4a5bfe;
        font-size: 24px;
        line-height: 40px;
        width: 100%;
        text-align: center;
        margin-bottom: -4px;
      }
      .send-extension {
        font-size: 30px;
      }
      .no-invite {
        display: block;
        margin-top: 20px;
      }
      .invite-tip {
        font-size: 24px;
      }
      .invite-users-list{
        margin-top: 10px;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 72px;
        justify-content: space-around;
        font-size: 16px;
      }
      .primary-button {
        &.send-extension-btn, &.share-btn, &.fill-question{
          margin-top: 50px;
        }
        &.invite-btn{
          margin-top: 30px;
        }
      }
      .not-out-link{
        color: #4a5bfe;
        font-size: 14px;
        width: 100%;
        text-align: center;
        margin-top: 10px;
        &:hover {
          cursor:pointer;
        }
      }
    }
    .form-tip {
      display: block;
      width: 100%;
      text-align: left;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .form-box-warp {
      max-height: 40vh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .form-box {
      margin-bottom: 28px;
    }
    .draw-animation-pic{
      width: 380px;
      height: 302px;
      margin: 50px auto 30px auto;
    }
    .primary-button{
      width: 100%;
      height: 90px;
      border-radius: 45px;
      font-size: 34px;
      color: #222222;
    }
  }
  .draw-form-box {
    .form-box{
      .form-label {
        font-size: 28px;
        color: #222222;
        height: 40px;
        margin-bottom: 16px;
        .red-star{
          margin-right: 5px;
          color:red;
        }
      }
      .form-content{
        min-height: 100px;
        .com-input /deep/ {
          input{
            border: 1px solid #C2C2C2!important;
            border-radius: 8px;
          }
          #textarea {
            height: 156px;
            border: 1px solid #C2C2C2;
            border-radius: 8px;
          }
        }
      }
    }
    .form-box:last-child{
      margin-bottom: 30px;
    }
  }
  .draw-success-box{
    .not-win-test, .win-test{
      display: block;
      font-size: 36px;
      color: #FC5659;
      line-height: 48px;
      text-align: center;
    }
    .not-win-test {
      color: #555;
      &:last-child{
        margin-bottom: 20px;
      }
    }
    .award-pic{
      width: 140px;
      height: 140px;
      margin: 50px auto 24px auto;
      background: #fff;
      overflow: hidden;
      border-radius: 75px!important;
      & > img{
        display: block;
        width: 140px;
        height: 140px;
        border-radius: 75px;
      }
    }
    .award-info {
      text-align: center;
      .award-name {
        font-size: 32px;
        margin-bottom: 24px;
      }
      .award-des {
        margin-bottom: 0px;
      }
    }
    .primary-button {
      margin-top: 50px;
    }
  }
  .draw-form-success-box{
    .pic{
      width: 238px;
      height: 166px;
      background-image: url('~assets/image/success@2x.png');
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      margin: 60px auto 33px auto;
    }
    .success-tip{
      display:block;
      text-align: center;
      width: 100%;
      font-size: 32px;
      color: #222222;
      letter-spacing: 0;
      line-height: 40px;
      margin-bottom: 60px;
    }
  }
  .draw-win-list{
    .none-data {
      display: block;
      width: 100%;
      line-height: 50px;
      text-align: center;
      color: #888;
      font-size: 28px;
      margin-top: 60px;
      &:before{
        content: '';
        display: block;
        width: 180px;
        height: 180px;
        background: url('~assets/image/no-data.png') no-repeat;
        background-size: 180px;
        background-position: center;
        margin: 0px auto 10px auto;
      }
    }
    .win-warp {
      margin-top: 50px;
      min-height: 115px;
      overflow-y: scroll;
      .winner-item {
        border-bottom: 1px solid #eaeaea;
        background: #fff;
        &:last-child{
          border: none;
        }
      }
      &::-webkit-scrollbar {
          display: none;
      }
      .win-wrap-content{
        max-height: 330px;
        min-height: 10px;
        overflow-y: auto;
      }
      .win-wrap-header, .winner-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        text-align: left;
        height: 100px;
        box-sizing: border-box;
        padding: 18px 0px;
        .header-title, .title {
          width: 70px;
          text-align: center;
        }
        .name {
          width: 240px;
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-left: 20px;
          .img_header {
            display: inline-block;
            width: 64px;
            height: 64px;
            border-radius: 32px;
            margin-right: 10px;
            background-size: cover;
            background-position: center center;
          }
          img, .no-logo {
            display: inline-block;
            width: 64px;
            height: 64px;
            border-radius: 32px;
            margin-right: 10px;
          }
          .no-logo {
            background: #FFD021;
            text-align: center;
            line-height: 64px;
          }
        }
        .phone {
          display: block;
          width: 160px;
        }
      }
      .win-wrap-header{
        background: #f5f5f5;
      }
    }
  }
}
</style>
