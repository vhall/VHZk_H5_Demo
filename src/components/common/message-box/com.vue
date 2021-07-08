<template>
  <transition name="fade" v-if="visible">
    <div :class="['ve-message-box__wrapper']">
      <div v-if="this.$slots.msgBox" class="ve-message-box custom-box">
        <slot name="msgBox"></slot>
      </div>
      <div v-else class="ve-message-box" :style="{width: width}" :type="type">
        <div class="ve-message-box__header">
          <span v-if="type=='prompt'" class="prompt-title">{{header}}</span>
          <button type="button" @click.prevent="handleClick(action.cancel)" v-if="type !== 'noneClose'">
            <i class="iconfont icon-close1"></i>
          </button>
        </div>
        <div class="ve-message-box__container">
          <div class="ve-message-box__title" v-if="!this.$slots.header&&header&&type!=='prompt'">{{header}}</div>
          <slot name="header"></slot>
          <div class="ve-message-box__content" v-if="(!this.$slots.default||this.$slots.default.length==0)&&content">
            {{content}}
          </div>
          <slot></slot>
          <div class="ve-message-box__btns">
            <div v-if="!this.$slots.bottom">
              <button v-if="confirmText" type="button" class="button--primary" @click.prevent="handleClick(action.confirm)">
                <span>{{confirmText}}<span v-if="autoClose" class="auto-close">({{closeTime}}s)</span></span>
              </button>
              <button type="button" class="button--cancel" @click.prevent="handleClick(action.cancel)"
                      v-if="cancelText">
                <span>{{cancelText}}</span>
              </button>
            </div>
            <slot name="bottom"></slot>
          </div>
        </div>
      </div>
      <div class="ve-modal" v-if="type === 'noneModal' || type === 'noneClose'"></div>
      <div class="ve-modal" v-else @click.prevent="handleClick(action.cancel)"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'message-box',
  data () {
    return {
      visible: true,
      closeTime: 0,
      intervalTime: 0,
      action: {
        cancel: 'cancel',
        confirm: 'confirm'
      }
    }
  },
  props: {
    header: {
      type: String,
      default: '提示'
    },
    content: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: ''
    },
    autoClose: {
      type: Number,
      default: 0
    },
    width: {
      type: String,
      default: '300px'
    },
    type: { // prompt , error, noneModal, save, noneClose, single
      type: String,
      default: ''
    }
  },
  watch: {
    autoClose: {
      handler (newVal) {
        if (!newVal) return
        this.closeTime = newVal
        clearInterval(this.intervalTime)
        this.intervalTime = setInterval(() => {
          this.closeTime--
          if (!this.closeTime) {
            clearInterval(this.intervalTime)
            this.$emit('handleClick', {
              action: 'cancel'
            })
          }
        }, 1000)
      },
      immediate: true
    }
  },
  destroyed () {
    clearInterval(this.intervalTime)
  },
  methods: {
    handleClick (action) {
      this.$emit('handleClick', {
        action: action
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'assets/css/mixin.scss';

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .ve-message-box__wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 2200;
    .ve-modal {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: .7;
      background: #000;
    }
    .ve-message-box {
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding-bottom: 10px;
      background-color: #fff;
      border-radius: 10px;
      font-size: 28px;
      overflow: hidden;
      z-index: 1006;
      &[type='save']{
        &:before{
          display: none;
        }
        .ve-message-box__container .ve-message-box__title {
          margin-top: 30px;
          text-align: center;
          color: #222;
          font-size: 36px;
          font-weight: 600;
        }
        .ve-message-box__btns{
          padding: 0 20px;
          margin-bottom: 40px;
          margin-top: 60px;
        }
      }
      &:before {
        display: block;
        content: '';
        position: relative;
        top: -1px;
        height: 6px;
        background-color: $color-default;
      }
      &[type='error']:before {
        background-color: $color-red;
      }
      &[type='prompt'] {
        &:before {
          display: none;
        }
        .ve-message-box__header {
          height: 40px;
          line-height: 40px;
          background-color: $color-default;
        }
        .prompt-title {
          font-size: 30px;
        }
      }
      &[type='single'] {
        border-radius: 20px;
        &:before {
          display: none;
        }
        .ve-message-box__container .ve-message-box__title {
          text-align: center;
          margin: 40px 0 10px 0;
          color: $color-red;
          font-size: 38px;
        }
        .ve-message-box__header button {
          display: none;
        }
        .ve-message-box__container {
          padding: 10px 40px 40px 40px;
          .ve-message-box__content {
            text-align: center;
            font-size: 32px;
            line-height: 50px;
            padding: 0;
            margin: 10px 0 0 0;
          }
          .ve-message-box__btns {
            margin-top: 50px;
            text-align: center;
            .button--primary {
              width: 100%;
              padding: 0;
              margin: 0;
              border-radius: 50px;
              span {
                font-family: '宋体';
              }
            }
          }
        }
      }
      .ve-message-box__container {
        padding: 10px 20px 20px 20px;
        font-size: 28px;
        text-align: left;
        .ve-message-box__title {
          font-size: 34px;
        }
      }
      .ve-message-box__header {
        position: relative;
        padding: 0 20px;
        padding-bottom: 10px;
        text-align: left;
        button {
          position: absolute;
          top: 15px;
          right: 15px;
          padding: 0;
          border: none;
          outline: none;
          background: transparent;
          font-size: 28px;
          cursor: pointer;
        }
      }
      .ve-message-box__content {
        font-size: 28px;
        padding: 40px 0;
      }
      .ve-message-box__btns {
        text-align: right;
        margin-top: 10px;
        .auto-close {
          padding-left: 6px;
        }
        button {
          display: inline-block;
          height: 80px;
          line-height: normal;
          white-space: nowrap;
          cursor: pointer;
          border: none;
          -webkit-appearance: none;
          text-align: center;
          box-sizing: border-box;
          outline: none;
          font-weight: 500;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          padding: 0 40px;
          margin: 0 20px;
          border-radius: 40px;
          color: #222222;
          background: transparent;
          transition: all 0.3s;
          font-size: 28px;
        }
        button:last-child {
          margin-right: 0;
        }
        .button--primary {
          background: $color-default;
          span {
            font-family: '宋体';
          }
          &[type='save']{
            width: 100% !important;
            margin: 0;
            height: 90px;
            line-height: normal;
            border-radius: 45px;
          }
          &:hover {
            background: $color-default-hover;
          }
          &:active {
            background: $color-default-active;
          }
          &[type='error'] {
            background-color: $color-red;
            &:hover {
              background: $color-red-hover;
            }
            &:active {
              background: $color-red-active;
            }
          }
        }
        .button--cancel {
          padding: 0 20px 0 0;
        }
      }
    }
    .custom-box{
      padding: 0;
      background-color: transparent;
      &:before {
        display: none;
      }
    }
    .none-data{
      display: block;
      width: 100%;
      line-height: 40px;
      text-align: center;
      color: #8E9198;
    }
    .icon-close1 {
      font-size: 40px;
      color: #888888;
      position: relative;
      top: -4px;
    }
  }
</style>
