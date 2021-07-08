import PlayVideo from '../video/index' // 直播推流回放组件 // 直播推流回放组件
import ComCards from '../sales-tools/com-cards' // 推荐卡片
import ComQuestions from '../sales-tools/com-questions'
import SendH5 from 'src/components/chat/send' // 聊天
import Chat from 'src/components/chat' // 聊天
import DocWatch from './doc-watch' // 推荐卡片
import { mapMutations, mapState } from 'vuex'
import * as types from 'src/store/mutation-types.js'
import { ActivityTool, BusTool, SaleTool } from 'src/utils/ConfigTool'
import EventBus from 'src/utils/eventBus'
import promoteMenu from './watch-memu/promote-menu'
import liveMenu from './watch-memu/live-menu'
import rankMenu from './watch-memu/rank-menu'
import ChatFilter from './chat-filter.vue'
export default {
  components: {
    PlayVideo,
    ComCards,
    ComQuestions,
    SendH5,
    Chat,
    DocWatch,
    promoteMenu,
    liveMenu,
    rankMenu,
    ChatFilter
  },
  data () {
    return {
      activity_id: this.$route.params.id,
      is_portrait: 'N',
      playType: '',
      isPlay: true,
      startInit: false,
      chooseTab: 0,
      isWatch: true, // 是否是观看端
      chatListInit: false, // 聊天滑动是否初始化
      isMuteShow: false, // 是否被禁言
      allMuted: false, // 是否是全体禁言
      zan_num: 0,
      cardData: {
        show: false,
        btn_display: 'Y',
        btn_link: '',
        btn_text: '',
        desc: '',
        pic: '',
        push_num: '',
        recommend_card_id: '',
        title: '',
        view_num: '',
        visit_num: ''
      },
      dragData: [],
      questionsShow: false,
      questionsSubmissionShow: false,
      naireId: '',
      questions: {
        img_url: '',
        title: '',
        description: ''
      }, // 问卷id
      currentQuestionId: '',
      questionShow: false,
      toolIconList: [],
      copyCount: 5,
      showQuestion: false,
      isIos: false,
      openDownloadSetting: false, // 是否开启资料下载
      condition: 1, // 资料下载条件 1 无限下载 2 分享下载
      downLoadSettingMethod: 1, // 资料下载方法 1上传文件 2文本 3连接
      downloadContext: '', // 下载资料文本内容
      downloadTitle: '', // 资料标题
      downloadLinkTitle: '', // 资料外链标题
      downloadDocInfo: null, // 上传信息
      showUpFileDownload: false, // 上传文件下载
      shareTip: false, // 分享提示
      isShare: false, // 是否分享,
      isSendQr: false, // 是否填写问卷
      isDocing: false,
      showPersonCount: 0,
      isDoc: false,
      onlinePerson: {
        visit_num: 0, // 真实浏览人数
        online_num: 0, // 真实在线人数
        init_online_num: 0 // 虚拟在线人数
      },
      isLogin: true,
      live_delay: 8000,
      questionTip: false
    }
  },
  watch: {
    questionsShow () {
      this.$nextTick(() => {
        EventBus.$emit('smallScreen', this.questionsShow)
      })
    }
  },
  computed: {
    ...mapState('liveMager', {
      activityInfo: state => state.activityInfo,
      goodsVisInfo: state => state.goodsVisInfo,
      downTimer: state => state.downTimer,
      lotteryDownTimer: state => state.lotteryDownTimer,
      visiteInfo: state => state.visiteInfo,
      buttonSettings: state => state.buttonSettings
    }),
    ...mapState('login', {
      loginInfo: state => state.loginInfo
    }),
    zanNumShow () {
      if (this.zan_num < 10000) {
        return this.zan_num
      } else if (this.zan_num < 100000) {
        return parseFloat(this.zan_num / 10000).toFixed(1) + '万'
      } else {
        return '10万+'
      }
    },
    downloadContent () {
      if (this.downLoadSettingMethod == 1) {
        if (this.downloadDocInfo) {
          return this.downloadDocInfo.name
        } else {
          return '主办方暂未提供任何文档'
        }
      } else if (this.downLoadSettingMethod == 2) {
        if (this.downloadContext) {
          return this.downloadContext
        } else {
          return '主办方暂未提供任何文档'
        }
      } else {
        return this.downloadLinkTitle || this.downloadTitle || '主办方暂未提供任何文档'
      }
    },
    downloadControlName () {
      if (this.downLoadSettingMethod == 1) {
        return '立即下载'
      } else if (this.downLoadSettingMethod == 2) {
        return '复制内容'
      } else if (this.downLoadSettingMethod == 3) {
        return '前往下载'
      }
    },
    showQuestionsIcon () { // 底部问答菜单
      const idx = this.tapList.findIndex(item => {
        return item.inside === 'questions'
      })
      return idx > -1 && this.tapList[idx].show == 1
    }
  },
  beforeDestroy () {
    clearInterval(this.publicInterval)
    this.publicInterval = null
  },
  mounted () {
    this.initPage()
  },
  methods: {
    ...mapMutations('login', {
      storeLoginInfo: types.LOGIN_INFO
    }),
    ...mapMutations('liveMager', {
      storeActivityInfo: types.ACTIVITY_INFO
    }),
    initPage () {
      /* 兼容解决iOS中浏览器回退消息丢失问题 */
      let isPageHide = false
      window.addEventListener('pageshow', () => {
        if (isPageHide) {
          window.location.reload()
        }
      })
      window.addEventListener('pagehide', () => {
        isPageHide = true
      })
      /* 1, 初始Bus化消息监听 */
      this.initEventBus()
      /* 2, 初始化数据 */
      this.initData()
      /* 4, socket消息监听 */
      this.initMsgServe()
      /* 5, 问卷图标显示 */
      this.getQuestionsStatus()
      /* 6.获取自定义菜单 */
      this.getCustomMenu()
      /* 7.获取下载设置信息 */
      this.getDownloadSetInfo()
      this.publicHeartBeat()
    },
    /* 初始化资料下载信息 */
    getDownloadSetInfo (msg) {
      if (msg) {
        const status = ~~msg.data.status
        const open_status = ~~msg.data.open_status
        if (open_status === 1 || (open_status === 2 && this.playType === 'live') || (open_status === 3 && this.playType === 'vod')) {
          EventBus.$emit(BusTool.PUSH_TOOL_ICON, {
            name: '文档下载',
            type: 'doc-download',
            toolType: status === 1 ? 'add' : 'remove'
          })
        } else {
          EventBus.$emit(BusTool.PUSH_TOOL_ICON, {
            name: '文档下载',
            type: 'doc-download',
            toolType: 'remove'
          })
        }
        return
      }
      return VHALL_ZK.$api.getDocDownloadSetting().then((res) => {
        let { setting, commit_naire } = res.data
        // 开启下载设置
        if (setting.status == 1) {
          this.openDownloadSetting = true
          this.condition = setting.condition
          this.downLoadSettingMethod = setting.method
          this.downloadContext = setting.context
          this.downloadTitle = setting.title
          this.downloadLinkTitle = setting.link_title
          this.isSendQr = commit_naire === 1 // 1.是  2.否
          if (this.downLoadSettingMethod == 1 && res.data.doc) {
            this.downloadDocInfo = res.data.doc
          }
          if (setting.open_status == 1 || (setting.open_status == 2 && this.playType === 'live') || (setting.open_status == 3 && this.playType === 'vod')) {
            EventBus.$emit(BusTool.PUSH_TOOL_ICON, {
              name: '文档下载',
              type: 'doc-download',
              toolType: 'add',
              redIcon: true
            })
          }
        } else {
          this.openDownloadSetting = false
        }
        return res.data
      })
    },
    clickLoginUser () {
      this.showUpFileDownload = false
      EventBus.$emit('loginUser')
    },
    doLogin () {},
    // 展示资料下载弹窗
    async docDownload () {
      if (!this.loginInfo.consumer_user_id) {
        this.doLogin()
      } else {
        await this.getDownloadSetInfo()
        if (this.openDownloadSetting) {
          if (this.condition == 2 || this.condition == 3) {
            VHALL_ZK.$api.getShareCount().then((res) => {
              if (res.code === 200) {
                if (res.data > 0) {
                  this.isShare = true
                } else {
                  this.isShare = false
                }
              }
              this.showUpFileDownload = true
            }).catch((e) => {
              this.showUpFileDownload = true
            })
          } else if (this.condition == 1) {
            this.showUpFileDownload = true
          }
        }
      }
    },
    // 下载资料
    downloadFile () {
      if (this.downLoadSettingMethod == 1) {
        let a = document.createElement('a')
        a.href = this.downloadDocInfo.oss_file
        a.click()
      } else if (this.downLoadSettingMethod == 2) {
        // 文本粘贴
        this.$refs.downloadSetting.innerText.copyClipboard((e) => {
          if (e === 'success') {
            this.$toast('复制成功')
          } else {
            this.$toast('复制失败')
          }
        })
      } else if (this.downLoadSettingMethod == 3) {
        // 外链下载
        let link = document.createElement('a')
        link.href = this.downloadContext ? this.downloadContext : ''
        link.click()
      }
    },
    /* 马上填写问卷 */
    immInputQuestions () {
      this.showQuestion = true
      this.getQuestions()
    },
    // 未分享状态下进行分享
    showTipPic () {
      // 调取接口分享 并 显示提示弹窗
      EventBus.$emit('showDocTip', true)
      window.VHALL_ZK.$api.activityShareRecord()
    },
    initData () {
      this.isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      this.currentOnlineNum()
      if (this.activityInfo.status === ActivityTool.status.PREPARE) {
        if (this.activityInfo.warm && this.activityInfo.warm.enabled === 'Y') {
          this.playType = 'warm'
        } else {
          this.playType = 'pre'
        }
      } else if (this.activityInfo.status === ActivityTool.status.FINISH) {
        this.playType = 'end'
      } else if (this.activityInfo.status === ActivityTool.status.PLAYBACK) {
        this.playType = 'vod'
      } else {
        this.playType = 'live'
      }
      if (this.activityInfo.invite_card) {
        EventBus.$emit(BusTool.PUSH_TOOL_ICON, {
          name: '邀请卡',
          type: 'invite-card',
          toolType: 'add',
          redIcon: false
        })
      }
      this.zan_num = this.activityInfo.zan_num
      this.isDoc = this.activityInfo.layout === 2
      this.startInit = true
    },
    async publicHeartBeat () { // 公共定时器，节省定时器资源
      clearInterval(this.publicInterval)
      this.publicInterval = setInterval(() => {
        /* 1，通过定时器获取纠正当前在线人数，谨防人数误差太大 */
        this.currentOnlineNum()
      }, 30 * 1000)
    },
    currentOnlineNum () {
      // 通过定时器获取纠正当前在线人数，谨防误差太大
      window.VHALL_ZK.$api.getOnlineNum().then((res) => {
        if (res.data) {
          // 真实浏览人数 res.data.visit_num
          // 真实在线人数 res.data.online_num
          // 虚拟在线人数 res.data.init_online_num
          this.onlinePerson = res.data
          this.showPersonCount = ~~res.data.init_online_num + ~~res.data.visit_num
          EventBus.$emit(BusTool.realOnlineNum, res.data.online_num)
          EventBus.$emit('showPersonCount', this.showPersonCount)
        }
      })
    },
    initEventBus () {
      EventBus.$on(BusTool.LIVE_DELAY, (time) => {
        // 直播延迟时间
        this.live_delay = Math.round(time + 3) * 1000
      })
      EventBus.$on(BusTool.PUSH_TOOL_ICON, (obj) => {
        this.pushToolIcon(obj)
      })
      EventBus.$on(BusTool.showQuestion, (id) => {
        this.showQuestion = true
        this.getQuestions(id)
      })
      EventBus.$on(BusTool.RECOMMEND_CARD_PUSH, (msg) => {
        this.getCardDetails(msg.recommend_card_id)
      })
      EventBus.$on(BusTool.NAIRE, (msg) => {
        this.currentQuestionId = msg.naire_id
        this.getQuestions(msg.naire_id)
      })
      EventBus.$on('isPlay', (isPlay) => {
        this.isPlay = isPlay
      })
      if (this.activityInfo.layout === 2) { // 文档布局
        // 文档是否正在进行中
        EventBus.$on('docing', (type) => {
          this.isDocing = type
        })
      }
    },
    initMsgServe () {
      EventBus.$emit(BusTool.LAYOUT_CHAT_SERVICE, this.activity_id)
      /* 监听开始直播 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.BEGIN_LIVE, (msg) => {
        let t = setTimeout(() => {
          clearTimeout(t)
          EventBus.$emit('start_live')
          this.$messageBox({
            header: '提示',
            content: '直播已经开始，马上观看吧',
            type: 'noneClose',
            confirmText: '立即观看',
            handleClick: (e) => {
              if (e.action === 'confirm') {
                this.playType = 'live'
                const temp = JSON.parse(JSON.stringify(this.activityInfo))
                temp.status = ActivityTool.status.LIVING
                temp.status_name = '直播中'
                this.storeActivityInfo(temp)
              }
            }
          })
        }, 12000)
      })
      /* 监听直播结束 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.FINISH_LIVE, (msg) => {
        let t = setTimeout(() => {
          clearTimeout(t)
          EventBus.$emit('end_live')
          this.playType = 'end'
          const temp = JSON.parse(JSON.stringify(this.activityInfo))
          temp.status = ActivityTool.status.FINISH
          temp.status_name = '结束'
          this.storeActivityInfo(temp)
        }, 12000)
      })
      /* 监听在线人数 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.INCREMENT_ONLINE, (msg) => {
        this.onlinePerson.init_online_num = msg.num
        this.showPersonCount = ~~this.onlinePerson.init_online_num + ~~this.onlinePerson.visit_num
        EventBus.$emit('showPersonCount', this.showPersonCount)
      })
      /* 监听真实人员进入直播间 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.JOIN, (msg) => {
        console.log('--进入房间--消息--')
        this.showPersonCount += 1
        this.onlinePerson.online_num += 1
        EventBus.$emit('showPersonCount', this.showPersonCount)
      })
      /* 监听推荐卡片 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.MARKET_TOOL, (msg) => {
        switch (msg.type) {
          case SaleTool.TOAST_NUM: // 监听点赞消息
            this.zan_num = msg.toast_num
            this.$zan()
            break
          case SaleTool.DOC_DOWNLOAD_SWITCH: // 资料下载开关
            this.getDownloadSetInfo(msg)
            break
        }
        /* 根据直播延迟时间延迟处理营销工具推送消息 */
        let tTime = setTimeout(() => {
          clearTimeout(tTime)
          // 处理营销工具推送消息
          this.marketTool(msg)
        }, this.live_delay)
      })
      /* 自定义菜单变动 */
      VHALL_ZK.$event.on(VHALL_ZK.EVENTS.MENU_PUSH, (msg) => {
        let selectMenuObj = this.tapList[this.chooseTab]
        this.tapList.every((menu) => {
          if (menu.menu_id == msg.menu_id) {
            menu.show = msg.show
            if (selectMenuObj.menu_id === msg.menu_id) { // 变动菜单为当前选中菜单
              this.selectFirstMenu()
            }
            return false
          }
          return true
        })
      })
    },
    marketTool (msg) {
      switch (msg.type) {
        case SaleTool.RECOMMEND_CARD_PUSH:
          console.log('--推荐卡片--消息--')
          this.$get(msg.url).then((data) => {
            this.cardData = { ...data, show: true }
          })
          break
        case SaleTool.NAIRE:
          console.log('--发送问卷--消息--')
          this.showQuestion = false
          // this.questionStatus.iconShow = true
          EventBus.$emit(BusTool.PUSH_TOOL_ICON, {
            name: '问卷',
            type: 'ques',
            toolType: 'add',
            redIcon: false
          })
          if (this.currentQuestionId === msg.id && this.questionsShow) {
          } else {
            this.currentQuestionId = msg.id
            this.questionsShow = false
            this.questionsSubmissionShow = false
            this.$get(msg.url).then((data) => {
              let result = true
              if (this.loginInfo) {
                let userId = this.loginInfo.consumer_user_id || this.visiteInfo.visitor_id
                result = data.commit_user_list.every((itemId) => {
                  if (itemId.toString() === userId.toString()) {
                    return false
                  }
                  return true
                })
              }
              if (result) { // 没有提交过问卷
                this.dealWithGetQuestions(data)
              } else {
                this.questionsSubmissionShow = true
                // this.questionStatus.redIcon = false
                EventBus.$emit(BusTool.PUSH_TOOL_ICON, {
                  name: '问卷',
                  type: 'ques',
                  toolType: 'add',
                  redIcon: false
                })
              }
            })
          }
          break
      }
    },
    pushToolIcon (obj) {
      const result = this.toolIconList.every((item, idx) => {
        // 有重复数据
        if (this.playType !== 'end' && item.type === obj.type) {
          if (obj.toolType === 'remove') { // 移除图标
            this.toolIconList.splice(idx, 1)
          } else { // 替换
            this.toolIconList[idx] = obj
          }
          this.toolIconList = [ ...this.toolIconList ]
          return false
        }
        return true
      })
      // 没有相同的就添加
      if (obj.toolType === 'add' && result && this.playType !== 'end') {
        this.toolIconList.push(obj)
      }
    },
    isEleInViewport(el) {
      // 获取元素是否在可视区域
      let rect = el.getBoundingClientRect()
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
        (window.innerWidth || document.documentElement.clientWidth)
      )
    },
    triggerGoodMenu () {
      /* 选中商品菜单 */
      this.tapList.every((item, idx) => {
        if (item.inside === 'goods') {
          this.tabChange(item.inside, idx)
          return false
        }
        return true
      })
    },
    /* 选中问答菜单 */
    triggerQuestionsMenu () {
      this.questionTip = false
      this.tapList.every((item, idx) => {
        if (item.inside === 'questions') {
          this.tabChange(item.inside, idx)
          return false
        }
        return true
      })
      this.openDescAndGoods = true
    },
    selectFirstMenu () {
      this.tapList.every((menu, idx) => {
        if (menu.show === 1) {
          this.tabChange(menu.inside, idx)
          return false
        }
        return true
      })
    },
    tabChange (name, tab) {
      this.chooseTab = tab
      this.tapList[tab].news = false
      if (name === 'chat') {
        this.$nextTick(() => {
          this.$refs.chatbox[0].scrollToBtm()
        })
      } else if (name === 'privateChat') {
        this.$nextTick(() => {
          this.$refs.groupChatbox[0].scrollToBtm()
        })
      } else if (name === 'doc') {
        this.$nextTick(() => {
          this.$refs.docWatch && this.$refs.docWatch[0].initDoc()
        })
      } else if (name === 'goods') {
        this.$nextTick(() => {
          EventBus.$emit(SaleTool.GOODS_LIST)
        }, 100)
      }
      /* 统一处理菜单滚动，如果选中菜单不在可视化区域，滚动到可视化区域 */
      this.$nextTick(() => {
        let activeMenu = document.querySelector('.tabs-wrap li.active')
        if (!this.isEleInViewport(activeMenu)) {
          activeMenu.parentNode.scrollLeft = activeMenu.offsetLeft - activeMenu.offsetWidth
        }
      })
    },
    newsMsg (type) {
      /* 如果此时没有选中当前菜单 */
      if (this.tapList[this.chooseTab].inside !== type) {
        this.tapList.every((item) => {
          if (item.inside === type) {
            item.news = true
            return false
          }
          return true
        })
      }
    },
    // 获取自定义菜单
    getCustomMenu () {
      window.VHALL_ZK.$api.getActivityMenuList().then((res) => {
        if (res.code === 200 && res.data) {
          let arr = []
          // show 1:开启 2:关闭自定义菜单
          res.data.forEach((item) => {
            if (item.inside === 'des') {
              item.content = this.activityInfo.description
            }
            if ((this.is_portrait === 'Y' && item.inside !== 'chat' && item.inside !== 'doc') || this.is_portrait === 'N') {
              item.news = false
              if (item.show == 1) {
                arr.push(item)
              } else {
                arr.push(item) // 修改为自定义菜单实时更新后,需要全部菜单数据
              }
            }
          })
          this.tapList = [...this.tapList, ...arr]
        }
      })
    },
    getCardDetails (id) {
      window.VHALL_ZK.$api.getCardDetail(id).then((res) => {
        if (res.code === 200) {
          this.cardData = { ...res.data, show: true }
        }
      })
    },
    goCard () {
      let avatar = this.loginInfo.avatar ? `${this.$imgHost}/${this.loginInfo.avatar}` : ''
      let userName = this.loginInfo.nick_name || this.visiteInfo.visitor_name
      let cconsumerId = this.loginInfo ? this.loginInfo.consumer_user_id : this.visiteInfo.visitor_id
      let shareId = this.$route.query.shareId || ''
      let params = `&inviter_type=2&avatar=${encodeURIComponent(avatar)}&user_name=${userName}&business_uid=${this.activityInfo.business_account_id}&inviter_visitor_id=${this.visiteInfo.visitor_id}&inviter_consumer_id=${cconsumerId}`
      this.$router.push(`/invite-card/${this.activity_id}?type=live${params}&shareId=${shareId}`)
    },
    clickRedpack () {
      this.$parent.showDownTip()
    },
    clickLottery () {
      this.$parent.showLotteryDownTip()
    },
    clickQues () {
      this.showQuestion = true
      this.getQuestions()
    },
    getQuestionsStatus () {
      VHALL_ZK.$api.getNaireDetail().then((res) => {
        if (res.code === 200 && res.data && res.data.id) {
          // this.questionStatus.iconShow = true
          // this.questionStatus.redIcon = true
          EventBus.$emit(BusTool.PUSH_TOOL_ICON, {
            name: '问卷',
            type: 'ques',
            toolType: 'add',
            redIcon: true
          })
        }
      }).catch((err) => {
        if (err.code === 15110) {
          // this.questionStatus.iconShow = true
          // this.questionStatus.redIcon = false
          EventBus.$emit(BusTool.PUSH_TOOL_ICON, {
            name: '问卷',
            type: 'ques',
            toolType: 'remove',
            redIcon: false
          })
        }
      })
    },
    getQuestions (id) {
      this.questionsShow = false
      this.questionsSubmissionShow = false
      VHALL_ZK.$api.getNaireDetail(id || '').then((res) => {
        if (res.data) {
          this.dealWithGetQuestions(res.data)
        } else {
          this.$toast('主办方暂未发送问卷')
        }
      }).catch((err) => {
        if (err.code === 15110) {
          this.questionsSubmissionShow = true
          // this.questionStatus.redIcon = false
          EventBus.$emit(BusTool.PUSH_TOOL_ICON, {
            name: '问卷',
            type: 'ques',
            toolType: 'add',
            redIcon: false
          })
        } else {
          this.showQuestion = false
          this.$messageBox({
            header: '提示',
            content: err.msg,
            confirmText: '确定',
            handleClick: (e) => {
              if (e.action === 'cancel') {
              } else if (e.action === 'confirm') {
              }
            }
          })
        }
      })
    },
    dealWithGetQuestions (data) {
      this.showQuestion = false
      // this.questionStatus.redIcon = true
      EventBus.$emit(BusTool.PUSH_TOOL_ICON, {
        name: '问卷',
        type: 'ques',
        toolType: 'add',
        redIcon: true
      })
      this.questions.img_url = data.img_url
      this.questions.title = data.title
      this.questions.description = data.description
      this.naireId = data.id
      this.dragData = []
      // 兼容detail为空的情况
      data.detail.forEach((item) => {
        item.detail = item.detail || { is_answer: null, format: null, min: null, max: 0 }
        this.dragData.push(item)
      })
      this.questionsShow = true
    },
    clickZan () {
      if (this.countSt) {
        this.$zan()
        return
      }
      // 发送点赞
      window.VHALL_ZK.$api.sendZan()
      this.countSt = setTimeout(() => {
        clearTimeout(this.countSt)
        this.countSt = null
      }, 5000)
    },
    hiddenQuestions (e) {
      if (e.action === 'cancel') {
        this.questionsSubmissionShow = false
      }
    },
    questionSuccess (type) {
      this.questionsShow = false
      // this.questionStatus.redIcon = type
      this.isSendQr = type
      EventBus.$emit(BusTool.PUSH_TOOL_ICON, {
        name: '问卷',
        type: 'ques',
        toolType: 'add',
        redIcon: type
      })
    },
    closeCards () {
      this.cardData.show = false
    },
    chatClick (event) {
      // document.querySelector('textarea#textarea').focus()
      document.querySelector('#sendBox .inp input').focus()
      // 点击弹出聊天窗口
      EventBus.$emit('chatOpen')
      event.preventDefault()
    },
    isMute (val) {
      this.isMuteShow = val.isMute
      this.allMuted = val.type === 'allMuted'
    },
    closeChatBox () {
      // 关闭聊天窗口
      EventBus.$emit('chatClose')
    },
    isWx () {
      let ua = navigator.userAgent.toLowerCase()
      let isWeixin = ua.indexOf('micromessenger') !== -1
      if (isWeixin) {
        return true
      }
      return false
    },
    /* 监听到有新问答消息 */
    handleListenQestion () {
      this.newsMsg('questions')
      // 当前没选中的时候
      if (this.is_portrait === 'Y' && !this.openDescAndGoods) { // 竖屏下如果没有开启菜单也要有
        this.questionTip = true
      }
    },
    /* 开启聊天过滤 */
    openChatFilter () {
      EventBus.$emit('OPEN_CHAT_FILTER')
    }
  },
  filters: {
    fmtTimer (value) {
      let m = ((value / 60 % 60 >> 0) + '').padStart(2, 0)
      let s = ((value % 60 >> 0) + '').padStart(2, 0)
      return `${m}:${s}`
    }
  }
}
