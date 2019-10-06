<template>
  <div style="padding-top:13%">
    <van-nav-bar :title="title" left-text="Back" left-arrow @click-left="back()" fixed/>
    <van-cell-group>
       <van-field required readonly label="Type" :value="transItem.type" disabled/> 

       <van-field required readonly clickable label="Date" :value="transDate" @click="showTransDate = true" />
       <van-popup v-model="showTransDate" position="bottom">
         <van-datetime-picker v-model="transItem.date" type="date" @cancel="showTransDate=false" @confirm="dateConfirm" />
       </van-popup>

       <van-field readonly clickable label="Amount" :value="transAmount" @click="showCalculator = true" placeholder="0"/>
       <van-popup
        v-model="showCalculator"
        position="bottom"
        :style="{ height: '80%' }"
      >
        <calculator @closeCalculator="closeCalculator" @confirmCalculator="confirmCalculator"></calculator>
      </van-popup>


       <van-field readonly required clickable :error-message="fromAccountError" label="From" placeholder="Choose an account" :value="displayFromAccount" @click="showFromAccList = true"/>
       <van-popup v-model="showFromAccList" position="bottom">
          <div v-if="getAccounts.length==0" style="background-color:white;text-align:center;margin:10% 0%">
            <i style="color:#aaaaaa">Please add a new account.</i>
          </div>
        <div v-if="getAccounts.length>0">
          <van-nav-bar left-text="Cancel" right-text="Confirm" @click-right="accConfirm(activeAccId,'fromaccount')" @click-left="cancelAccConfirm('fromaccount')"/>
          <van-tree-select :items="accSelect" :active-id.sync="activeAccId" :main-active-index.sync="activeAccIndex"/>
        </div>
       </van-popup>

       <van-field readonly required label="To" placeholder="Choose an account" :value="displayToAccount" disabled/>

       <van-field v-model="transItem.contents" label="Contents" type="textarea" rows="1" autosize />

       <van-switch-cell v-model="transItem.recuring" title="Recuring" active-color="green" inactive-color="red"/>

       <van-button type="primary" size="large" style="width:90%;margin:5%;" @click="saveNewTrans">Save</van-button>
    </van-cell-group>
  

  </div>
</template>
<script>
  import Calculator from './Calculator.vue'

  export default{
    data(){
      return{
        title:'Settle Payment',

        transItem:{
          type:'Transfer',
          date:new Date(),
          amount:0,
          contents:'',
        },
        transDate:this.$moment(new Date()).format('DD MMMM YYYY'), //Default Display Date
        showTransDate:false,

        transAmount:'',
        showCalculator:false,

        showFromAccList:false,
        displayFromAccount:'',
        fromAccountError:'',
        activeAccId:'',
        activeAccIndex:0,
        showToAccList:false,
        displayToAccount:'',
        accSelect:[],
        displayToAccount:'',
      }
    },
    methods:{
      setDefault(){
        this.transItem = {};
        this.transItem.type='Transfer';
        this.transItem.date=new Date();
        this.transItem.amount=0;
        this.transItem.contents='';
        this.transDate = this.$moment(new Date()).format('DD MMMM YYYY'), //Default Display Date
        this.transAmount='';
        this.displayFromAccount='';
        this.fromAccountError='';
        this.activeAccId='';
        this.activeAccIndex=0;
      
      },
      back(){
        this.$emit("closeSettlePage");
      },
      dateConfirm(value){
        this.transItem.date = value;
        this.transDate = this.$moment(value).format('DD MMMM YYYY');
        this.showTransDate = false;
      },
       //Calculator Emit Event Methods
      closeCalculator(){
        this.showCalculator=false
      },
      confirmCalculator(calcResult){
        this.transAmount = calcResult;
        this.showCalculator=false;
      },
      //Account Confirm
      accConfirm(value,type){
        if(value){
         let temp = this.getAccounts.find(o=>o.accid==value);
         switch(type){
            case 'fromaccount':
             this.transItem.fromaccount = value;
             this.displayFromAccount = temp.name;
             this.showFromAccList = false;
             this.activeAccId = '';
             break;
            case 'toaccount':
             this.transItem.toaccount = value;
             this.displayToAccount = temp.name;
             this.showToAccList = false;
             this.activeAccId = '';
             break;
        
          }
        }
      },
      //Cancel Account Confirm
      cancelAccConfirm(value){
        switch(value){
          case 'fromaccount': 
            this.displayFromAccount = '';
            this.activeAccId = '';
            this.showFromAccList = false;
            break;
          case 'toaccount':
            this.displayToAccount = '';
            this.activeAccId = '';
            this.showToAccList = false;
            break;
        }
      },

      //Save New Transaction
      saveNewTrans(){
        let hasError = false;
        hasError = this.addTransValidation(hasError);
        if(hasError==false){
          if(this.transAmount == ''){
            this.transItem.amount = 0;
          }else{
            this.transItem.amount = parseFloat(this.transAmount); 
          }
          if(this.transItem.type=='Transfer'){
            this.transItem.account = '';
            this.transItem.category = '';
          }
          this.$store.commit('addTrans',this.transItem);
          this.$store.dispatch('storeAllStateData');
          this.back();
          this.setDefault();
        }       
      },
      
      //Save Validation
      addTransValidation(value){
        let validstate = value;
          if(this.transItem.fromaccount == null){
            this.fromAccountError = "Please choose a from account";
            validstate = true;
          } 
          return validstate;
      }, 
    },
    computed:{
      getAccounts(){
        return this.$store.state.allAccounts;
      },
      getAccGroups(){
        return this.$store.state.accGroups;
      },
      getGroupedAccounts(){ 
        let grouped = [];
        let accgrps = this.getAccGroups;
        let accounts = this.getAccounts;
        for(let i in accgrps){
          let temp = {};
          temp.text=accgrps[i].groupName;
          temp.children = [];
          for(let j in accounts){
            if(accounts[j].accgroup == accgrps[i].grpid){
              let tempAcc = {
                text:accounts[j].name,
                id:accounts[j].accid
              };
              temp.children.push(tempAcc); 
            }
          }
          if(temp.children.length>0)
            temp.info = temp.children.length;
          grouped.push(temp);
        }
        return grouped;
      },
    },
    watch:{
      settleDueOrOutstd(){
        if(this.settleDueOrOutstd==false){
          this.transAmount = this.acc.outstdbalance.toString();
          this.transItem.contents = 'Settle Outstanding Amount';
        } 
        else if(this.settleDueOrOutstd==true){
          this.transAmount = this.acc.dueamount.toString();
          this.transItem.contents = 'Settle Due Amount';
        }
      }
    },
    mounted(){
      this.accSelect = this.getGroupedAccounts;
      this.transItem.toaccount = this.acc.accid;
      this.displayToAccount = this.acc.name;
      if(this.settleDueOrOutstd==false){
        this.transAmount = this.acc.outstdbalance.toString();
        this.transItem.contents = 'Settle Outstanding Amount';
      }
      else if(this.settleDueOrOutstd==true){
        this.transAmount = this.acc.dueamount.toString();
        this.transItem.contents = 'Settle Due Amount';
      }
      
    },
    components:{
      "calculator":Calculator
    },
    props:['acc','settleDueOrOutstd']
  
  }
</script>
