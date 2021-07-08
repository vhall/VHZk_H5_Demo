import * as types from '../mutation-types'

const appModules = {
  namespaced: true,
  state: {
    isLoading: false
  },
  getters: {
    loadingStatus: state => state.isLoading
  },
  mutations: {
    [types.LOADING_STATUS] (state, status) {
      state.isLoading = status
    }
  },
  actions: {
    updateLoadingStatusAsync ({
      commit
    }, data) {
      setTimeout(() => {
        commit(types.LOADING_STATUS, data)
      }, 2000)
    }
  }
}

export default appModules
