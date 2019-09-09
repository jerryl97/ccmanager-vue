import Vue from 'vue'
import App from './App.vue'

//Import Vant UI Framework English Version
import Vant from 'vant'
import 'vant/lib/index.css'
import { Locale } from 'vant'
import enUS from 'vant/lib/locale/lang/en-US'
Locale.use('en-US', enUS)
Vue.use(Vant)

//Import Router
import router from './router/router.js'

//Import Vuex Store
import store from './store/store.js'

//Import Vue-Moment
import VueMoment from 'vue-moment'
Vue.use(VueMoment);

//Import Iconfont
import './assets/iconfont/iconfont.css';

//Import Vue Floating Action Button
import VueFab from 'vue-float-action-button'
Vue.use(VueFab,{iconType:'iconfont'})

//Import Lodash
import _ from 'lodash'
Vue.prototype._ = _

Vue.config.productionTip = false

new Vue({
  store,
  router,
  created(){
    this.$store.dispatch('getAccounts');
    this.$store.dispatch('getAccGroups');
  },
  render: h => h(App),
}).$mount('#app')
