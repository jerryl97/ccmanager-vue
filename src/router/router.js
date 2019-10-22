import Vue from 'vue'

//Import and Use the Vue-Router
import VueRouter from 'vue-router'
Vue.use(VueRouter);

//Import the components
import WelcomePage from '../components/WelcomePage.vue'
import PinInput from '../components/PinInput.vue'
import MainContents from '../components/MainContents.vue'
import AddTransTab from '../components/AddTransTab.vue'
import AccTransTab from '../components/AccTransTab.vue'
import PromotionsTab from '../components/PromotionsTab.vue'
import SettingsTab from '../components/SettingsTab.vue'

//Configure the routes
const routes = [
  {path: '/welcome', component: WelcomePage},
  {path: '/pininput', component: PinInput},
  {path:'/main',component: MainContents,
    children:[
      {path: '/main/addtrans', component: AddTransTab},
      {path: '/main/acctrans', component: AccTransTab},
      {path: '/main/promotions', component: PromotionsTab},
      {path: '/main/settings', component: SettingsTab},
    ]},
  //{path: '*', redirect:'/welcome'}
]

//Create the router
const router = new VueRouter({
  routes
})

export default router;
