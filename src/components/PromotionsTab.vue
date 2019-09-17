<template>
  <div>
    <!-- Top Nav Bar -->
    <van-nav-bar :title="title"/>
    <!-- Add Promotions Button-->
    <vue-fab :hidden="hideAddPromoFab" icon="icon-plus" size="normal" style="margin-bottom:20%" @clickMainBtn="showAddPromo"/>

    <!--Add Promotions Page(Popup)-->
    <van-popup v-model="addPromoPop" position="bottom" :style="{height:'100%'}">
      <v-add-promo @closeAddPromo="closeAddPromo"></v-add-promo>
    </van-popup>

  </div>
</template>
<script>

import AddPromo from './AddPromo.vue';

export default{
  data(){
    return{
      title:'Promotions',
      addPromoPop:false,
      hideAddPromoFab:false,
    
    }
  },
  methods:{
    //Show Add Promo Page
    showAddPromo(){
      this.addPromoPop = true;
      this.hideAddPromoFab = true;
    
    },
    closeAddPromo(){
      this.addPromoPop = false;
      this.hideAddPromoFab = false;
    }
  },
  components:{
    'v-add-promo':AddPromo,
  }
}
</script>
