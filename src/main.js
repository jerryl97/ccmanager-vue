import Vue from 'vue'
import App from './App.vue'

//Import Vant UI Framework English Version
import Vant from 'vant'
import '../src/assets/index.css'
import 'vant/lib/icon/local.css'
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
const vueApp = new Vue({
  store,
  router,
  methods:{
    onDeviceReady(){
      admob.interstitial.config({
        id: 'ca-app-pub-9542103869311945/8594751641'
      });
      admob.banner.config({
        id: 'ca-app-pub-9542103869311945/4687296229'
      });
      admob.interstitial.prepare();
      admob.banner.prepare();
      navigator.splashscreen.show();
      window.setTimeout(function () {
        navigator.splashscreen.hide();
        admob.interstitial.show();
        admob.banner.show();
        screen.orientation.lock('portrait');
        if(store.state.firstTime==true){
          router.push({path:'/welcome'});
        }else if(store.state.firstTime == false && store.state.PINStat==true){
          router.push({path:'/pininput'}); 
        }else if(store.state.firstTime == false && store.state.PINStat==false){
          router.push({path:'/main/addtrans'});
        }
      },3500);
    },
  },
  render: h => h(App),
}).$mount('#app')

document.addEventListener("deviceready",vueApp.onDeviceReady(),false); 
