<template>
  <div style="padding:13% 0%">
    <!-- Top Nav Bar -->
    <van-nav-bar :title="title" fixed>
      <template slot="title">
        <van-icon color="#333333" name="point-gift-o"/>&nbsp
        <strong>{{title}}</strong>
      </template>
    </van-nav-bar>

    <!-- Add Promotions Button-->
    <vue-fab :hidden="hideAddPromoFab" icon="icon-plus" size="big" style="margin-bottom:20%" @clickMainBtn="showAddPromo"/>

    <!--Add Promotions Page(Popup)-->
    <van-popup v-model="addPromoPop" position="bottom" :style="{height:'100%'}">
      <v-add-promo @closeAddPromo="closeAddPromo"></v-add-promo>
    </van-popup>

    <!--Promotions List-->
    <van-collapse v-model="activePromoNames" accordion>
      <van-collapse-item v-for="(promo,index) in getPromo" :label="promo.promodesc" :name="promo.promoid">
        <div slot="title"> 
          <strong>{{promo.promotitle}}</strong>
        </div>
        <div slot="value"> 
          Minimum: $ {{promo.minimum}}
        </div>
        <div slot="default">
          <span v-if="promo.duration==true">Valid: {{getDateFormatted(promo.fromdate)}} - {{getDateFormatted(promo.todate)}} <br/></span>
          <span v-if="promo.transcount!=0">Minimum Swipe: {{promo.transcount}}/{{promo.maxtranscount}} times <br/></span>
          <span v-if="promo.rltexpense.length != getExpCat.length">Categories: {{getExpenseName(promo.rltexpense)}}<br/></span>
          <span v-if="promo.rltexpense.length == getExpCat.length">Categories: All<br/></span>
          <span v-if="promo.expmemo!=''">{{promo.expmemo}}</br></span>
          <span>Accounts: {{getAccName(promo.rltacc)}}</span></br>
          <span>Rewards: {{getRewardsName(promo.rltrewards)}}</span></span><br/>
          <van-button type="info" size="mini" @click="showEditPromo(promo)" icon="edit">Edit</van-button>
          <van-button type="danger" icon="delete" size="mini" @click="deletePromo(promo.promoid)">Delete</van-button>
        </div>
      </van-collapse-item>
    </van-collapse>

    <!--Edit Promotions Page(Popup)-->
    <van-popup v-model="editPromoPop" position="bottom" :style="{height:'100%'}">
      <v-edit-promo @closeEditPromo="closeEditPromo" :promo="selectedPromo"></v-edit-promo>
    </van-popup>
  </div>
</template>
<script>

import AddPromo from './AddPromo.vue';
import EditPromo from './EditPromotion.vue';

export default{
  data(){
    return{
      title:'Promotions',
      addPromoPop:false,
      hideAddPromoFab:false,
      activePromoNames:[],

      editPromoPop:false,
      selectedPromo:[],
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
    getExpenseName(expcat){
      let tempexpcat = [];
      for(let i in expcat){
      let temp = this.getExpCat.find(o=>o.expcatid == expcat[i]);
        if(temp)
          tempexpcat.push(temp.expCatName);
        else
          tempexpcat.push('Other')
      }
      return tempexpcat.join(', ');
    },
    getAccName(accounts){
      let tempaccs = [];
      for(let i in accounts){
        let temp = this.getAccounts.find(o=>o.accid == accounts[i]); 
        if(temp)
          tempaccs.push(temp.name);
        else
          tempaccs.push('Deleted Account');
      }
      return tempaccs.join(', ');
    },
    getRewardsName(rewards){
      let temprew = [];
      let tempval = [];
      for(let i in rewards){
        let temp = this.getRewardsCat.find(o=>o.rewardscatid == rewards[i].rewardsID);
        if(temp){
          temprew.push(temp.rewardsCatName);
          tempval.push(rewards[i].rewardsValue);
        }
        else{
          temprew.push('Other');
          tempval.push(0);
        } 
      }
      let result = '';
      for(let j = 0; j < temprew.length;j++){
        if(j == temprew.length - 1){
          result += temprew[j]+' '+tempval[j]; 
        }else{
          result += temprew[j]+' '+tempval[j] + ', '; 
        }
      }
      return result;
    },
    deletePromo(promoid){ 
      this.$dialog.confirm({
        message:'Are you sure to delete?'
      }).then(()=>{
        this.$store.commit('deletePromo',promoid);
        this.$store.dispatch('storeAllStateData');
      }).catch(()=>{
        this.$dialog.close();
      });
    },
    showEditPromo(promoid){
      this.editPromoPop = true;
      this.hideAddPromoFab = true; 
      this.selectedPromo = promoid;
    },
    closeEditPromo(){
      this.editPromoPop = false;
      this.hideAddPromoFab = false;
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
    'v-edit-promo':EditPromo,
  },
}
</script>
