<template>
  <div id="accmaindiv">
    <!--Add Account Float Action Button-->
    <vue-fab :hidden="hideAddAccFab" icon="icon-plus" size="normal" style="margin-bottom:20%" @clickMainBtn="showAddAcc"/>

    <!--Accounts List-->
    <div style="margin-bottom:40%;">
      <van-cell-group v-for="(group,key) in getGroupedAccounts" >
        <van-cell :title="getGroupName(key)" style="background-color:#f9f9f9" size="large" :value="getGroupSummary(key)" />
        </van-cell>
        <van-swipe-cell v-for="acc in group" :on-close="accOnClose" :name="acc.accid">
          <van-cell v-if="key!=1&&key!=2" is-link arrow-direction="left" @click="showAccProfile(acc)">
          <template slot="title">
            <span>{{acc.name}}</span>
          </template>
          <template slot="default">
            <span style="color:#FF3434" v-if="checkBalance(acc.balance)==-1">$ {{acc.balance}}</span>
            <span style="color:#7acc7a" v-if="checkBalance(acc.balance)==1">$ {{acc.balance}}</span>
            <span style="color:#333333" v-if="checkBalance(acc.balance)==0">$ {{acc.balance}}</span>
          </template>
          </van-cell>
          <van-cell v-if="key==1" is-link arrow-direction="left" @click="showAccProfile(acc)">
          <template slot="title">
            <span>{{acc.name}} ({{acc.last4digits}})</span>
          </template>
          <template slot="label">
            <van-tag type="danger">Not Settled</van-tag>
          </template>
          <template slot="default">
            <span>
              Outstd. ${{acc.outstdbalance}}
              <br/>
              Due ${{acc.dueamount}}
            </span>
          </template>
        </van-cell>
        <van-cell v-if="key==2" is-link arrow-direction="left" @click="showAccProfile(acc)">
          <template slot="title">
            <span>{{acc.name}} ({{acc.last4digits}})</span>
          </template>
          <template slot="label">
          </template>
          <template slot="default">
            <span>${{acc.balance}}</span>
          </template>
        </van-cell>
        <template slot="right">
         <van-button square type="danger" text="Delete" /> 
        </template>
      </van-swipe-cell>
      </van-cell-group>
    </div>

    <!--Add Account Page(Popup)-->
    <van-popup v-model="addAccPop" position="bottom" :style="{height:'100%'}">
      <v-add-account @closeAddAcc="closeAddAcc"></v-add-account>
    </van-popup>
    <!--Edit Account Page(Popup)-->
    <van-popup v-model="accProfilePop" position="bottom" :style="{height:'100%'}">
      <v-account-profile @closeAccProfile="closeAccProfile" :acc="selectedAcc"></v-account-profile>
    </van-popup>
  </div>
</template>

<script>

  //Import Add Account component
  import AddAccount from './AddAccount.vue';
  import AccProfile from './AccProfile.vue';
  
  export default{ 

    data(){ 
      return{
        activeCollapse:[],
        addAccPop:false, 
        hideAddAccFab:false,
        accGroupSummary:[],
        accProfilePop:false,
        selectedAcc:'',
      }
    },

    methods:{
 
      //Show Add Account Pop Up
      showAddAcc(){
        this.hideAddAccFab = true;
        this.addAccPop = true;
      },
      //Close Add Account Pop Up
      closeAddAcc(){
        this.hideAddAccFab = false;
        this.addAccPop = false; 
      },
      //Show Account Profile
      showAccProfile(acc){
          this.accProfilePop = true;
          this.hideAddAccFab = true;
          this.selectedAcc = acc;
      },
      //Close Account Profile
      closeAccProfile(){
        this.hideAddAccFab = false;
        this.accProfilePop = false;
      },
      //Get Account Groups Name
      getGroupName(key){
        let temp = this.getAccGroups.find(o=> o.grpid==key);
        if(temp == null || temp==undefined)
          return "Other";
        else
          return temp.groupName; 
      },
      //Get Each Group Balance Summary
      getGroupSummary(group){
        let result = this.accGroupSummary.find(item => item.group == group);
        if(group != 1)
          return '$ '+ result.balancetotal;
        else
          return  '$ '+ result.duetotal +'  $ '+ result.outstdtotal; 
      },
      checkBalance(value){
        return Math.sign(value);
      },

      //SwipeCell onClose Account Delete
      accOnClose(clickPosition, instance,detail){
        switch(clickPosition){
          case 'left':
          case 'cell':
          case 'outside':
            instance.close();
            break;
          case 'right':
            this.$dialog.confirm({
              message:'Are you sure to delete?'
            }).then(()=>{
              this.$store.commit('deleteAccount',detail.name);
              this.$store.dispatch('storeAllStateData');
            }).catch(()=>{
              this.$dialog.close();
            });
            break;
        }
      },
    },

    computed:{
      getAccounts(){
        return this.$store.state.allAccounts;
      },
      getGroupedAccounts(){
        let grouped = _.groupBy(this.getAccounts,'accgroup'); 

        this.accGroupSummary = [];
        for(let i in grouped){
          let balanceTotal = 0;
          let outstdTotal = 0;
          let dueTotal = 0;
          for(let j in grouped[i]){
            if(grouped[i][j].accgroup!=1) 
              balanceTotal += grouped[i][j].balance;
            else{
              outstdTotal += grouped[i][j].outstdbalance;          
              dueTotal += grouped[i][j].dueamount; 
            }
          }
          
          let summary = {
            group: grouped[i][0].accgroup,
            balancetotal: balanceTotal,
            outstdtotal: outstdTotal,
            duetotal: dueTotal
          } 
          this.accGroupSummary.push(summary);
        }
        return grouped 
      },
      getAccGroups(){
        return this.$store.state.accGroups;
      },  
    },
    mounted(){
    },

    components:{
      'v-add-account':AddAccount,
      'v-account-profile':AccProfile,
    },
  }

</script>
<style scoped>
#accmaindiv{
  background-color:#f6f6f9;
}
  
</style>
