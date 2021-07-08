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
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
}

axios.interceptors.request.use(
  config => {
    config.params = config.params || {}
    if (config.params.__loading) {
      Loading(true)
      delete config.params.__loading
    }
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
    // jwt
    // config.headers.Authorization = localStorage.token
    return config
  },
  error => {
    Loading(false)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  res => {
    Loading(false)
    if (res.data.code !== 200) {
      return Promise.reject(res.data)
    }
    return res
  }, error => {
    return Promise.reject(error)
  }
)

export const ajax = (options) => {
  options.url = options.abPath || BASE_URL + options.url
  let _options = Object.assign({}, defaultOptions, options)
  console.log(_options)
  return axios(_options).then((res) => {
    return res.data
  }).catch((error) => {
    Loading(false)
    if ((options.data && options.data.__errHandler) || (options.params && options.params.__errHandler)) {
      return Promise.resolve(error)
    } else {
      MessageBox({
        header: '提示',
        content: error
      })
      return new Promise(() => {})
    }
  })
}
