import Vue from 'vue'
import App from './App.vue'
import scroll from 'vue-seamless-scroll'
import router from './router'
import store from './store'
import Axios from 'axios'
import Utils from './utils/uuid';

import './registerServiceWorker'
import './plugins/element.js'


Vue.use(scroll)

Vue.config.productionTip = false
Axios.defaults.timeout = 5000 // 请求超时
Axios.defaults.baseURL='https://www.cik567.top/netease-music'
Vue.prototype.axios = Axios
Vue.prototype.utils=Utils;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
