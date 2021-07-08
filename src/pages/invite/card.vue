<template>
  <div class="invite-card">
    <div class="show-mode" ref="showMode">
      <div class="phone-card"
           :class="{'default-one': card.default=='Y' && card.type==2, 'default-two': card.default=='Y' && card.type==1}"
           v-for="(card,idx) in inviteCardList" :key="idx">
        <img class="bg-img" :hsrc="`${card.background_image}?x-oss-process=image/resize,m_lfit,w_3200&t=${Math.random()}`">
        <!-- 默认模板1 -->
        <template v-if="card.default=='Y' && card.type == 1" v-show="true">
          <div class="card-content">
            <div class="drag-item user-info">
              <img v-if="queryParams.avatar || card.avatar" class="avatar-icon" :hsrc="`${queryParams.avatar || card.avatar}?x-oss-process=image/resize,m_lfit,w_100&t=${Math.random()}`">
              <i v-else class="avatar-icon default-icon"></i>
              <span>{{queryParams.user_name || card.nickname || visitorName | overHidden(10)}}</span>
            </div>
            <div class="drag-item detail">
              <div class="title">
                <span>{{card.title}}</span>
              </div>
              <div class="sub-title">主办方: {{card.sponsor | isEmpty | overHidden(10)}}</div>
              <div class="sub-time">直播时间: {{card.start_time}}</div>
            </div>
          </div>
          <div class="drag-item qr-code">
            <img :hsrc="`https://aliqr.e.vhall.com/qr.png?t=${encodeURIComponent(`https:${MOBILE_HOST}watch/${activity_id}?card_id=${card.card_id}${sqParams}`)}`">
            <div class="qr-tip">
              <span>分享邀请卡</span>
              <span>长按识别二维码参与活动</span>
            </div>
          </div>
        </template>
        <!-- 默认模板2 -->
        <template v-else-if="card.default=='Y' && card.type == 2">
          <div class="drag-item user-info">
            <img v-if="queryParams.avatar || card.avatar" class="avatar-icon" :hsrc="`${queryParams.avatar || card.avatar}?x-oss-process=image/resize,m_lfit,w_100&t=${Math.random()}`">
            <i v-else class="avatar-icon default-icon"></i>
            <span>{{queryParams.user_name || card.nickname || visitorName | overHidden(10)}}</span>
          </div>
          <div class="drag-item detail">
            <div class="title">{{card.title}}</div>
            <div class="sub-title">主办方: {{card.sponsor | isEmpty}}</div>
            <div class="sub-time">直播时间: {{card.start_time}}</div>
          </div>
          <div class="drag-item qr-code">
            <img :hsrc="`https://aliqr.e.vhall.com/qr.png?t=${encodeURIComponent(`https:${MOBILE_HOST}watch/${activity_id}?card_id=${card.card_id}${sqParams}`)}`">
            <div class="qr-tip">
              <span>分享邀请卡</span>
              <span>长按识别二维码参与活动</span>
            </div>
          </div>
        </template>
        <!-- 自定义模板 -->
        <template v-else>
          <div class="drag-item user-info"
               :style="{top: card.template.userPosition.top, left:card.template.userPosition.left}"
               v-if="card.display_user_info==='Y'">
            <img v-if="queryParams.avatar || card.avatar" class="avatar-icon" :hsrc="`${queryParams.avatar || card.avatar}?x-oss-process=image/resize,m_lfit,w_100&t=${Math.random()}`">
            <i v-else class="avatar-icon default-icon"></i>
            <span>{{queryParams.user_name || card.nickname || visitorName | overHidden(10)}}</span>
          </div>
          <div class="drag-item qr-code"
               :class="{big:card.template.qrCodePosition.size==3,mid:card.template.qrCodePosition.size==2,small:card.template.qrCodePosition.size==1 }"
               :style="{top: card.template.qrCodePosition.top, left:card.template.qrCodePosition.left}">
            <img :hsrc="`https://aliqr.e.vhall.com/qr.png?t=${encodeURIComponent(`https:${MOBILE_HOST}watch/${activity_id}?card_id=${card.card_id}${sqParams}`)}`">
          </div>
        </template>
      </div>
    </div>
    <div class="card-list">
      <span class="card-tip">长按图片保存到相册</span>
      <div class="card-box">
        <mt-swipe :auto="0" :show-indicators="true">
          <mt-swipe-item v-for="(card,idx) in preViewList" :key="idx">
            <div class="phone-img">
              <img class="cover-img" :src="card.coverImg">
            </div>
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <button class="default-button primary-button" @click="goLivePage">返回当前活动</button>
    </div>
    <div v-if="showTimeOut" class="time-out">
      <div class="time-out-con">
        <div class="time-show">生成超时，请刷新重试</div>
        <button class="default-button primary-button" @touchstart="dealWithShowEle">点击刷新</button>
      </div>
    </div>
  </div>
</template>

<script>
import Html2canvas from 'html2canvas'
export default {
  name: 'invite-card',
  data () {
    return {
      activity_id: this.$route.params.id,
      MOBILE_HOST: process.env.MOBILE_HOST,
      inviteCardList: [],
      visitorName: '',
      visitorId: '',
      user_name: '',
      avatar: '',
      showTimeOut: false,
      loginInfo: {},
      queryParams: {},
      preViewList: []
    }
  },
  computed: {
    sqParams () {
      return `&log_type=card&inviter_type=2&business_uid=${this.queryParams.business_uid}&inviter_visitor_id=${this.visitorId}&inviter_consumer_id=${this.loginInfo ? this.loginInfo.consumer_user_id : ''}&time=${Math.random()}`
    }
  },
  created () {
    this.queryParams = this.$route.query
    console.log(`user_name=${this.queryParams.user_name}`)
    console.log(`avatar=${this.queryParams.avatar}`)
    this.queryParams.avatar = this.queryParams.avatar ? decodeURIComponent(this.queryParams.avatar) : ''
  },
  mounted () {
    this.loginInfo = JSON.parse(sessionStorage.getItem('login'))
    this.initPage()
  },
  methods: {
    async initPage () {
      await this.visitor()
      this.queryCardList()
    },
    async visitor () {
      return VHALL_ZK.$api.getVisitorInfo().then((res) => {
        this.visitorName = res.visitor_name
        this.visitorId = res.visitor_id
      }).catch((error) => {
        if (error.code === '60004') {
          this.$router.replace('/empty')
        }
      })
    },
    async regActivity () {
      const shareId = (this.loginInfo ? this.loginInfo.consumer_user_id : '') || this.visitorId
      return VHALL_ZK.$api.joinActivity({
        activity_id: this.activity_id, // 活动id
        join_source: 4, // 参会来源页：1.官网，2.引导页，3.观看页，4.邀请卡
        share_id: shareId || '' // 分享人id
      }).then((res) => { // 获取参会信息
        console.log(res)
      }).catch((err) => {
        if (err.code === 12031) {
          this.$router.replace('/kicked')
        }
      })
    },
    queryCardList () {
      this.inviteCardList = []
      VHALL_ZK.$api.getInviteCardList(this.activity_id).then((res) => {
        if (res.code === 200) {
          let arr = []
          res.data.forEach((item) => {
            item.template = JSON.parse(item.template)
            item.coverImg = ''
            item.title = item.title.replace(/"/g, '＂')
            item.title = item.title.replace(/“/g, '＂')
            item.title = item.title.replace(/”/g, '＂')
            arr.push(item)
          })
          this.inviteCardList = arr
          this.$nextTick(() => {
            this.dealWithShowEle()
          })
        }
      })
    },
    async dealWithShowEle () {
      this.showTimeOut = false
      this.preViewList = []
      let eleList = this.$refs.showMode.querySelectorAll('.phone-card')
      this.$loading({
        loadingText: '邀请卡生成中...'
      })
      clearTimeout(this.timeOut)
      this.timeOut = setTimeout(() => {
        this.$loading(false)
        clearTimeout(this.timeOut)
        this.timeOut = null
        this.showTimeOut = true
      }, 10000)
      for (let i = 0; i < eleList.length; i++) {
        await this.drewCanvas(eleList[i], i)
        this.$loading(false)
        this.showTimeOut = false
        clearTimeout(this.timeOut)
        this.timeOut = null
      }
    },
    async drewCanvas (dom, idx) {
      let _this = this
      let imgList = dom.querySelectorAll('img')
      let count = 0
      return new Promise((resolve) => {
        if (!Array.isArray(imgList)) {
          imgList = Array.from(imgList)
        }
        imgList.forEach((img) => {
          let imaObj = new Image()
          imaObj.setAttribute('crossorigin', 'anonymous')
          const canvasGen = function () {
            if (imgList.length === count) {
              Html2canvas(dom, {
                allowTaint: true,
                useCORS: true,
                logging: false,
                scale: 3
              }).then((canvas) => {
                _this.preViewList.push({
                  coverImg: canvas.toDataURL(),
                  card_id: _this.inviteCardList[idx].card_id
                })
                resolve()
              })
            }
          }
          imaObj.onerror = function (e) {
            count++
            canvasGen()
          }
          imaObj.onload = function () {
            count++
            img.src = imaObj.getBase64Image()
            canvasGen()
          }
          imaObj.src = img.getAttribute('hsrc')
        })
      })
    },
    goLivePage () {
      let shareId = this.$route.query.shareId
      if (shareId) {
        this.$router.push(`/watch/${this.activity_id}?shareId=${shareId}`)
      } else {
        this.$router.push(`/watch/${this.activity_id}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~assets/css/mixin.scss';
  .invite-card {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .time-out {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background-color: rgba(0, 0, 0, .7);
      z-index: 3000;
      .time-out-con {
        position: absolute;
        top: 46%;
        left: 50%;
        transform: translateX(-50%);
        .time-show {
          line-height: 50px;
          color: #fff;
          z-index: 3000;
        }
        .primary-button {
          display: block;
          margin: 30px auto 0 auto;
          width: 240px;
          height: 80px;
          border-radius: 40px;
          font-size: 28px;
        }
      }
    }
    &:before {
      display: block;
      content: '';
      width: 100%;
      height: 100%;
      background-color: #000;
      opacity: .8;
    }
    .show-mode {
      position: absolute;
      top: 0;
      left: 10000px;
      width: 100000px;
      height: 567px;
      .phone-card {
        display: inline-block;
        width: 360px;
        height: 567px;
        margin-right: 10px;
      }
    }
    .phone-card {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: #F6F6F6;
      overflow: hidden;
      .cover-img{
        width: 100%;
        height: 100%;
      }
      .drag-item {
        position: absolute;
        z-index: 2;
      }
      .user-info {
        height: 40px;
        line-height: 40px;
        border-radius: 20px;
        background-color: rgba(0, 0, 0, .3);
        padding: 0 10px 0 8px;
        color: #fff;
        user-select: none;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 80%;
        .avatar-icon {
          display: inline-block;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          vertical-align: middle;
          &.default-icon{
            background-color: #fff;
            background-size: cover;
            background-position: center center;
            background-image: url("../../assets/image/avatar@2x.png");
          }
        }
        span{
          display: inline-block;
          font-size: 14px;
          line-height: 40px;
          vertical-align: middle;
          margin-left: 4px;
          width: calc(100% - 34px);
          float: right;
        }
        .nick-name{
          display: inline-block;
          font-size: 14px;
          height: 14px;
        }
      }
      .bg-img {
        width: 100%;
        height: 100%;
      }
      .img-bg-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 1px dashed #888;
      }
      .qr-code {
        left: 10px;
        top: 83%;
        font-size: 0;
        border-radius: 4px;
        user-select: none;
        img {
          display: inline-block;
          width: 40px;
          height: 40px;
          vertical-align: middle;
        }
        &.big{
          img{
            width: 140px;
            height: 140px;
          }
        }
        &.mid{
          img{
            width: 120px;
            height: 120px;
          }
        }
        &.small{
          img{
            width: 80px;
            height: 80px;
          }
        }
        .qr-tip {
          display: inline-block;
          width: calc(100% - 40px);
          vertical-align: middle;
          color: #fff;
          padding-left: 10px;
          span {
            display: block;
            font-size: 12px;
            line-height: 18px;
          }
        }
      }
      &:hover .cover-item {
        display: block;
        opacity: 1;
        transition: opacity .3s;
      }
      .cover-item {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .8);
        z-index: 10;
        text-align: center;
        opacity: 0;
        span {
          display: block;
          text-align: center;
          margin-top: 140px;
          font-size: 14px;
          line-height: 30px;
          color: #fff;
        }
        img {
          display: block;
          width: 130px;
          height: 130px;
          margin: 0 auto;
        }
        button {
          width: 140px;
          margin-top: 40px;
        }
      }
      &.default-one{
        .user-info{
          top: 20%;
          left: 34px;
          color: #333;
          padding: 0;
          font-size: 0;
          background-color: transparent;
          span{
            font-size: 14px;
            width: auto;
            float: none;
          }
        }
        .detail{
          top: 34%;
          left: 34px;
          .title{
            font-size: 18px;
            line-height: 20px;
            padding-right: 30px;
            text-align: justify;
            word-break: break-all;
          }
          .sub-title{
            margin-top: 20px;
            font-size: 14px;
            line-height: 18px;
            margin-right: 26px;
            word-break: break-all;
          }
          .sub-time{
            font-size: 14px;
            line-height: 30px;
          }
        }
        .qr-code{
          top: 77%;
          left: 68px;
          padding: 0;
          background-color: transparent;
          img{
            width: 50px;
            height: 50px;
          }
          .qr-tip{
            width: calc(100% - 50px);
            color: #333;
          }
        }
      }
      &.default-two{
        .card-content{
          position: absolute;
          top: 53%;
          width: 100%;
          padding: 0 30px;
          text-align: center;
          .user-info{
            position: relative;
            padding: 0;
            color: #333;
            font-size: 0;
            max-width: 100%;
            background-color: transparent;
            span{
              font-size: 14px;
              width: auto;
              float: none;
            }
          }
          .detail{
            position: relative;
            margin-top: 6px;
            .title{
              font-size: 18px;
              line-height: 20px;
              text-align: center;
              word-break: break-all;
              span{
                display: inline-block;
                text-align: justify;
              }
            }
            .sub-title{
              margin-top: 10px;
              font-size: 12px;
              line-height: 20px;
              word-break: break-all;
            }
            .sub-time{
              font-size: 12px;
            }
          }
        }
        .qr-code{
          position: absolute;
          top: 84%;
          left: 20vw;
          padding: 6px;
          background-color: transparent;
          border: solid 1px #e2e2e2;
          width: auto;
          height: auto;
          img{
            width: 50px;
            height: 50px;
          }
          .qr-tip{
            width: calc(100% - 50px);
            color: #333;
            text-align: justify;
            padding-left: 8px;
          }
        }
      }
    }
    .card-list {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 520px;
      height: 1000px;
      transform: translate3d(-50%,-50%, 0);
      text-align: center;
      .card-tip {
        display: inline-block;
        font-size: 28px;
        color: #999;
      }
      .card-box {
        width: 500px;
        height: 860px;
        margin-top: 20px;
        overflow: hidden;
        .phone-img {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .cover-img{
            width: 100%;
          }
        }
      }
      .primary-button {
        width: 300px;
        height: 80px;
        font-size: 28px;
        border-radius: 40px;
        margin-top: 6px;
      }
    }
    /deep/ {
      .mint-swipe{
        overflow: visible;
        .mint-swipe-items-wrap{
          overflow: visible;
        }
      }
      .mint-swipe-indicators {
        bottom: 4px;
        .mint-swipe-indicator {
          opacity: .8;
          &.is-active {
            background-color: #FFD021;
          }
        }
        .mint-swipe-items-wrap > div {
          display: block;
        }
      }
    }
  }
</style>
