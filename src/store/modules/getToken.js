import * as types from '../mutation-types'

const tokenMagerModules = {
  namespaced: true,
  state: {
    chatParams: {
      token: '',
      appId: '',
      channelId: '',
      accountId: ''
    }, // 聊天+暖场+回放 token
    liveParams: {} // 直播 token
  },
  getters: {
    chatParams: (state) => {
      let _chatParams = state.chatParams ? state.chatParams : JSON.stringify(sessionStorage.getItem('chatParams'))
      return _chatParams
    },
    liveParams: (state) => {
      let _liveParams = state.liveParams ? state.liveParams : JSON.stringify(sessionStorage.getItem('liveParams'))
      return _liveParams
    }
  },
  mutations: {
    [types.CHAT_PARAMS] (state, reLoad) {
      state.chatParams = reLoad
      sessionStorage.setItem('chatParams', JSON.stringify(reLoad))
    },
    [types.LIVE_PARAMS] (state, reLoad) {
      state.liveParams = reLoad
      sessionStorage.setItem('liveParams', JSON.stringify(reLoad))
    }
  }
}

export default tokenMagerModules
