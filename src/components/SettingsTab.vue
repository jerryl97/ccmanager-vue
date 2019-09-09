<template>
  <div>
    <!--Top Navbar-->
    <van-nav-bar :title="title"/>

    <!--Accounts Section-->
    <van-cell-group title="Accounts">
      <!--Managing Account Groups-->
      <van-cell title="Manage Account Groups" @click="showManageAccGroups=true" is-link/>
        <van-popup v-model="showManageAccGroups" position="bottom" :style="{height:'100%'}">
          <v-accgroup @closeManageAccGroups="closeManageAccGroups"></v-accgroup>
       </van-popup>
    </van-cell-group>

  </div>
</template>

<script>
  import AccGroups from './AccGroups.vue';

  export default{
    data(){
      return{
        title:'Settings',
        showManageAccGroups:false,

      }
    },
    methods:{
      closeManageAccGroups(){
        this.showManageAccGroups = false;
      }
    },
    components:{
      'v-accgroup':AccGroups,
    }
  }

</script>
