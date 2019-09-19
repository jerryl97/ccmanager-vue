<template>
  <div id="settingmaindiv">
    <!--Top Navbar-->
    <van-nav-bar :title="title"/>

    <!--Accounts Section-->
    <van-cell-group title="Accounts">
      <!--Managing Account Groups-->
      <van-cell title="Manage Account Groups" @click="showManageAccGroups=true" is-link/>
    </van-cell-group>

    <!--Tranactions Section-->
    <van-cell-group title="Transactions">
      <!--Managing Expense Categories-->
      <van-cell title="Manage Expense Categories" @click="showManageExpCat=true" is-link/>
      <!--Managing Income Categories-->
      <van-cell title="Manage Income Categories" @click="showManageIncCat=true" is-link/>
    </van-cell-group>

    <!--Promotions Section-->
    <van-cell-group title="Promotions">
      <!--Managing Rewards Categories-->
      <van-cell title="Manage Rewards Categories" @click="showManageRewards=true" is-link/>
    </van-cell-group>

    <!-- Setting Pop Ups-->
    <!-- Manage Account Groups Pop-->
    <van-popup v-model="showManageAccGroups" position="bottom" :style="{height:'100%'}">
       <v-accgroup @closeManageAccGroups="closeManageAccGroups"></v-accgroup>
    </van-popup>
    <!-- Manage Expense Category Pop-->
    <van-popup v-model="showManageExpCat" position="bottom" :style="{height:'100%'}">
       <v-expcat @closeManageExpCat="closeManageExpCat"></v-expcat>
    </van-popup>
    <!-- Manage Income Category Pop-->
    <van-popup v-model="showManageIncCat" position="bottom" :style="{height:'100%'}">
       <v-inccat @closeManageIncCat="closeManageIncCat"></v-inccat>
    </van-popup>
    <!-- Manage Rewards Category Pop-->
    <van-popup v-model="showManageRewards" position="bottom" :style="{height:'100%'}">
       <v-rewardscat @closeManageRewardsCat="closeManageRewardsCat"></v-rewardscat>
    </van-popup>

  </div>
</template>

<script>

  //Import Components
  import AccGroups from './AccGroups.vue'
  import ExpCategory from './ExpCategory.vue'
  import IncCategory from './IncCategory.vue'
  import RewardsCategory from './RewardsCategory.vue'

  export default{
    data(){
      return{
        title:'Settings',
        showManageAccGroups:false,
        showManageExpCat:false,
        showManageIncCat:false,
        showManageRewards:false,

      }
    },
    methods:{
      //Close Manage Account Groups
      closeManageAccGroups(){
        this.showManageAccGroups = false;
      },
      //Close Manage Expense Categories
      closeManageExpCat(){
        this.showManageExpCat=false;
      },
      //Close Manage Income Categories
      closeManageIncCat(){
        this.showManageIncCat=false;
      },
      //Close Manage Rewards Categories
      closeManageRewardsCat(){
        this.showManageRewards=false;
      }
    },
    components:{
      'v-accgroup':AccGroups,
      'v-expcat':ExpCategory,
      'v-inccat':IncCategory,
      'v-rewardscat':RewardsCategory,
    }
  }

</script>
<style scoped>
#settingmaindiv{
  background-color:#f6f6f6
}
</style>
