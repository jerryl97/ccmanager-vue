<template>
  <div id="app">
    <!--A View for Router Pages-->
    <router-view></router-view>

    <!--Main Tabbar-->
    <van-tabbar v-model="active" active-color="#07c160" inactive-color="#000" route>
      <van-tabbar-item replace to="/addtrans" icon="plus">Add Trans</van-tabbar-item>
      <van-tabbar-item replace to="/acctrans" icon="paid">Acc & Trans</van-tabbar-item>
      <van-tabbar-item replace to="/promotions" icon="gift-o">Promo</van-tabbar-item>
      <van-tabbar-item replace to="/settings" icon="setting-o">Settings</van-tabbar-item>
    </van-tabbar> 
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return{
      active:0
    }
  },
  methods:{
    onBackKeyDown(){
      this.$dialog.confirm({
        message:'Are you sure to quit?'
      }).then(()=>{
        navigator.app.exitApp();
      }).catch(()=>{
        this.$dialog.close();
      })
    } 
  },
  mounted(){
    document.addEventListener("backbutton",this.onBackKeyDown,false); 
  }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
