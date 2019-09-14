<template>
  <div id="accmaindiv">
    <!--Add Account Float Action Button-->
    <vue-fab :hidden="hideFab" icon="icon-plus" size="normal" style="margin-bottom:20%" @clickMainBtn="showAddAcc"/>

    <!--Add Account Page(Popup)-->
    <van-popup v-model="addAccPop" position="bottom" :style="{height:'100%'}">
      <v-add-account @closeAddAcc="closeAddAcc"></v-add-account>
    </van-popup>

    <!--Accounts List-->
    <div style="margin-bottom:40%;">
      <van-cell-group v-for="(group,key) in getGroupedAccounts" >
        <van-cell :title="getGroupName(key)" style="background-color:#f9f9f9" size="large"/>
          <van-swipe-cell v-for="acc in group" :on-close="accOnClose" :name="acc.accid">
            <van-cell v-if="key!=1&&key!=2">
            <template slot="title">
              <span>{{acc.name}}</span>
            </template>
            <template slot="label">
            </template>
            <template slot="default">
              <span style="color:#FF3434" v-if="checkBalance(acc.balance)==-1">$ {{acc.balance}}</span>
              <span style="color:#7acc7a" v-if="checkBalance(acc.balance)==1">$ {{acc.balance}}</span>
              <span style="color:#333333" v-if="checkBalance(acc.balance)==0">$ {{acc.balance}}</span>
          </template>
        </van-cell>
        <van-cell v-if="key==1">
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
        <van-cell v-if="key==2">
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
  </div>
</template>

<script>

  //Import Add Account component
  import AddAccount from './AddAccount.vue';
  
  export default{ 

    data(){ 
      return{
        accList:[],
        activeCollapse:[],
        addAccPop:false, 
        hideFab:false,
      }
    },

    methods:{
 
      //Show Add Account Pop Up
      showAddAcc(){
        this.hideFab = true;
        this.addAccPop = true;
      },
      //Close Add Account Pop Up
      closeAddAcc(){
        this.hideFab = false;
        this.addAccPop = false; 
      },

      //Get Account Groups Name
      getGroupName(key){
        let temp = this.getAccGroups.find(o=> o.grpid==key);
        if(temp == null || temp==undefined)
          return "Other";
        else
          return temp.groupName; 
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
              this.accList = _.filter(this.accList,x=>{
                return x.accid != detail.name;
              })
              this.$store.commit('setAccounts',this.accList);
              this.$store.dispatch('storeAccounts');
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
        return _.groupBy(this.$store.state.allAccounts,'accgroup'); 
      },
      getAccGroups(){
        return this.$store.state.accGroups;
      },  
    },
    mounted(){
      this.accList = this.getAccounts;
    },

    components:{
      'v-add-account':AddAccount,
    },
  }

</script>
<style scoped>
#accmaindiv{
  background-color:#f6f6f9;
}
  
</style>
