<template>
  <div>
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

  </div>
</template>

<script>

  //Import Components
  import AccGroups from './AccGroups.vue';
  import ExpCategory from './ExpCategory.vue';
  import IncCategory from './IncCategory.vue';

  export default{
    data(){
      return{
        title:'Settings',
        showManageAccGroups:false,
        showManageExpCat:false,
        showManageIncCat:false,

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
      }
    },
    components:{
      'v-accgroup':AccGroups,
      'v-expcat':ExpCategory,
      'v-inccat':IncCategory,
    }
  }

</script>
