/**
 * 全局配置
 */
export const AppTool = {
  // 活动封面图
  default_cover: '//static.vhallyun.com/mp-prod/2e/ee/2eeea45977e8e825da2bbdd5a1d58326.jpg',
  areaJson: 'https://static.vhallyun.com/public/static/js/area.json'
}
/**
 * 活动状态配置
 */
export const ActivityTool = {
  status: {
    PREPARE: 'PREPARE',
    LIVING: 'LIVING',
    FINISH: 'FINISH',
    PLAYBACK: 'PLAYBACK'
  },
  playTypes: {
    PREPARE: 'pre',
    LIVING: 'live',
    FINISH: 'end',
    PLAYBACK: 'vod'
  },
  playStatuTypes: {
    PREPARE: '预告',
    LIVING: '直播中',
    FINISH: '结束',
    PLAYBACK: '回放'
  }
}
/**
 * 营销工具
 */
export const SaleTool = {
  GOODS_PUSH: 'GOODS_PUSH', // 商品
  RECOMMEND_CARD_PUSH: 'RECOMMEND_CARD_PUSH', // 卡片
  NAIRE: 'NAIRE', // 问卷
  RED_PACKET_PUSH: 'RED_PACKET_PUSH', // 红包
  GOODS_STAND_CARD_ADDED: 'GOODS_STAND_CARD_ADDED', // 商品推荐-商品上下架
  GOODS_TOP: 'GOODS_TOP', // 商品置顶
  TOAST_NUM: 'TOAST_NUM', // 点赞
  FORCE_SHOW: 'FORCE_SHOW', // 商品推送是否强制显示
  H5_PAY: 'H5_PAY',
  JSAPI: 'JSAPI',
  GOODS_STOCK_ADD: 'GOODS_STOCK_ADD', // 商品增加库存
  GOODS_SHOW_SET: 'GOODS_SHOW_SET', // 商品显示设置
  GOODS_LIST: 'GOODS_LIST', // 重查商品列表
  GOODS_ADDED: 'GOODS_ADDED', // 商品库，商品上下架
  GOODS_ADD: 'GOODS_ADD', // 商品添加
  GOODS_EDIT: 'GOODS_EDIT', // 商品编辑
  GOODS_DELETE: 'GOODS_DELETE', // 商品删除
  GOODS_SORT: 'GOODS_SORT', // 商品排序
  DOC_DOWNLOAD_SWITCH: 'DOC_DOWNLOAD_SWITCH' // 资料下载开关
}
/**
 * 红包
 */
export const RedBagTool = {
  MARKET_TOOL: 'MARKET_TOOL', // 营销工具 消息 具体详细类型由里面的type区分
  createRedBag: 'RED_PACKET_PUSH', // 主持端创建红包完成
  redBagJoin: 'RED_PACKET_JOIN' // 参与当次红包人数通知
}
/**
 * 抽奖
 */
export const Lottery = {
  MARKET_TOOL: 'MARKET_TOOL', // 营销工具 消息 具体详细类型由里面的type区分
  createLottery: 'LOTTERY_PUSH', // 主持端创建抽奖完成
  endLottery: 'LOTTERY_END' // 抽奖结束
}
/**
 * 聊天配置
 */
export const ChartTool = {
  ROLE_TYPE: {
    HOST: 'HOST'
  },
  JOIN: 'Join',
  LEAVE: 'Leave',
  CHAT: 'chat',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  KICK: 'KICK', // 踢出
  DISABLE_KICK: 'DISABLE_KICK',
  KICK_BATCH: 'KICK_BATCH', // 聊天审核，批量踢出
  GAG: 'GAG', // 禁言
  DISABLE_GAG: 'DISABLE_GAG',
  GAG_ALL: 'GAG_ALL', // 全体禁言
  DISABLE_GAG_ALL: 'DISABLE_GAG_ALL',
  DELETE_MESSAGE: 'DELETE_MESSAGE',
  CHAT_ADGED: 'CHAT_ADGED', // 聊天审核开关消息
  onLineNum: 'INCREMENT_ONLINE', // 虚拟人数通知
  announcement: 'ANNOUNCEMENT', // 公告
  beginLive: 'BEGIN_LIVE', // 开始直播
  endLive: 'FINISH_LIVE', // 结束直播
  joinLive: 'Join', // 进入直播间
  leaveLive: 'Leave', // 离开直播间
  MARKET_TOOL: 'MARKET_TOOL',
  ORDER_PAY: 'ORDER_PAY', // 商品购买
  QUESTION_PUSH: 'QUESTION_PUSH', // 问答-创建问题
  QUESTION_ANSWER: 'QUESTION_ANSWER', // 问答-问题回复
  QUESTION_DELETE: 'QUESTION_DELETE', // 问答-删除问题
  DELETE_ANSWER: 'DELETE_ANSWER', // 问答-删除回复
  QUESTION_DEAL: 'QUESTION_DEAL', // 问答-问题标记已处理
  QUESTION_IS_QUALITY: 'QUESTION_IS_QUALITY', // 问答-问题标记(取消)优质
  MENU_PUSH: 'MENU_PUSH', // 菜单开关推送
  GIFT_CHAT: 'GIFT_CHAT', // 礼物成功后的消息
  GROUP: {
    GROUP_NEW: 'GROUP_NEW', // 群组被创建聊天
    PRIVATE_CHAT: 'PRIVATE_CHAT', // 群组聊天
    GROUP_DISSOLVE: 'GROUP_DISSOLVE' // 群组解散
  },
  REWARD_CHAT: 'REWARD_CHAT' // 打赏成功后后的消息
}
export const BusTool = {
  realOnlineNum: 'realOnlineNum', // 监听真实在线人数
  sendPassword: 'sendPassword', // 发送口令
  sendLotteryPassword: 'sendLotteryPassword', // 发送抽奖口令
  red_packet: 'red_packet',
  lottery_send: 'lottery_send', // 发送抽奖口令
  clickRedpack: 'clickRedpack', // 点击红包
  showQuestion: 'showQuestion', // 显示问卷
  LOTTERY_PUSH: 'LOTTERY_PUSH',
  GOODS_PUSH: 'GOODS_PUSH', // 商品
  RECOMMEND_CARD_PUSH: 'RECOMMEND_CARD_PUSH', // 卡片
  NAIRE: 'NAIRE', // 问卷
  RED_PACKET_PUSH: 'RED_PACKET_PUSH', // 红包
  PUSH_TOOL_ICON: 'PUSH_TOOL_ICON', // 互动工具图标显示
  LIVE_DELAY: 'LIVE_DELAY', // 直播延迟时间
  LAYOUT_CHAT_SERVICE: 'LAYOUT_CHAT_SERVICE' // 全局聊天服务
}

export const LocalKey = {
  remark: 'remark', // remark参数
  thumb: 'thumb',
  whitePhone: 'whitePhone',
  WX_HEAD_URL: 'wx_head_url',
  wechatAuth: 'wechatAuth',
  openId: 'openId',
  appId: 'appId',
  nickname: 'nickname',
  headUrl: 'head_url',
  qrcode: 'qrcode',
  business_user_id: 'business_user_id',
  token: 'token',
  POSTER_CLICK: 'is_click_poster', // 是否点击海报
  WINNER_INFO: 'winnerInfo' // 领奖信息
}
export const WxPayKey = {
  PAY: 'PAY',
  PAY_WATCH_URL: 'PAY_WATCH_URL',
  PAY_ACTIVITY_ID: 'PAY_ACTIVITY_ID',
  WX_PAY_APP_ID: 'WX_PAY_APP_ID', // 微信支付授权appId
  WX_PAY_OPEN_ID: 'WX_PAY_OPEN_ID', // 微信支付授权openId
  PAY_GOODS_DETAIL: 'PAY_GOODS_DETAIL', // 待支付商品详情
  PAY_BILL_NO: 'PAY_BILL_NO', // 待支付订单no
  PAY_ORDER_ID: 'PAY_ORDER_ID', // 待支付order-id
  LIST_PAY_BILL_NO: 'LIST_PAY_BILL_NO', // 用户详情-订单列表或者订单详情bill_NO
  LIST_PAY_ORDER_ID: 'LIST_PAY_ORDER_ID' // 用户详情-订单列表或者订单详情order_id
}

/* 排行榜 */
export const RankListTool = {
  SHARE: 'share',
  // INVITE: 'invite',
  BUYER: 'buyer',
  WATCH: 'watch',
  REWARD: 'reward',
  GIFT: 'gift'
}
