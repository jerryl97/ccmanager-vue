<template>
  <div>
    <router-view/>
    <!--Main Tabbar-->
    <van-tabbar active-color="#07c160" inactive-color="#000" route>
      <van-tabbar-item name="addtrans" replace to="/main/addtrans" icon="plus">Add Trans</van-tabbar-item>
      <van-tabbar-item name="acctrans" replace to="/main/acctrans" icon="paid">Acc & Trans</van-tabbar-item>
      <van-tabbar-item name="promo" replace to="/main/promotions" icon="gift-o">Promo</van-tabbar-item>
      <van-tabbar-item name="setting" replace to="/main/settings" icon="setting-o">Settings</van-tabbar-item>
    </van-tabbar> 
  </div>
</template>
<script>
export default{
  data(){
    return{
    }
  }
}
</script>
