<template>
  <div>
    <!-- Top Nav Bar-->
    <van-nav-bar :title="getTitle(acc)" left-text="Back" left-arrow @click-left="back()" right-text="Edit" @click-right="showEditAcc"/>

    <!-- FAB for adding Transaction-->
    <vue-fab :hidden="hideFab" icon="icon-plus" size="normal" style="margin-bottom:20%" @clickMainBtn="addTransButton"/>

    <!-- Account Details-->
    <van-cell-group>
      <van-cell style="background-color:#f6f6f6">
        <template slot="title">
          <span>
            {{getAccGroupName(acc.accgroup)}}
            <van-tag type="default" size="medium" v-if="acc.accgroup==1||acc.accgroup==2">{{acc.cardtype}}</van-tag>
          </span>
        </template>
        <template slot="default">
          <span v-if="acc.accgroup!=1">$ {{acc.balance}}</span>
          <span v-if="acc.accgroup==1">
            Oustd. ${{acc.outstdbalance}}<br/>
            Due $ {{acc.dueamount}}
          </span>
        </template>
        <template slot="label">
          <span v-if="acc.accgroup==1||acc.accgroup==2">Expiry:{{getExpiryFormatted(acc.expiry)}}<br/></span>
          <span>
            {{acc.contents}}
          </span>
        </template>
      </van-cell>
    </van-cell-group>
    <div v-if="acc.accgroup==1" style="text-align:center;background-color:#f6f6f6;padding:10px 0px;border-bottom:1px solid #dddddd">
    <van-row type="flex">
      <van-col span="12">
        <span style="font-size:11px">
          Statement Date:
        </span> 
        <br/>
        <span style="font-size:13px">
          {{acc.sdate}}
        </span>
      </van-col>
      <van-col span="12">
        <span style="font-size:11px">
          Payment Due Date:
        </span> 
        <br/>
        <span style="font-size:13px">
          {{acc.pduedate}}
        </span>
      </van-col>
    </van-row>
    <van-row type="flex">
      <van-col span="12">
        <span style="font-size:11px">
          Cut off date:
        </span> 
        <br/>
        <span style="font-size:13px">
          {{acc.cutoffdate}}
        </span>
      </van-col>
      <van-col span="12">
        <span style="font-size:11px">
          Next Due Date:
        </span> 
        <br/>
        <span style="font-size:13px">
          {{acc.nextduedate}}
        </span>
      </van-col>
    </van-row>
    </div>
    <v-transactions :acc="acc" :isProfile="isProfile"></v-transactions>

  <!-- Edit Account Page(Popup)-->
  <van-popup v-model="editAccPop" position="bottom" :style="{height:'100%'}">
    <v-editaccount @closeEditAcc="closeEditAcc" :acc="acc"></v-editaccount>
  </van-popup>
  </div>
</template>
<script>
  import Transactions from './Transactions.vue'
  import EditAccount from './EditAccount.vue'

  export default{
    data(){
      return{
        title:'',      
        isProfile:true,
        editAccPop:false,
        hideFab:false,
      }
    },
    methods:{
      back(){
        this.$emit("closeAccProfile"); 
      },
      //Add Transaction Button
      addTransButton(){
        this.$router.push("/addtrans");
      },
      //Show Edit Account
      showEditAcc(){
        this.editAccPop = true;
        this.hideFab = true;
      },
      //Close Edit Account
      closeEditAcc(){
        this.editAccPop = false;
        this.hideFab = false;
      },
      //Get Title of Account
      getTitle(acc){
        if(acc.last4digits==''||acc.last4digits==undefined)
          return acc.name; 
        else
          return acc.name + ' (' + acc.last4digits + ')';  
      },
      //Get Account Group Name
      getAccGroupName(groupid){
        let temp = this.getAccGroups.find(o=> o.grpid==groupid);
        if(temp == null || temp==undefined)
          return "Other";
        else
          return temp.groupName; 
      },
      //Get Formatted Expiry Date
      getExpiryFormatted(expiry){
        let formatted = this.$moment(expiry).format("MM/YY");
        return formatted; 
      },


    },
    computed:{
      getAccGroups(){
        return this.$store.state.accGroups;
      },
    },
    mounted(){
    },
    components:{
      'v-transactions':Transactions,
      'v-editaccount':EditAccount
    },
    props:['acc']
  }
</script>
