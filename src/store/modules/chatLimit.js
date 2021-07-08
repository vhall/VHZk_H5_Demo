/*
 * @Author: xu_qingzhao@126.com
 * @Description: 聊天限制的总线操作
 * @Date: 2021-04-29 15:43:00
 * @Last Modified time: 2021-04-29 15:44:09
 */
import * as types from '../mutation-types'

const chatLimitModules = {
  namespaced: true,
  state: {
    hideFullScreenEffect: false,
    chatOnlyHost: false,
    mute: false, // 用户被禁言
    allMuted: false // 全体禁言
  },
  mutations: {
    [types.SWITCH_FULLSCREENEFFECT] (state, reLoad) {
      state.hideFullScreenEffect = reLoad
    },
    [types.SWITCH_CHATONLYHOST] (state, reLoad) {
      state.chatOnlyHost = reLoad
    },
    [types.CHAT_MUTE](state, reLoad) {
      state.mute = reLoad
    },
    [types.CHAT_AllMUTE](state, reLoad) {
      state.allMuted = reLoad
    }
  }
}

export default chatLimitModules
