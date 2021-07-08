import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from '../assets/i18n/en'
import zhCN from '../assets/i18n/zhCN'
import zhTW from '../assets/i18n/zhTW'
Vue.use(VueI18n)
const messages = {
  /* 英文 */
  en: en,
  /* 简体中文 */
  zh_CN: zhCN,
  /* 繁体中文 */
  zh_TW: zhTW
  // /* 日文 */
  // jap: {},
  // Korean: {}
}
export default new VueI18n({
  locale: 'zh_CN', // 默认显示简体中文
  messages
})
