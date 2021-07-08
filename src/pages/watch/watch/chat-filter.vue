<template>
  <div class="mask" v-if="visible" @click.stop="handleClickCancel">
    <transition name="top-bottom">
      <template v-if="visible">
        <div class="sheet" @click.stop="">
          <div class="sheet__content">
            <div
              class="control-item-buttom"
              :class="{ checked: chatOnlyHost }"
              @click.stop="changeFilter(1)"
            >
              只看主办方
            </div>
          </div>
          <div class="sheet__cancel-button" @click.stop="handleClickCancel">
            关闭
          </div>
        </div>
      </template>
    </transition>
  </div>
</template>
<script>
import EventBus from 'src/utils/eventBus.js'
import { mapMutations, mapState } from 'vuex'
import * as types from 'src/store/mutation-types'
export default {
  name: 'ChatFilter',
  data() {
    return {
      visible: false
    }
  },
  created() {
    this.initEventBus()
  },
  methods: {
    ...mapMutations('chatLimit', {
      switchFullScreenEffect: types.SWITCH_FULLSCREENEFFECT,
      switchChatOnlyHost: types.SWITCH_CHATONLYHOST
    }),
    initEventBus() {
      EventBus.$on('OPEN_CHAT_FILTER', () => {
        this.visible = true
      })
    },
    handleClickCancel() {
      this.visible = false
    },
    changeFilter(idx) {
      if (idx === 1) {
        this.switchChatOnlyHost(!this.chatOnlyHost)
      } else if (idx === 2) {
        const isHide = !this.hideFullScreenEffect
        if (isHide) {
          EventBus.$emit('HIDE_FULL_SCREEN_EFFECT')
        }
        this.switchFullScreenEffect(isHide)
      }
    }
  },
  computed: {
    ...mapState('chatLimit', {
      hideFullScreenEffect: state => state.hideFullScreenEffect,
      chatOnlyHost: state => state.chatOnlyHost
    })
  }
}
</script>
<style lang="scss" scoped>
@import 'assets/css/mixin.scss';
.mask {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(#000, 0.4);
  z-index: 400;
}
.sheet {
  width: 100%;
  position: fixed;
  bottom: 0;
  min-height: 110px;
  color: #555;
  z-index: 30;
}
.sheet__content {
  background: #f7f7f7;
  border-radius: 30px 30px 0px 0px;
  padding: 25px 45px;
  .control-item-buttom {
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 30px;
    color: #222;
    &.checked {
      $checkedColor: #c7a000;
      color: $checkedColor;
    }
  }
}
.sheet__cancel-button {
  height: 110px;
  line-height: 110px;
  font-size: 32px;
  background: #fff;
  text-align: center;
  color: #222;
}
</style>
