<template>
  <div style="padding-top:13%">
    <!-- Top Nav Bar-->
    <van-nav-bar :title="getTitle(acc)" left-text="Back" left-arrow @click-left="back()" @click-right="showEditAcc" fixed>
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
            {{getAccGroupName(acc.accgroup)}}
            <van-tag type="default" size="medium" v-if="acc.accgroup==1||acc.accgroup==2">{{acc.cardtype}}</van-tag>
          </span>
        </template>
        <template slot="default">
          <span v-if="acc.accgroup!=1"><strong :style="{color:getBalanceColor(acc.balance)}">$ {{acc.balance}}</strong></span>
          <span v-if="acc.accgroup==1">
            <!--<van-button size="mini" plain type="info" @click="settlePop=true;settleDueOrOutstd=false">Settle</van-button>-->
            Oustd: <span :style="{color:getOutstdColor(acc.outstdbalance)}">{{acc.outstdbalance}}</span><br/>
            <van-button size="mini" plain type="info" @click="settlePop=true;settleDueOrOutstd=true">Settle</van-button>
            Due: <span :style="{color:getOutstdColor(acc.dueamount)}">{{acc.dueamount}}</span><br/>
            <van-tag type="danger" v-if="!acc.settlestatus">Not Settled</van-tag>
            <van-tag type="success" v-if="acc.settlestatus">Settled</van-tag>
          </span>
        </template>
        <template slot="label">
          <span v-if="acc.accgroup==1||acc.accgroup==2">{{acc.bank}}<br/></span>
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
          {{getDateFormatted(acc.sdate)}}
        </span>
      </van-col>
      <van-col span="12">
        <span style="font-size:11px">
          Payment Due Date:
        </span> 
        <br/>
        <span style="font-size:13px">
          {{getDateFormatted(acc.pduedate)}}
        </span>
      </van-col>
    </van-row>
    <!--<van-row type="flex">
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
    </van-row>-->
    </div>
    
    <v-transactions v-if="acc.accgroup!=1" :acc="acc" :isProfile="isProfile"></v-transactions>
    <v-cctrans v-if="acc.accgroup==1" :acc="acc" :isProfile="isProfile"></v-cctrans>

  <!-- Edit Account Page(Popup)-->
  <van-popup v-model="editAccPop" position="bottom" :style="{height:'100%'}">
    <v-editaccount @closeEditAcc="closeEditAcc" :acc="acc"></v-editaccount>
  </van-popup>

  <van-popup v-model="settlePop" position="bottom" :style="{height:'100%'}">
    <v-settlepayment @closeSettlePage="closeSettlePage" :settleDueOrOutstd="settleDueOrOutstd" :acc="acc"/>
  </van-popup>
  </div>
</template>
<script>
  import Transactions from './Transactions.vue'
  import EditAccount from './EditAccount.vue'
  import SettlePayment from './SettlePayment.vue'
  import CreditCardTrans from './CreditCardTrans.vue'

  export default{
    data(){
      return{
        title:'',
        isProfile:true,
        editAccPop:false,
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
        if(acc.accgroup==1||acc.accgroup==2)
          if(acc.last4digits==''||acc.last4digits==undefined)
            return acc.name;
          else
            return acc.name + ' (' + acc.last4digits + ')';  
        else
          return acc.name;
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
      getDateFormatted(date){
        let formatted = this.$moment(date).format("DD MMMM YYYY");
        return formatted;
      },
      closeSettlePage(){
        this.settlePop = false;
      },
    },
    computed:{
      getAccGroups(){
        return this.$store.state.accGroups;
      },
      getAccounts(){
        return this.$store.state.allAccounts;
      }
    },
    components:{
      'v-transactions':Transactions,
      'v-editaccount':EditAccount,
      'v-settlepayment':SettlePayment,
      'v-cctrans':CreditCardTrans,
    },
    props:['acc']
  }
</script>
