import axios from 'axios'
import qs from 'qs'
import {
  Loading
} from 'components/common/loading'
import {
  MessageBox
} from 'components/common/message-box'

const BASE_URL = process.env.API_PATH

const defaultOptions = {
  timeout: 30000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
}

axios.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.data = qs.stringify(config.params)
      delete config.params
    }
    const vmpvisit = sessionStorage.getItem('vmpvisit')
    if (vmpvisit) {
      config.headers.vmpvisit = vmpvisit
    }
    const vmpbId = sessionStorage.getItem('vmpbId')
    if (vmpbId) {
      config.headers.vmpbId = vmpbId
    }
    const vmpcId = sessionStorage.getItem('vmpcId')
    if (vmpcId) {
      config.headers.vmpcId = vmpcId
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  res => {
    Loading(false)
    if (res.data.code && res.data.code !== 200) {
      return Promise.reject(res.data)
    }
    return res
  },
  error => {
    return Promise.reject(error)
  }
)

class $Http {
  constructor (target) {
    this.target = target
    this.config = {}
    this.options = {}
  }
  $config (config = {}) {
    this.config = config
    if (this.config.headers) {
      this.options.headers = this.config.headers
    }
    return this
  }
  $get (url, data = {}) {
    this.options.method = 'get'
    this.options.params = data
    return this.ajax(url)
  }
  $post (url, data = {}) {
    this.options.method = 'post'
    this.options.data = qs.stringify(data)
    return this.ajax(url)
  }
  ajax (url) {
    this.options.url = url
    if (!~url.indexOf('http')) {
      this.options.url = BASE_URL + url
      this.options.withCredentials = true
    }
    let _options = Object.assign({}, defaultOptions, this.options)
    if (this.config.loading) {
      Loading(true)
    }
    console.log(_options)
    return axios(_options)
      .then(res => {
        if (this.config.loading) {
          Loading(false)
        }
        return res.data
      })
      .catch(err => {
        if (this.config.loading) {
          Loading(false)
        }
        if (this.config.handlers === true) {
          return Promise.reject(err)
        } else if (
          Object.prototype.toString.call(this.config.handlers) ===
          '[object Array]' &&
          ~this.config.handlers.indexOf(err.code)
        ) {
          return Promise.reject(err)
        } else {
          let errorMsg = err.msg || '网络异常'
          MessageBox({
            header: '提示',
            content: errorMsg,
            autoClose: 10,
            confirmText: '知道了'
          })
        }
        return new Promise(() => {})
      })
  }
}

export default Vue => {
  Vue.prototype.$config = function (config) {
    let http = new $Http(this)
    return http.$config(config)
  }
  Vue.prototype.$get = function (url, data) {
    let http = new $Http(this)
    return http.$get(url, data)
  }
  Vue.prototype.$post = function (url, data) {
    let http = new $Http(this)
    return http.$post(url, data)
  }
}
