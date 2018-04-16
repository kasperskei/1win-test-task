import Vue from 'vue'
import VueNativeSock from 'vue-native-websocket'

import App from './App.vue'
import router from './router'

Vue.use(VueNativeSock, 'ws://echo.websocket.org/', {
  format: 'json',
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 3000
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
