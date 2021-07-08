import Vue from 'vue'
import 'mint-ui/lib/style.css'
import App from './app.vue'
import store from './store'
import router from './router'
import i18n from './utils/i18n'
import './filters/filters'
import 'whatwg-fetch'
import './utils/extend'
import 'assets/css/index.scss'
import './utils/device'
import serviceContainer from './container/index'
import Notification from './components/common/notification'
import Input from './components/common/input'
import Marquee from './components/common/marquee'
import MessageBox from './components/common/message-box'
import Loading from './components/common/loading'
import Dialog from './components/common/dialog'
import Button from './components/common/button'
import Tabs from './components/common/tabs'
import Zan from './components/common/zan'
import Ajax from './utils/_ajax'
// import '../fe_jssdk/dist/local/1.0.0/zk-jssdk'
// import '../fe_jssdk/src/index'
import './utils/vue.prototype'
import './utils/mint-ui-index'
Vue.use(Notification)
Vue.use(Input)
Vue.use(Marquee)
Vue.use(MessageBox)
Vue.use(Loading)
Vue.use(Dialog)
Vue.use(Button)
Vue.use(Tabs)
Vue.use(Zan)
Vue.use(Ajax)

Vue.config.debug = process.env.BUILD_ENV !== 'prod'
Vue.config.devtools = process.env.BUILD_ENV !== 'prod'
Vue.config.productionTip = process.env.BUILD_ENV !== 'prod'

/* eslint-disable no-new */
new Vue({
  el: '#root',
  provide: serviceContainer,
  router,
  store,
  i18n,
  render: h => h(App)
})
window.$uuid = window.btoa(Math.random())
window.addEventListener('load', function () {
  let sClass = document.body.getAttribute('class')
  document.body.setAttribute('class', sClass + window.MobileDevice.getModels().toString().includes('iPhone X') ? `${sClass} iphone-x` : `${sClass} other-phone`)
  document.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  })
  var lastTouchEnd = 0
  document.addEventListener('touchend', function (event) {
    var now = (new Date()).getTime()
    if (now - lastTouchEnd <= 300) {
      event.preventDefault()
    }
    lastTouchEnd = now
  }, false)
  document.addEventListener('gesturestart', function (event) {
    event.preventDefault()
  })
})
window.onload = () => {
  sessionStorage.setItem('PAGE_ONLOAD', 1)
}
