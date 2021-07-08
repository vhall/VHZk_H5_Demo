import * as types from '../mutation-types'
const loginModules = {
  namespaced: true,
  state: {
    isLogin: false, // 是否登录
    authLoginInIframe: false,
    loginInfo: {}, // 登录信息
    centerInfo: {
      consumer_user: {
        nick_name: '',
        email: '',
        user_name: '',
        consumer_user_id: 0,
        mobile: ''
      },
      other: {
        plan_activity_count: 0,
        prize_count: 0
      }
    }
  },
  getters: {
    isLoginGetter: (state) => state.isLogin,
    loginInfo: (state) => state.loginInfo,
    centerInfo: (state) => state.centerInfo
  },
  mutations: {
    [types.UPDATE_IS_LOGIN] (state, status) {
      state.isLogin = status
    },
    [types.LOGIN_INFO] (state, status) {
      state.loginInfo = status
    },
    [types.CENTER_INFO] (state, status) {
      state.centerInfo = status
    },
    [types.AUTH_LOGIN_INIFRAME] (state) {
      state.authLoginInIframe = true
    }
  }
}

export default loginModules
