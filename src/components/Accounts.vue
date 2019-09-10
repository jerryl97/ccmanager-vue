<template>
  <div>
    <!--Add Account Float Action Button-->
    <vue-fab :hidden="hideFab" icon="icon-plus" size="normal" style="margin-bottom:20%" @clickMainBtn="showAddAcc"/>

    <!--Add Account Page(Popup)-->
    <van-popup v-model="addAccPop" position="bottom" :style="{height:'100%'}">
      <v-add-account @closeAddAcc="closeAddAcc"></v-add-account>
    </van-popup>

    <!--Accounts List-->
    <div style="margin-bottom:40%;">
    <van-cell-group v-for="(group,key) in getGroupedAccounts" :title="getGroupName(key)">
      <div v-if="key!=1&&key!=2">
      <van-swipe-cell v-for="acc in group" :on-close="onClose" :name="acc.accid">
        <van-cell>
          <template slot="title">
            <span>{{acc.name}}</span>
          </template>
          <template slot="label">
          </template>
          <template slot="default">
            <span>$ {{acc.balance}}</span>
          </template>
        </van-cell>
        <template slot="right">
         <van-button square type="danger" text="Delete" /> 
        </template>
      </van-swipe-cell>
      </div>
      <div v-if="key==1">
      <van-swipe-cell v-for="acc in group" :on-close="onClose" :name="acc.accid">
        <van-cell>
          <template slot="title">
            <span>{{acc.name}} ({{acc.last4digits}})</span>
            <van-tag type="danger">Not Settled</van-tag>
          </template>
          <template slot="label">
          </template>
          <template slot="default">
            <span>
              Outstd. ${{acc.outstdbalance}}
              <br/>
              Due ${{acc.dueamount}}
            </span>
          </template>
        </van-cell>
        <template slot="right">
         <van-button square type="danger" text="Delete" /> 
        </template>
      </van-swipe-cell>
      </div>
      <div v-if="key==2">
      <van-swipe-cell v-for="acc in group" :on-close="onClose" :name="acc.accid">
        <van-cell>
          <template slot="title">
            <span>{{acc.name}} ({{acc.last4digits}})</span>
          </template>
          <template slot="label">
          </template>
          <template slot="default">
            <span>$ {{acc.balance}}</span>
          </template>
        </van-cell>
        <template slot="right">
         <van-button square type="danger" text="Delete" /> 
        </template>
      </van-swipe-cell>
      </div>
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

      //SwipeCell onClose Account Delete
      onClose(clickPosition, instance,detail){
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
              console.log(detail.name);
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
      }
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

</style>
