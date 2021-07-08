<template>
  <div class="watch-play-box">
    <section class="play-video">
      <play-video role="watcher"
                  :showPersonCount="showPersonCount"
                  :playType="playType"
                  :isDoc="isDoc"
                  :startInit="startInit"></play-video>
    </section>
    <section v-show="domShow" class="play-content">
      <div class="v-nav" :class="{'center-menu': tapList.length <= 2, 'rect-nav': goodsVisInfo.box_recommend_status == 1 && goodsLen > 0}">
        <!--操作区 右侧固定icon-->
        <ul class="icon-list">
          <template v-for="(toolIcon, idx) in toolIconList">
            <li class="icon-list-item"
                :class="{'icon-item-01': idx === 3, 'icon-item-02': idx === 4, 'icon-item-03': idx === 5}"
                :key="idx">
              <span class="ques" v-if="toolIcon.type == 'ques'" @click='clickQues'><em v-if="toolIcon.redIcon"></em></span>
              <span class="lottery" v-if="toolIcon.type == 'lottery'" @click='clickLottery'></span>
              <span class="redpack" v-if="toolIcon.type == 'red_packet'" @click='clickRedpack'><em></em></span>
              <span class="invite-card" v-if="toolIcon.type == 'invite-card' && buttonSettings.showInviteCard && activityInfo.invite_card" @click="goCard"></span>
              <span class='doc-download' v-if="toolIcon.type == 'doc-download'" @click="docDownload"></span>
            </li>
          </template>
        </ul>
        <div class="custom-menu-tabs">
          <div class="menu-tab">
            <ul class="tabs-wrap" :class="{center: tapList.length == 2, padRight: tapList.length > 2}">
              <li class="tab-item"
                  :class="{active: chooseTab === index}"
                  v-for="(item, index) in tapList"
                  :key="index"
                  v-show="item.show == 1"
                  @click="tabChange(item.inside, index)">
                <span class="tab-name">{{item.name}}</span>
                <em class="news-tip" v-if="item.news"></em>
              </li>
            </ul>
          </div>
          <div class="menu-content">
            <div class="content"
                v-for="(item, index) in tapList"
                :class="{'chat-content-box': item.inside === 'chat', 'questions-content-box': item.inside === 'questions', active: chooseTab === index }"
                :key="index">
              <template v-if="item.inside === 'chat'">
                <div class="chat-content">
                  <chat ref="chatbox"
                        :class="{showKeyboard:sendBoxShow}"
                        :type="playType"
                        :isWatch="isWatch"
                        :sendBoxShow="true"
                        @chartMsg="chartMsg"
                        @closeChatBox="closeChatBox"
                        @isMute="isMute($event)"></chat>
                </div>
                <div class="v-chat-control" id="sendBoxBtn">
                  <template v-if='loginInfo.consumer_user_id'>
                    <template v-if='isMuteShow'>
                      <div class="v-chat-clickbox">{{$t('chat.当前禁止发言')}}</div>
                    </template>
                    <template v-else>
                      <div class="v-chat-clickbox" v-if="playType=='end' || playType=='vod'">{{$t('chat.当前禁止发言')}}</div>
                      <div class="v-chat-clickbox" v-else @touchstart="chatClick">{{`${$t('chat.聊点什么吧')}...`}}</div>
                    </template>
                  </template>
                  <template v-else>
                    <div class="v-chat-clickbox"><span class="user-login" @click="doLogin">「{{$t('chat.登录')}}」</span>{{$t('chat.参与')}}</div>
                  </template>
                  <span class="tool-icon-zone">
                    <div class="tool-btn tool-filter" title="聊天过滤" @click.stop="openChatFilter">
                      <i class="iconfont icon-gengduo-tianchong abs-c"></i>
                    </div>
                    <div class="tool-btn tool-zan" @touchstart="clickZan">
                      <em class="tips" style="font-size: 10px;" v-if="zanNumShow">{{zanNumShow}}</em>
                    </div>
                  </span>
                </div>
              </template>
              <template v-else-if="item.inside === 'doc'">
                <doc-watch ref="docWatch" :play-type="playType"></doc-watch>
              </template>
              <!-- 描述 -->
              <template v-else-if="item.inside === 'des'">
                <div class="des-box" v-if="activityInfo.description" v-html="activityInfo.description"></div>
                <div v-else>
                  <div class="empty-img"></div>
                  <span class="empty-txt">{{$t('common.暂无数据')}}</span>
                </div>
              </template>
              <!-- 直播 -->
              <template v-else-if="item.inside === 'live'">
                <live-menu :menu="item"/>
              </template>
              <!-- 推广 -->
              <template v-else-if="item.inside === 'promote'">
                <promote-menu :menu="item"/>
              </template>
              <!-- 排行榜 -->
              <template v-else-if="item.inside === 'list'">
                <template v-if="chooseTab === index">
                  <rank-menu :menu="item"/>
                </template>
              </template>
              <!-- 富文本菜单 -->
              <template v-else-if="item.inside === 'manul'">
                <div class="manul-content" v-html="item.content"></div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- H5页面聊天弹出框 -->
    <send-h5 ></send-h5>
    <!-- 推荐卡片 -->
    <com-cards v-if="cardData.show" :cardData="cardData" @closeCards='closeCards'></com-cards>
    <!-- 问卷 -->
    <transition  name="top-bottom"
                 mode="out-in">
      <com-questions :dragData="dragData"
                    v-if="questionsShow"
                    :naireId="naireId"
                    :visitorId="visiteInfo.visitor_id"
                    :questions="questions"
                    @questionSuccess="questionSuccess"> </com-questions>
    </transition>
    <message-box v-if="questionsSubmissionShow"
                 header=''
                 confirmText='提交'
                 class="v-questions-submission-box"
                 @handleClick="hiddenQuestions">
      <div class="v-content">
        <img src="../../../assets/image/success@2x.png"
             alt="">
        <p>已提交问卷，感谢您的参与</p>
      </div>
    </message-box>
    <div class="download-setting" v-if="showUpFileDownload" @click="showUpFileDownload = false">
      <div class="ve-modal"></div>
      <!--上传文件下载-->
      <div class="wrap">
        <div class="setting-title" v-text="downloadTitle"></div>
        <div class="setting-icon"></div>
        <div class="setting-tip">
          <span v-if="((condition == 1) || (condition == 2 && isShare) || (condition == 3 && isSendQr)) && (downloadDocInfo || downloadContext || downloadTitle)">文档准备完毕</span>
          <span class="limited" v-else-if="loginInfo && condition == 2 && !isShare">分享后可下载文档</span>
          <span class="limited" v-else-if="loginInfo && condition == 3 && !isSendQr">填写问卷后可下载文档</span>
        </div>
        <div
          class="file-download"
          :class="{'titleCenter': downLoadSettingMethod != 2 || (!downloadDocInfo && !downloadContext && !downloadTitle)}"
          ref="downloadSetting"
          v-html="downloadContent">
        </div>
        <button
          class="control-btn"
          @click="downloadFile"
          v-if="((condition == 1) || (condition == 2 && isShare) || (condition == 3 && isSendQr)) && (downloadDocInfo || downloadContext || downloadTitle)">{{downloadControlName}}</button>
        <button class="control-btn" v-if="!loginInfo" @click="clickLoginUser">马上登录</button>
        <button class="control-btn" @click="showTipPic" v-if="loginInfo && condition == 2 && !isShare">立即分享</button>
        <button class="control-btn" @click="immInputQuestions" v-if="loginInfo && condition == 3 && !isSendQr">马上填写</button>
      </div>
    </div>
    <ChatFilter />
  </div>
</template>
<script>
import EventBus from 'src/utils/eventBus'
import PlayContentMixin from './play-content-mixin'

export default {
  name: 'play-content',
  props: {
    domShow: Boolean
  },
  mixins: [PlayContentMixin],
  data () {
    return {
      is_portrait: 'N',
      isWatch: true, // 是否是观看端
      sendBoxShow: false, // 是否显示聊天输入窗口
      tapList: [],
      goodStockMsg: {
        id: '',
        stock: 0
      },
      rewardOPen: false, // 打赏弹层
      giftOPen: false // 礼物弹层
    }
  },
  methods: {
    showGoodList () {
      if (this.goodsLen === 0) {
        this.$toast(this.$t('goods.暂无商品'))
        return
      }
      /* 选中商品菜单 */
      this.tapList.every((item, idx) => {
        if (item.inside === 'goods') {
          this.tabChange(item.inside, idx)
          return false
        }
        return true
      })
    },
    loginHandler () {
      this.$emit('showLogin')
    },
    clickTech () {
      if (this.footerInfo.text && this.footerInfo.url) {
        window.open(this.footerInfo.url)
      }
    },
    chartMsg () { // 聊天消息
      this.newsMsg('chat')
    },
    closeGoodList () {
      this.goodsListShow = false
    },
    goodsCount (res) {
      this.goodsLen = res
      EventBus.$emit('skeletonEvent', {
        boxRect: parseInt(this.goodsVisInfo.box_recommend_status) === 1,
        len: this.goodsLen
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '~assets/css/mixin.scss';
  .fade-enter-active {
    transition: all 0.5s ease;
  }
  .fade-leave-active {
    transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .fade-enter,
  .fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
  }
  .watch-play-box {
    position: relative;
    width: 100%;
    height: 100%;
    .play-video {
      height: 422px;
    }
    .play-content {
      background-color: #fff;
      position: relative;
      height: calc(100% - 422px);
      /deep/{
        .v-nav {
          width: 100%;
          height: 100%;
          &.rect-nav {
            position: relative;
            height: calc(100% - 140px);
          }
        }
        .custom-menu-tabs{
          width:100%;
          height:100%;
          display:flex;
          flex-direction:column;
          .menu-tab{
            width:100%;
            height:80px;
            background-color: #fff;
            position:relative;
            @include border-1px($color-bd, bottom);
            .tabs-wrap{
              height:100%;
              overflow-x: scroll;
              overflow-y: hidden;
              touch-action: pan-x;
              text-align: center;
              white-space:nowrap;
              display: flex;
              flex-direction: row;
            }
            ::-webkit-scrollbar{
              display:none;
            }
            .center{
              justify-content: space-around;
            }
          }
          .menu-content{
            height: calc(100% - 80px);
            a {
              color: #3BB3FC;
            }
            i {
              font-style: italic;
            }
            img {
              max-width: 100%;
            }
          }
        }
        .tabs-wrap {
          font-size: 0;
          &:after {
            content: '';
            position:absolute;
            display: inline-block;
            top:0px;
            right: 0px;
            width: 40px;
            height: 80px;
            background-image: linear-gradient(90deg, rgba(255,255,255, 0) 0%,#FFFFFF 100%);
          }
          &:before {
            content: '';
            position:absolute;
            display: inline-block;
            top:0px;
            left: 0px;
            width: 40px;
            height: 80px;
            z-index: 1;
            background-image: linear-gradient(-90deg, rgba(255,255,255, 0) 0%,#FFFFFF 100%);
          }
          .tab-item{
            position: relative;
            display:inline-block;
            height: 80px;
            line-height: 80px;
            padding: 0 40px;
            .tab-num {
              display: inline-block;
              position: absolute;
              top: 4px;
              right: 10px;
              height: 28px;
              line-height: 28px;
              padding: 0 8px;
              border-radius: 14px;
              font-size: 24px;
              background-color: $color-red;
              color: #fff;
            }
            &.active {
              .tab-name{
                position:relative;
                display:inline-block;
                height: 100%;
              }
              .tab-name:after {
                content: "";
                display: block;
                position: absolute;
                bottom: 1px;
                left: 50%;
                margin-left: -20px;
                width: 40px;
                height: 5px;
                background-color: $color-default;
                border-radius:4px;
              }
              span{
                color: $color-default;
              }
            }
            span{
              font-family: PingFangSC-Regular;
              font-size: 30px;
              color: #333;
              letter-spacing: 0;
            }
            .news-tip {
              width: 20px;
              height: 20px;
              position: absolute;
              top: 10px;
              right: 20px;
              border-radius: 50%;
              background: #fc5659;
            }
          }
        }
        .menu-content {
          .content{
            display: none;
            position: relative;
            width:100%;
            height:100%;
            box-sizing: border-box;
            touch-action: pan-y;
            overflow-y: scroll;
            &.chat-content-box,
            &.questions-content-box {
              padding: 0;
            }
            .doc-warp {
              position: absolute;
              top: 0;
              left: 0;
              transform: translateY(0);
            }
          }
          .des-box {
            padding: 25px;
            word-break: break-all;
            text-align: justify;
            min-height: 80%;
          }
          .empty-img {
            width: 200px;
            height: 200px;
            margin: 160px auto 0 auto;
            background-image: url("~assets/image/nodata@2x.png");
            background-size: cover;
          }
          .empty-txt {
            display: block;
            text-align: center;
            color: #888;
            line-height: 80px;
            font-size: 28px;
          }
          .tech-header {
            margin-top: 64px;
            text-align: center;
          }
          .positionBottom{
            position:absolute;
            bottom:20px;
            left: 50%;
            margin-top: 0px;
            transform: translateX(-50%);
          }
          .manul-content {
            box-sizing: border-box;
            padding: 30px;
            height: 100%;
            word-break: break-all;
            text-align: justify;
            overflow-y: scroll;
            /deep/ img {
              display: block;
              max-width: 100% !important;
              margin: 0 auto;
            }
          }
          .active{
            display: block;
          }
          .v-chat-control {
            @include flex();
            position: fixed !important;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 100px;
            line-height: 99px;
            background-color: #fff;
            text-align: left;
            padding: 0 24px;
            @include border-1px(#e2e2e2, top);
            .icon-biaoqing {
              font-size: 36px !important;
              vertical-align: middle;
            }
            .v-chat-clickbox {
              flex: 1;
              display: inline-block;
              height: 70px;
              padding: 0 20px;
              line-height: 70px;
              border-radius: 30px;
              background-color: #f5f5f5;
              color: #bfbfbf;
              vertical-align: middle;
              font-family: "宋体";
              .user-login {
                color: #4b5afe;
              }
            }
            .tool-icon-zone {
              display: inline-block;
              margin-left: 24px;
            }
            .tool-btn{
              position: relative;
              display: inline-block;
              width: 70px;
              height: 70px;
              border-radius: 50%;
              background-color: gainsboro;
              vertical-align: middle;
              &.tool-goods {
                margin-left: 12px;
                margin-right: 5px;
                background: url('~assets/image/tools-circle-good.png') no-repeat center;
                background-size: cover;
              }
              &.tool-questions {
                margin-right: 5px;
                background: url('~assets/image/tools-questions-icon.png') no-repeat center;
                background-size: cover;
                .tip {
                  width: 18px;
                  height: 18px;
                  position: absolute;
                  right: 0;
                  background: #FC5659;
                  border-radius: 50%;
                }
              }
              &.tool-reward {
                margin-right: 5px;
                background: url('~assets/image/tools-reward-icon.png') no-repeat center;
                background-size: cover;
              }
              &.tool-gift {
                margin-right: 5px;
                background: url('~assets/image/tools-gift-icon.png') no-repeat center;
                background-size: cover;
              }
              &.tool-zan {
                background: url('~assets/image/tools-zan-icon.png') no-repeat center;
                background-size: cover;
              }
              &.tool-filter {
                background: rgba(#000, 0.3);
                i {
                  font-size: 42px;
                  color: #fff;
                  font-style: normal !important;
                }
              }
              .tips{
                display: block;
                position: absolute;
                top: -4px;
                right: -16px;
                height: 30px;
                line-height: 32px;
                padding: 0 8px;
                font-size: 20px;
                border-radius: 15px;
                background-color: $color-red;
                color: #fff;
              }
            }
            .icon-biaoqing {
              font-size: 30px;
              display: inline-block;
            }
          }
          .chat-content {
            width: 100%;
            height: calc(100% - 100px);
            word-break: break-all;
            overflow-x: hidden;
            overflow-y: hidden;
            .showKeyboard {
              .v-send-box-bg {
                left: 0;
              }
            }
          }
        }
        .v-subscribe {
          display: inline-block;
          width: 160px;
          height: 80px;
          background-color: #ffd021;
          color: #222222;
          text-align: center;
          line-height: 80px;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
  }
  .icon-list {
    position: absolute;
    top: 100px;
    right: 20px;
    width: 70px;
    z-index: 100;
    .icon-list-item {
      margin-bottom: 12px;
      &.icon-item-01 {
        position: absolute;
        top: 0;
        right: 86px;
      }
      &.icon-item-02 {
        position: absolute;
        top: 81px;
        right: 86px;
      }
      &.icon-item-03 {
        position: absolute;
        top: 180px;
        right: 86px;
      }
      span {
        display: inline-block;
        position: relative;
        color: transparent;
        width: 70px;
        height: 70px;
        display: block;
        border-radius: 200px;
        background: url('~assets/image/tools-circle-redpack.png') no-repeat center;
        background-size: 100%;
      }
      em {
        position: absolute;
        top: 3px;
        right: 3px;
        width: 20px;
        height: 20px;
        background: #fc5659;
        border-radius: 200px;
        color: #fff;
        font-size: 24px;
        text-align: center;
      }
      .ques {
        background-image: url('~assets/image/tools-circle-ques.png');
      }
      .invite-card{
        background-image: url('~assets/image/tools-circle-invite-card.png');
        em{
          display: inline-block;
          position: absolute;
          top: 76px;
          left: -5px;
          width: 100px;
          height: 34px;
          line-height: 34px;
          font-size: 24px;
          border-radius: 17px;
          text-align: center;
          background-color: #3BB3FC;
        }
      }
      .doc-download{
        background-image: url('~assets/image/tools-circle-download.png');
        em{
          display: inline-block;
          position: absolute;
          top: 76px;
          left: -15px;
          width: 120px;
          height: 34px;
          line-height: 34px;
          font-size: 24px;
          border-radius: 17px;
          text-align: center;
          background-color: #1BCAB7;
        }
      }
      .goods {
        background-image: url('~assets/image/tools-circle-good.png');
        em {
          width: 40px;
          height: 30px;
          line-height: 32px;
          right: -10px;
          top: 0;
          font-size: 24px;
        }
      }
      .redpack {
        position: relative;
        /*margin-bottom: 26px;*/
        .red-bag-btn-timer {
          display: block;
          position: absolute;
          top: 50px;
          left: -10px;
          width: 90px;
          height: 30px;
          line-height: 30px;
          font-size: 20px;
          border-radius: 17px;
          text-align: center;
          background-color: #fc5659;
          color: #fff;
        }
      }
      .lottery {
        position: relative;
        /*margin-bottom: 26px;*/
        background: url('~assets/image/tools-circle-lottery.png');
        background-size: 100%;
        .lottery-timer {
          display: block;
          position: absolute;
          top: 50px;
          left: -10px;
          width: 90px;
          height: 30px;
          line-height: 30px;
          font-size: 20px;
          border-radius: 17px;
          text-align: center;
          background-color: #FC5659;
          color: #fff;
        }
      }
    }
  }
  .goods-fade-enter-active {
    transition: all 0.1s ease;
    animation: goods-fade-in 0.1s;
  }
  .goods-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    animation: goods-fade-in 0.3s reverse;
  }
  .goods-fade-enter,
  .goods-fade-leave-to {
    transform: translateY(30px);
    opacity: 0;
  }
  @keyframes goods-fade-in {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  .goods_small_popover /deep/ {
    position: absolute;
    width: 150px;
    height: 210px;
    right: 24px;
    top: 188px;
    bottom: 262px;
    font-size: 0;
    border-radius: 8px;
    padding: 0;
    background-color: #F5F5F5;
    color: #eee;
    overflow: hidden;
    z-index: 21;
    .small-close {
      position: absolute;
      width: 36px;
      height: 36px;
      top: 8px;
      right: 8px;
      background-image: url("~assets/image/close.png");
      background-size: contain;
      background-repeat: no-repeat;
    }
    .goods-detail {
      position: relative;
      top: 0;
      width: 100%;
      height: 100%;
      padding: 0;
      .cov-img {
        display: block;
        width: 100%;
        height: 150px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        .brand-name {
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .right-item {
        width: 100%;
        height: 60px;
        margin-left: 0;
        padding: 0 8px;
        font-size: 28px;
        .item-title {
          word-break: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #222;
          max-width: 140px;
          font-size: 24px;
          height: 30px;
          line-height: 30px;
          font-family: '宋体';
        }
        .goods-price {
          height: auto;
          margin-top: -10px;
          line-height: 24px;
          .new-price {
            font-family: '宋体';
            font-size: 24px;
            line-height: 24px;
          }
        }
        .goods-price .old-price {
          display: none;
        }
        .goods-buy, .store-row {
          display: none;
        }
      }
    }
  }
  .goodsInfo {
    position: fixed;
    top: 522px;
    left: 0;
    width: 100%;
    height: calc(100% - 522px);
    background-color: #fff;
    overflow-y: auto;
    z-index: 102;
  }
  .tao-show {
    -webkit-user-select: auto;
    /deep/ {
      .ve-message-box {
        border-radius: 8px;
        .ve-message-box__header button {
          top: 24px;
          right: 24px;
        }
        .ve-message-box__container {
          .v-content {
            text-align: center;
            padding: 40px;
            &.tao-order {
              padding: 0;
              padding-top: 20px;
              padding-bottom: 17px;
            }
            p.title {
              font-size: 35px;
              color: #333333;
              margin-bottom: 30px;
            }
            p.dsc {
              color: #888;
              padding: 0 10px;
            }
            div.tao,
            textarea {
              word-break: break-all;
              -webkit-overflow-scrolling: touch;
              padding: 10px 16px;
              width: 580px;
              height: 225px;
              border: 1px solid rgba(153, 153, 153, 1);
              overflow: hidden;
              margin: 0 auto;
              text-align: left;
              font-size: 28px;
              line-height: 40px;
            }
            span {
              display: inline-block;
              width: 580px;
              height: 90px;
              line-height: 90px;
              background: rgba(255, 208, 33, 1);
              border-radius: 50px;
              font-size: 32px;
              color: #222;
              margin: 50px 0 38px 0;
            }
          }
          .ve-message-box__btns {
            display: none;
          }
        }
      }
      &.ios {
        .ve-message-box__container {
          .v-content {
            span {
              display: none;
            }
            p.dsc {
              padding: 0 10px;
              padding-top: 50px;
            }
          }
        }
      }
      &.fade-enter-active,
      .fade-enter-to {
        transition: unset;
      }
      &.fade-leave-active,
      .fade-leave-to {
        transition: unset;
      }
    }
  }
  .copy-show /deep/ {
    .ve-message-box {
      border-radius: 8px;
      .ve-message-box__container {
        .v-content {
          padding-top: 60px;
          img {
            width: 130px;
            height: 130px;
          }
          p {
            margin: 15px 0 40px 0;
            font-size: 30px;
            color: #333;
          }
          em {
            color: #888;
            font-size: 28px;
          }
        }
      }
    }
  }
  .v-questions-submission-box /deep/ {
    img {
      display: block;
      width: 122px;
      margin: 90px auto 0;
    }

    p {
      font-size: 32px;
      color: #222;
      text-align: center;
      margin: 30px auto 100px;
    }

    .ve-message-box {
      &:before {
        background-color: rgba(0, 0, 0, 0);
      }

      .ve-message-box__btns {
        display: none;
      }
    }
  }
  .order-box {
    text-align: center;
    font-size: 30px;
    .order-title {
      line-height: 100px;
      margin-bottom: 10px;
      color: #222;
      font-weight: bold;
    }
    .order-result {
      line-height: 90px;
      color: $color-red;
      @include border-1px($color-bd, bottom);
      @include border-1px($color-bd, top);
    }
    .order-other {
      margin-top: 20px;
      color: #666;
    }
    .order-box-btn {
      .default-button {
        display: inline-block;
        height: 60px;
        line-height: 62px;
        width: 200px;
        margin: 10px 20px;
        border-radius: 30px;
        font-size: 28px;
      }
    }
  }
  .download-setting{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 2200;
    .ve-modal{
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: .7;
      background: #000;
    }
    .wrap{
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 80%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      background-color: #fff;
      border-radius: 24px;
      font-size: 32px;
      overflow: hidden;
      z-index: 1006;
      color: #222222;
      line-height: 44px;
      display:flex;
      flex-direction:column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding: 33px 40px 50px 40px;
      .setting-title{
        height: 50px;
        font-size: 36px;
        font-weight: 400;
        color: #222222;
        line-height: 50px;
      }
      .setting-icon{
        margin-top: 28px;
        width:120px;
        height:120px;
        background: url('~assets/image/tools-circle-download2.png') no-repeat;
        background-position:center;
        background-size: 120px;
        border-radius:60px;
      }
      .setting-tip{
        font-size: 32px;
        text-align: justify;
        line-height: 44px;
        margin-top:24px;
        margin-bottom:40px;
        color: #0FBDAA;
        .limited{
          color: #FF8419;
        }
      }
      .file-download{
        color: #222222;
        min-height:32px;
        max-height:160px;
        width:100%;
        font-size: 32px;
        margin-bottom:40px;
        overflow-x:hidden;
        overflow-y:scroll;
        text-align: left;
        word-wrap: break-word;
        &.titleCenter{
          text-align: center;
        }
        /deep/ img {
          display:inline-block;
          width: 100%;
          height: auto;
        }
      }
      .control-btn{
        background: #FFD021;
        border-radius: 45px;
        height:90px;
        text-align:center;
        line-height: 90px;
        display:inline-block;
        width:100%;
        border:none;
        outline:none;
        font-size:34px;
        color:#222;
      }
    }
  }
  // 礼物和打赏的底部弹层
  .reward-box {
    width: 100%;
    height: calc(100% - 422px);
    min-height: 840px;
    position: absolute;
    left: 0;
    bottom: 0;
    background-image: linear-gradient(177deg, #FFF8EE 0%, #FFFFFF 100%);
    z-index: 130;
    .colro-bg { // UI颜色效果
      width: 341px;
      height: 244px;
      position: absolute;
      top: 0;
      right: 0;
      background: #FFF7DB;
      opacity: 0.46;
      filter: blur(50px);
      pointer-events: none;
    }
    .box-title {
      height: 80px;
      padding: 0 24px;
      font-size: 30px;
      line-height: 80px;
      font-family: '宋体';
      i {
        font-size: 40px;
        font-weight: bold;
      }
    }
  }
  .mint-popup /deep/ {
    background: transparent;
  }
</style>
