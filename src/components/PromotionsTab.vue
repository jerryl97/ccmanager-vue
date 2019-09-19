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

    <!--Promotions List-->
    <van-collapse v-model="activePromoNames">
      <van-collapse-item v-for="(promo,index) in getPromo" :label="promo.promodesc" :name="promo.promoid">
        <div slot="title"> 
          {{promo.promotitle}}
        </div>
        <div slot="value"> 
          Minimum: $ {{promo.minimum}}
        </div>
        <div slot="default">
          <span v-if="promo.duration==true">Valid: {{getDateFormatted(promo.fromdate)}} - {{getDateFormatted(promo.todate)}} <br/></span>
          <span>Expense: <span v-for="exp in promo.rltexpense">{{getExpenseName(exp)}}, </span></span><br/>
          <span>Accounts: <span v-for="acc in promo.rltacc">{{getAccName(acc)}}, </span></span></br>
          <span>Rewards: <span v-for="reward in promo.rltrewards">{{getRewardsName(reward)}}, </span></span><br/>
          <van-button type="info" size="mini" @click="editPromoPop = true">Edit</van-button>
          <van-button type="danger" size="mini" @click="deletePromo(promo.promoid)">Delete</van-button>
        </div>
      </van-collapse-item>
    </van-collapse>


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
      activePromoNames:[],

      editPromoPop:false,
    
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
    },
    getDateFormatted(value){
      let temp = this.$moment(value).format('DD MMM YYYY'); 
      return temp;
    },
    getExpenseName(expid){
      let temp = this.getExpCat.find(o=>o.expcatid == expid);
      if(temp)
        return temp.expCatName; 
      else
        return 'Other';
    },
    getAccName(accid){
      let temp = this.getAccounts.find(o=>o.accid == accid);
      if(temp)
        return temp.name;
      else
        return 'Deleted Account'; 
    },
    getRewardsName(rewardsid){
      let temp = this.getRewardsCat.find(o=>o.rewardscatid == rewardsid);
      if(temp)
        return temp.rewardsCatName;
      else
        return 'Other'; 
    },
    deletePromo(promoid){ 
      this.$dialog.confirm({
        message:'Are you sure to delete?'
      }).then(()=>{
        this.$store.commit('deletePromo',promoid);
        this.$store.dispatch('storePromotions');
      }).catch(()=>{
        this.$dialog.close();
      });
    }
  },
  computed:{
    getPromo(){
      return this.$store.state.allPromo;
    },
    getAccounts(){
      return this.$store.state.allAccounts;
    },
    getExpCat(){
      return this.$store.state.expCat;
    },
    getRewardsCat(){
      return this.$store.state.rewardsCat;
    },
  },
  components:{
    'v-add-promo':AddPromo,
  }
}
</script>
