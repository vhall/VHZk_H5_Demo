<template>
  <div class="watch-play-box vertical-play">
    <section class="cover-play" v-if="!isPlay" @touchstart="clickScreen">
      <div :style="{backgroundImage:`url(${imageSrc})`}" class="image-bg"></div>
      <i class="play-btn"></i>
    </section>
    <section class="play-video-section">
      <play-video role="watcher"
                  :screenVertical="true"
                  :playType="playType"
                  :startInit="startInit"
                  :isDoc="isDoc"
                  ref="refPlay"
                  @coverImg="coverImg"
                  @clickVideo="clickVideo"></play-video>
    </section>
    <section class="chat-section"
             :class="{'chat-section-vertical': onlyVideo}"
             v-if="playType!=='end'">
      <chat ref="chatbox"
            :type="playType"
            :screenVertical="true"
            @closeChatBox="closeChatBox"
            @isMute="isMute($event)"></chat>
    </section>
    <transition name="fade" mode="out-in">
      <section class="icon-list-section" v-if="!onlyVideo">
        <ul class="icon-list">
          <li class="icon-list-item" v-if="isDoc">
            <span class="doc-live" @click="showDoc">
              <i class="tool-btn-icon doc-icon"></i>
            </span>
          </li>
          <li class="icon-list-item" v-for="(toolIcon, idx) in toolIconList" :key="idx">
            <span class="ques" v-if="toolIcon.type == 'ques'" @click='clickQues'><em v-if="toolIcon.redIcon"></em></span>
            <span class="lottery" v-if="toolIcon.type == 'lottery'" @click='clickLottery'></span>
            <span class="redpack" v-if="toolIcon.type == 'red_packet'" @click='clickRedpack'><em></em></span>
            <span class="invite-card" v-if="toolIcon.type == 'invite-card' && buttonSettings.showInviteCard" @click="goCard"></span>
            <span class='doc-download' v-if="toolIcon.type == 'doc-download'" @click="docDownload"></span>
          </li>
        </ul>
      </section>
    </transition>
    <transition name="fade" mode="out-in">
      <section class="bottom-section" v-if="!onlyVideo">
        <div class="tool-btn tool-menu" title="更多" @click="showMore">
          <i class="iconfont icon-caidan"></i>
        </div>
        <template v-if='isLogin'>
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
        <!-- 问答图标 -->
        <div class="tool-btn tool-questions" v-if="showQuestionsIcon" title="问答" @click="triggerQuestionsMenu">
          <em class="tip" v-show="questionTip"></em>
          <i class="tool-btn-icon questions-icon"></i>
        </div>
        <!-- 聊天过滤 -->
        <div class="tool-btn tool-more" title="聊天过滤" @click.stop="openChatFilter">
          <i class="iconfont icon-gengduo-tianchong"></i>
        </div>
        <div class="tool-btn tool-zan" title="点赞" @touchstart="clickZan">
          <em class="tips" style="font-size: 10px;" v-if="zanNumShow">{{zanNumShow}}</em>
          <i class="tool-btn-icon zan-icon"></i>
        </div>
      </section>
    </transition>
    <section class="main-section" @click="openMenu = false" v-show="openMenu && !onlyVideo">
      <div class="custom-menu-tabs" @click.stop="openMenu = true" >
        <div class="menu-tab">
          <ul class="tabs-wrap" :class="{center: tapList.length === 2}">
            <li class="tab-item"
                :class="{active: chooseTab === index}"
                v-for="(item, index) in tapList"
                v-show="item.show == 1"
                :key="index"
                @click.stop="tabChange(item.inside, index)">
                <span>{{item.name}}
                <span class="news-tip" v-if="item.news"></span>
              </span>
            </li>
          </ul>
        </div>
        <div class="menu-content" @click.stop="">
          <div class="content"
              :class="{'questions-content-box': item.inside === 'questions', active: chooseTab === index}"
              v-for="(item, index) in tapList"
              :key="index" >
            <template v-if="item.inside === 'des' || item.inside === 'manul'">
              <div class="des-box" v-if="item.content" v-html="item.content"></div>
              <div class="none-data" v-else>
                <div class="empty-img"></div>{{$t('common.暂无数据')}}
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
          </div>
        </div>
      </div>
    </section>
    <!-- H5页面聊天弹出框 -->
    <send-h5 ></send-h5>
    <doc-watch ref="docWatch"
               :screenVertical="true"
               :play-type="playType"></doc-watch>
    <!-- 推荐卡片 -->
    <com-cards v-if="cardData.show"
               :cardData="cardData"
               @closeCards='closeCards'></com-cards>
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
        <img src="../../../assets/image/success@2x.png">
        <p class="fsc">已提交问卷，感谢您的参与</p>
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
          :class="{'titleCenter': downLoadSettingMethod == 3 || (!downloadDocInfo && !downloadContext && !downloadTitle)}"
          ref="downloadSetting"
          v-html="downloadContent">
        </div>
        <button
          class="control-btn"
          @click="downloadFile"
          v-if="((condition == 1) || (condition == 2 && isShare) || (condition == 3 && isSendQr)) && (downloadDocInfo || downloadContext || downloadTitle)">
            {{downloadControlName}}</button>
        <button class="control-btn" v-if="!loginInfo" @click="clickLoginUser">马上登录</button>
        <button class="control-btn" @click="showTipPic" v-if="loginInfo && condition == 2 && !isShare">立即分享</button>
        <button class="control-btn" @click="immInputQuestions" v-if="loginInfo && condition == 3 && !isSendQr">马上填写</button>
      </div>
    </div>
    <ChatFilter />
  </div>
</template>
<script>
import PlayContentMixin from './play-content-mixin'
export default {
  name: 'vertical-play-content',
  mixins: [PlayContentMixin],
  data () {
    return {
      is_portrait: 'Y',
      onlyVideo: false,
      openMenu: false,
      imageSrc: '',
      tapList: []
    }
  },
  methods: {
    showDoc () {
      if (this.isDocing) {
        this.$refs.docWatch && this.$refs.docWatch.switchDoc()
      } else {
        this.$toast('暂无文档播放')
      }
    },
    showMore () {
      this.openMenu = true
      /* 选中简介 */
      this.$nextTick(() => {
        let obj = this.tapList[this.chooseTab]
        if (obj) {
          this.tabChange(obj.inside, this.chooseTab)
        }
      })
    },
    clickScreen () {
      if (this.$refs.refPlay) {
        this.$refs.refPlay.play(true)
      }
    },
    coverImg (cover) {
      this.imageSrc = cover
    },
    clickVideo () {
      if (this.playType === 'vod' || this.playType === 'warm') {
        this.onlyVideo = !this.onlyVideo
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'css/vertical-play-content';
</style>
