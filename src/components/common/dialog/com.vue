<template>
  <div class="com-dialog" v-show="visible" @click.prevent="wrapClose">
    <transition name="fade" >
      <div class="dialog-wrap" v-show="innerVisible" @click.stop="()=>{}">
        <div class="dialog-header" :class="{'align-center':center}">
          <span class="title" v-if="!$slots.header&&header">{{header}}</span>
          <slot name="header"></slot>
          <i @click.prevent="handleClose" class="iconfont icon-close1"></i>
        </div>
        <div class="dialog-body">
          <span v-if="!$slots.default" >{{content}}</span>
          <slot></slot>
        </div>
        <div class="dialog-footer" :class="{'align-center':center}">
          <slot name="footer"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ComDialog',
  props: {
    header: String,
    content: String,
    center: Boolean,
    visible: Boolean,
    beforeClose: Function,
    dialogClose: Boolean
  },
  data () {
    return {
      innerVisible: false
    }
  },
  methods: {
    wrapClose () {
      if (this.dialogClose) {
        this.handleClose()
      }
    },
    handleClose () {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    },
    hide () {
      this.innerVisible = false
      this.$emit('update:visible', false)
      this.$emit('close')
    }
  },
  watch: {
    visible: {
      handler (value) {
        if (value) {
          setTimeout(() => {
            this.innerVisible = value
          }, 50)
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .com-dialog /deep/ {
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.3s;
    }

    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
    position: fixed;
    z-index: 3000;
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .dialog-wrap {
      width: 30%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      border-radius: 2px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      box-sizing: border-box;
      color: #606266;
      font-size: 14px;
      .align-center {
        text-align: center;
      }
      .dialog-header {
        padding: 20px;
        padding-bottom: 10px;
        font-size: 18px;
        color: #303133;
        .icon-close1 {
          position: absolute;
          cursor: pointer;
          top: 20px;
          right: 20px;
          font-size: 40px;
          color: #666;
          &:hover {
            color: #888;
          }
        }
      }
      .dialog-body {
        padding: 30px 20px;
      }
    }
  }
</style>
