import Vue from 'vue'
import Vuex from 'vuex'
import appModules from './modules/app'
import loginModules from './modules/login'
import liveMagerModules from './modules/liveMager'
import tokenMagerModules from './modules/getToken'
import chatLimitModules from './modules/chatLimit'

Vue.use(Vuex)

const isDev = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  strict: isDev,
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    app: appModules,
    login: loginModules,
    liveMager: liveMagerModules,
    tokenMager: tokenMagerModules,
    chatLimit: chatLimitModules
  }
})

export default store
