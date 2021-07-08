import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
Router.prototype.goBack = function () {
  localStorage.setItem('isBack', 1)
  this.isBack = true
  window.history.go(-1)
}
Vue.use(Router)
const router = new Router({
  base: '/',
  routes
})

export default router
