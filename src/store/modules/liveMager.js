import * as types from '../mutation-types'

const liveMagerModules = {
  namespaced: true,
  state: {
    emailInfo: {
      activity_id: '',
      emailInviteId: '',
      emailTemplateId: 1,
      title: '',
      content: '',
      desc: '',
      senderName: ''
    },
    liveDevices: {
      camera: '',
      mic: ''
    },
    roomPaas: {
      account_id: '',
      app_id: '',
      channel_room: '',
      hd_room: '',
      live_room: '',
      token: '',
      channel_id: ''
    },
    activityInfo: {}, // 活动信息
    bu: 'zhike',
    downTimer: 0,
    lotteryDownTimer: 0,
    visiteInfo: {},
    goodsVisInfo: {},
    customTheme: {
      bgImg: '',
      logoImg: '',
      chatImg: ''
    },
    buttonSettings: {
      showPlaySpeed: false,
      showResolution: false,
      showInviteCard: true,
      showSubscribe: true
    },
    barrageSettings: {
      useBarrage: false,
      barrageFontSize: '14px',
      barrageFontColor: '#fffff'
    },
    videoQualitys: [{
      idx: 0,
      def: 'same'
    }], // 清晰度列表
    videoCurrentQuality: 0, // 当前清晰度(下标)
    videoPlayType: '', // 视频类型
    videoSelectSpeed: 1 // 当前播放倍速
  },
  getters: {
    liveDevices: state => state.liveDevices,
    emailInfo: state => state.emailInfo,
    roomPaas: (state) => state.roomPaas,
    activityInfo: (state) => state.activityInfo,
    downTimer: state => state.downTimer,
    lotteryDownTimer: state => state.lotteryDownTimer,
    visiteInfo: state => state.visiteInfo,
    goodsVisInfo: state => state.goodsVisInfo,
    bu: state => state.bu,
    hasRewardModule: state => state.activityInfo.reward_status === 'Y', // 是否打开了打赏
    hasGiftModule: state => state.activityInfo.gift_status === 'Y' // 是否打开了礼物
  },
  mutations: {
    [types.GOODS_VIS_INFO] (state, reLoad) {
      state.goodsVisInfo = reLoad
    },
    [types.GOODS_STOCK_STATU] (state, statu) {
      state.goodsVisInfo.stock_status = statu
    },
    [types.VIDEO_DEVICE] (state, reLoad) {
      state.liveDevices = reLoad
    },
    [types.EMAIL_INFO] (state, reLoad) {
      state.emailInfo = reLoad
    },
    [types.ROOM_PAAS] (state, reLoad) {
      state.roomPaas = reLoad
    },
    [types.ACTIVITY_INFO] (state, reLoad) {
      state.activityInfo = reLoad
    },
    [types.DOWN_TIMER] (state, reLoad) {
      state.downTimer = reLoad
    },
    [types.LOTTERY_DOWN_TIMER] (state, reLoad) {
      state.lotteryDownTimer = reLoad
    },
    [types.VISITE_INFO] (state, reLoad) {
      state.visiteInfo = reLoad
    },
    [types.ACTIVITY_BU] (state, reLoad) {
      state.bu = reLoad
    },
    [types.CUSTOM_THEME] (state, reLoad) {
      state.customTheme = reLoad
    },
    [types.BARRAGE_SETTINGS] (state, reLoad) {
      state.barrageSettings = reLoad
    },
    [types.BUTTON_SETTINGS] (state, reLoad) {
      state.buttonSettings = reLoad
    },
    [types.VIDEO_QUALITYS] (state, reLoad) {
      state.videoQualitys = reLoad
    },
    [types.VIDEO_CURRENT_QUALITY] (state, reLoad) {
      state.videoCurrentQuality = reLoad
    },
    [types.VIDEO_PLAY_TYPE] (state, reLoad) {
      state.videoPlayType = reLoad
    },
    [types.VIDEO_SELECT_SPEED] (state, reLoad) {
      state.videoSelectSpeed = reLoad
    },
    [types.REWARD_SWITCH] (state, reLoad) {
      state.activityInfo.reward_status = reLoad
    },
    [types.GIFT_SWITCH] (state, reLoad) {
      state.activityInfo.gift_status = reLoad
    }
  }
}

export default liveMagerModules
