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

       <van-switch-cell v-model="transItem.recurring" title="Recurring" active-color="green" inactive-color="red"/>

    <!-- Recurring Options-->
    <van-dropdown-menu v-if="transItem.recurring == true">
      <van-dropdown-item v-model="transItem.recurringtype" @change="recurringtypeChange" :options="recurringtypeoptions"/>
      <van-dropdown-item v-model="transItem.recurringtime" :disabled="recurringTimeDisabled" :options="getRecurringTime()"/>
    </van-dropdown-menu>

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
          recurringtype:0,
          recurringtime:'',
        },
        transDate:this.$moment(new Date()).format('DD MMMM YYYY'), //Default Display Date
        showTransDate:false,

        transAmount:'',
        showCalculator:false,
        recurringtypeoptions:[
          {text:'Daily',value:0},
          {text:'Weekly',value:1},
          {text:'Monthly',value:2},
        ],
        recurringTimeDisabled:true,

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

      recurringtypeChange(value){
        if(value == 1){
          this.transItem.recurringtime = 0;
          this.recurringTimeDisabled = false;
        }else if(value == 2){
          this.transItem.recurringtime = 7;
          this.recurringTimeDisabled = false;
        }else{
          this.transItem.recurringtime = '';
          this.recurringTimeDisabled = true;
        }
      },
      getRecurringTime(){
        if(this.transItem.recurringtype==0){
          let temp = [];
          return temp; 
        }else if(this.transItem.recurringtype==1){
          let temp = [
            {text:'Sunday',value:7},
            {text:'Monday',value:1},
            {text:'Tuesday',value:2},
            {text:'Wednesday',value:3},
            {text:'Thursday',value:4},
            {text:'Friday',value:5},
            {text:'Saturday',value:6},
          ]
          return temp;
        }else if(this.transItem.recurringtype==2){
          return this.getDays;
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
              if(accounts[j].accgroup!=1&&accounts[j].accgroup!=2){
                let tempAcc = {
                  text:accounts[j].name+' ($'+accounts[j].balance+')',
                  id:accounts[j].accid
                };
                temp.children.push(tempAcc); 
              }else{
                if(accounts[j].accgroup==2){
                  let tempAcc = {
                    text:accounts[j].name+'('+accounts[j].last4digits+')'+'($'+accounts[j].balance+')',
                    id:accounts[j].accid
                  };
                  temp.children.push(tempAcc); 
                }else{
                  let tempAcc = {
                    text:accounts[j].name+'('+accounts[j].last4digits+')',
                    id:accounts[j].accid
                  };
                  temp.children.push(tempAcc); 
                }
              }
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
        this.transItem.toaccount = this.selectedAccid;
        let tempAcc = this.getAccounts.find(o=>o.accid==this.selectedAccid);
        this.displayToAccount = tempAcc.name+'('+tempAcc.last4digits+')';
        if(this.settleDueOrOutstd==false){
          this.transAmount = tempAcc.outstdbalance.toString();
          this.transItem.contents = 'Settle Outstanding Amount';
        } 
        else if(this.settleDueOrOutstd==true){
          this.transAmount = tempAcc.dueamount.toString();
          this.transItem.contents = 'Settle Due Amount';
        }
      }
    },
    mounted(){
      this.accSelect = this.getGroupedAccounts;
      this.transItem.toaccount = this.selectedAccid;
      let tempAcc = this.getAccounts.find(o=>o.accid==this.selectedAccid);
      this.displayToAccount = tempAcc.name;
      if(this.settleDueOrOutstd==false){
        this.transAmount = tempAcc.outstdbalance.toString();
        this.transItem.contents = 'Settle Outstanding Amount';
      }
      else if(this.settleDueOrOutstd==true){
        this.transAmount = tempAcc.dueamount.toString();
        this.transItem.contents = 'Settle Due Amount';
      }
      
    },
    components:{
      "calculator":Calculator
    },
    props:['selectedAccid','settleDueOrOutstd']
  
  }
</script>
