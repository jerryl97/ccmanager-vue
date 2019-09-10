import Vue from 'vue'

//Import and Use the Vue-Router
import VueRouter from 'vue-router'
Vue.use(VueRouter);

//Import the components
import AddTransTab from '../components/AddTransTab.vue'
import AccTransTab from '../components/AccTransTab.vue'
import PromotionsTab from '../components/PromotionsTab.vue'
import SettingsTab from '../components/SettingsTab.vue'

//Configure the routes
const routes = [
  {path: '/addtrans', component: AddTransTab},
  {path: '/acctrans', component: AccTransTab},
  {path: '/promotions', component: PromotionsTab},
  {path: '/settings', component: SettingsTab},

  {path: '*', redirect:'/addtrans'}
]

//Create the router
const router = new VueRouter({
  routes
})

export default router;