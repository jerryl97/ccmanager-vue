<template>
  <div style="padding-top:13%">
    <!-- Top Nav Bar-->
    <van-nav-bar :title="getTitle(selectedAccount)" left-text="Back" left-arrow @click-left="back()" @click-right="showEditAcc" fixed>
      <template slot="right">
        <van-icon name="edit" size="15px"/>
        <span style="color:#1989fa;font-size:15px">Edit</span>
      </template>
    </van-nav-bar>

    <!-- Account Details-->
    <van-cell-group>
      <van-cell style="background-color:#f6f6f6">
        <template slot="title">
          <span>
            {{getAccGroupName(selectedAccount.accgroup)}}
            <van-tag type="default" size="medium" v-if="selectedAccount.accgroup==1||selectedAccount.accgroup==2">{{selectedAccount.cardtype}}</van-tag>
          </span>
        </template>
        <template slot="default">
          <span v-if="selectedAccount.accgroup!=1"><strong :style="{color:getBalanceColor(selectedAccount.balance)}">$ {{selectedAccount.balance}}</strong></span>
          <span v-if="selectedAccount.accgroup==1">
            <van-button size="mini" plain type="info" @click="settlePop=true;settleDueOrOutstd=false">Settle</van-button>
            Oustd: <span :style="{color:getOutstdColor(selectedAccount.outstdbalance)}">{{selectedAccount.outstdbalance}}</span><br/>
            <van-button size="mini" plain type="info" @click="settlePop=true;settleDueOrOutstd=true">Settle</van-button>
            Due: <span :style="{color:getOutstdColor(selectedAccount.dueamount)}">{{selectedAccount.dueamount}}</span><br/>
            <van-tag type="danger" v-if="!selectedAccount.settlestatus">Not Settled</van-tag>
            <van-tag type="success" v-if="selectedAccount.settlestatus">Settled</van-tag>
          </span>
        </template>
        <template slot="label">
          <span v-if="selectedAccount.accgroup==1||selectedAccount.accgroup==2">{{selectedAccount.bank}}<br/></span>
          <span v-if="selectedAccount.accgroup==1||selectedAccount.accgroup==2">Expiry:{{getExpiryFormatted(selectedAccount.expiry)}}<br/></span>
          <span>
            {{selectedAccount.contents}}
          </span>
        </template>
      </van-cell>
    </van-cell-group>
    <div v-if="selectedAccount.accgroup==1" style="text-align:center;background-color:#f6f6f6;padding:10px 0px;border-bottom:1px solid #dddddd">
    <van-row type="flex">
      <van-col span="12">
        <span style="font-size:11px">
          Statement Date:
        </span> 
        <br/>
        <span style="font-size:13px">
          {{selectedAccount.sdate}}
        </span>
      </van-col>
      <van-col span="12">
        <span style="font-size:11px">
          Payment Due Date:
        </span> 
        <br/>
        <span style="font-size:13px">
          {{selectedAccount.pduedate}}
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
          {{selectedAccount.cutoffdate}}
        </span>
      </van-col>
      <van-col span="12">
        <span style="font-size:11px">
          Next Due Date:
        </span> 
        <br/>
        <span style="font-size:13px">
          {{selectedAccount.nextduedate}}
        </span>
      </van-col>
    </van-row>
    </div>
    <v-transactions :selectedAccid="selectedAccid" :isProfile="isProfile"></v-transactions>

  <!-- Edit Account Page(Popup)-->
  <van-popup v-model="editAccPop" position="bottom" :style="{height:'100%'}">
    <v-editaccount @closeEditAcc="closeEditAcc" :selectedAccid="selectedAccid"></v-editaccount>
  </van-popup>

  <van-popup v-model="settlePop" position="bottom" :style="{height:'100%'}">
    <v-settlepayment @closeSettlePage="closeSettlePage" :settleDueOrOutstd="settleDueOrOutstd" :selectedAccid="selectedAccid"/>
  </van-popup>
  </div>
</template>
<script>
  import Transactions from './Transactions.vue'
  import EditAccount from './EditAccount.vue'
  import SettlePayment from './SettlePayment.vue'

  export default{
    data(){
      return{
        title:'',      
        selectedAccount:{},
        isProfile:true,
        editAccPop:false,
        settleTitle:'Not Settled',
        settleTextColor:'red',
        settlePop:false,
        settleDueOrOutstd:false,
      }
    },
    methods:{
      back(){
        this.$emit("closeAccProfile"); 
      },
      //Show Edit Account
      showEditAcc(){
        this.editAccPop = true;
      },
      //Close Edit Account
      closeEditAcc(){
        this.editAccPop = false;
      },
      //Get Title of Account
      getTitle(acc){
        if(acc.last4digits==''||acc.last4digits==undefined)
          return acc.name; 
        else
          return acc.name + ' (' + acc.last4digits + ')';  
      },
      getBalanceColor(value){
        if(value > 0)
          return '#7acc7a';
        else if(value<0)
          return '#FF3434';
        else if(value == 0)
          return '#333333';
      },
      getOutstdColor(value){
        if(value < 0)
          return '#7acc7a';
        else if(value > 0)
          return '#FF3434';
        else if(value == 0)
          return '#333333'; 
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
      closeSettlePage(){
        this.settlePop = false;
      }
    },
    computed:{
      getAccGroups(){
        return this.$store.state.accGroups;
      },
      getAccounts(){
        return this.$store.state.allAccounts;
      }
    },
    mounted(){
        this.selectedAccount = this.getAccounts.find(o=>o.accid == this.selectedAccid);  
    },
    updated(){
        this.selectedAccount = this.getAccounts.find(o=>o.accid == this.selectedAccid);  
    },
    watch:{
      selectedAccid(){
        this.selectedAccount = this.getAccounts.find(o=>o.accid == this.selectedAccid);  
      }
    },
    components:{
      'v-transactions':Transactions,
      'v-editaccount':EditAccount,
      'v-settlepayment':SettlePayment
    },
    props:['selectedAccid']
  }
</script>
