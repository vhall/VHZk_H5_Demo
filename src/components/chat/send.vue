<template>
  <transition name="top-bottom">
    <div
      class="v-send-box-bg"
      :class="{ chatOpen: chatOpen }"
      @click.stop="handleTouchMask"
    >
      <div class="send-box clearfix" id="sendBox" @click.stop="">
        <div class="bottom clearfix">
          <div class="face-icon">
            <i
              class="iconfont face-icon"
              :class="{ 'icon-biaoqing': !faceOpen, 'icon-keyboard': faceOpen }"
              @click.stop="changeFace"
              title="表情"
            ></i>
          </div>
          <com-input
            :value.sync="value"
            :placeholder="chatPlaceholder"
            :max-length="140"
            class="inp"
            type="input"
            @focus="handleInputFocus"
          >
          </com-input>
          <button
            class="send-btn fr"
            :class="{ disabled: this.value == '' }"
            @click="send"
          >
            发送
          </button>
        </div>
      </div>
      <!-- 表情 -->
      <transition name="top-bottom">
        <div class="v-emoji" v-if="faceOpen">
          <div class="face-box" @click.stop="">
            <img
              :src="
                `//cnstatic01.e.vhall.com/static/img/arclist/Expression_${index +
                  1}@2x.png`
              "
              @click.stop="inFace(index)"
              v-for="(item, index) in faceArr"
              :key="index"
            />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
import EventBus from 'src/utils/eventBus.js'
export default {
  data() {
    return {
      chatOpen: false,
      sendOpen: false,
      chatType: 'chat',
      value: '',
      faceOpen: false,
      chatPlaceholder: '说点什么吧...' /* 表情数组 */,
      faceArr: [],
      isQuestion: false
    }
  },
  mounted() {
    this.faceArr = VHALL_ZK.$chat.getEmojiArr()
    EventBus.$on('chatOpen', openFace => {
      this.isQuestion = false
      this.chatType = 'chat'
      this.openChat(openFace)
    })
    EventBus.$on('privateChatOpen', openFace => {
      this.isQuestion = false
      this.chatType = 'privateChat'
      this.openChat(openFace)
    })
    EventBus.$on('questionOpen', openFace => {
      this.isQuestion = true
      this.openChat(openFace)
    })
    EventBus.$on('chatClose', () => {
      this.chatOpen = false
    })
  },
  methods: {
    openChat(openFace) {
      this.chatOpen = true
      this.sendOpen = true
      this.$nextTick(() => {
        if (openFace) {
          this.faceOpen = true
          document.getElementsByClassName('inp')[0].children[0].blur()
        } else {
          this.faceOpen = false
          document.querySelector('#sendBox .inp input').focus()
        }
      })
    },
    changeFace() {
      this.faceOpen = !this.faceOpen
    },
    send() {
      if (this.isQuestion) {
        EventBus.$emit('sendQuestion', {
          content: this.value
        })
      } else {
        if (this.chatType === 'privateChat') {
          EventBus.$emit('sendPrivateChatMsg', {
            content: this.value
          })
        } else {
          EventBus.$emit('sendChatMsg', {
            content: this.value
          })
        }
      }
      this.chatOpen = false
      this.value = ''
      document.getElementsByClassName('inp')[0].children[0].blur()
    },
    /* 选择表情 */
    inFace(index) {
      for (let key in this.faceArr[index]) {
        this.value += key
      }
      this.faceOpen = !this.faceOpen
      // document.getElementsByClassName('inp')[0].children[0].focus()
    },
    handleInputFocus() {
      this.faceOpen = false
    },
    handleTouchMask() {
      if (this.faceOpen) {
        this.faceOpen = false
      } else {
        this.chatOpen = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-send-box-bg {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  z-index: 9998;
  transform: translateY(-500%);
  &.chatOpen {
    transform: translateY(0);
  }
  .send-box {
    margin: 0 auto;
    width: 100%;
    position: absolute;
    bottom: 0;
    background-color: #fff;
    // border-radius: 8px;
    padding: 14px 24px;
    // overflow: hidden;
    z-index: 9999;
    .bottom {
      .face-icon {
        display: inline-block;
        width: 52px;
        height: 52px;
        font-size: 48px;
        color: #999;
        vertical-align: top;
        margin-right: 10px;
      }
      .inp /deep/ {
        width: 100%;
        height: 72px;
        width: 462px;
        border-radius: 36px;
        border: none;
        input {
          border: none;
          background: #f7f7f7;
          border-radius: 36px;
          height: 100%;
          padding-left: 30px;
          padding-right: 30px !important; // 覆盖组件的样式
        }
        .limit {
          display: none;
        }
      }
      .send-btn {
        width: 140px;
        height: 72px;
        background: #ffd021;
        border-radius: 36px;
        border: none;
      }
    }
  }
  .v-emoji {
    position: absolute;
    width: 100%;
    bottom: 100px;
    height: 240px;
    background: #fff;
    .face-box {
      -webkit-overflow-scrolling: touch;
      position: absolute;
      bottom: 0;
      // left: 0;
      width: 100%;
      height: 240px;
      z-index: 10;
      overflow-y: scroll;
      padding: 0 10px;
      img {
        width: 48px;
        height: 48px;
        margin: 6px;
        float: left;
        cursor: pointer;
      }
    }
  }
}
</style>
