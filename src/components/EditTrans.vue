<template>
  <div style="padding:13% 0">
    <!--Top Navbar-->
    <van-nav-bar :title="title" left-text="Back" left-arrow @click-left="back()" @click-right="deleteTrans()" fixed>
      <template slot="right">
        <van-icon name="delete" size="15px"/>
        <span style="color:#1989fa;font-size:15px">Delete</span>
      </template>
    </van-nav-bar>

    <van-cell-group>
    <!--Field for Transaction Type(with Popup Picker)-->
       <van-field required readonly clickable label="Type" :value="transItem.type" @click="showTransOptions = true" />
       <van-popup v-model="showTransOptions" position="bottom">
         <van-picker show-toolbar :columns="transOptions" @cancel="showTransOptions = false" @confirm="transTypeConfirm" />
       </van-popup>

    <!--Field for Date(with Popup Picker)-->
       <van-field required readonly clickable label="Date" :value="transDate" @click="showTransDate = true" />
       <van-popup v-model="showTransDate" position="bottom">
         <van-datetime-picker v-model="transItem.date" type="date" @cancel="showTransDate=false" @confirm="dateConfirm" />
       </van-popup>

    <!-- Field for Category(with Popup Picker)-->
      <div v-if="transItem.type!='Transfer'">
         <van-field required :error-message="categoryError" readonly clickable label="Category" placeholder="Choose a category" :value="displayCategory" @click="showCategoryList = true" />
         <van-popup v-model="showCategoryList" position="bottom">
           <van-picker show-toolbar v-if="transItem.type=='Expense'" :columns="getExpCat" @cancel="showCategoryList = false" value-key="expCatName" @confirm="categoryConfirm" />
           <van-picker show-toolbar v-if="transItem.type=='Income'" :columns="getIncCat" value-key="incCatName" @cancel="showCategoryList = false" @confirm="categoryConfirm" />
         </van-popup>
      </div>

    <!-- Field for Amount -->
     <!-- Calculator Here -->
       <van-field readonly clickable label="Amount" :value="transAmount" @click="showCalculator = true" placeholder="0"/>
       <van-popup
        v-model="showCalculator"
        position="bottom"
        :style="{ height: '100%' }"
      >
        <calculator @closeCalculator="closeCalculator" @confirmCalculator="confirmCalculator"></calculator>
      </van-popup>
       <!-- <van-field readonly clickable label="Amount" :value="transAmount" @touchstart.native.stop="showNumbKeyboard = true" placeholder="0"/> -->
       <!-- <van-number-keyboard v-model="transAmount" :show="showNumbKeyboard" extra-key="." close-button-text="Close" @blur="showNumbKeyboard = false"/> -->

    <!-- Field for Accounts(with Popup Picker)-->
    <div v-if="transItem.type=='Expense'">
       <van-field required readonly clickable :error-message="accountError" label="Account" placeholder="Choose an account" :value="displayAccount" @click="showAccSelection">
       </van-field>

       <van-popup v-model="showAccList" position="bottom" :style="{height:'100%'}">
        <div v-if="getAccounts.length==0" style="background-color:white;text-align:center;margin:20% 0%">
          <i style="color:#aaaaaa">Please add a new account.</i>
        </div>

        <van-nav-bar left-text="Cancel" right-text="Confirm" @click-right="accConfirm(activeAccId,'account')" @click-left="cancelAccConfirm('account')" fixed/>
        <div v-if="getAccounts.length>0" style="margin-top:13%">
        <van-tree-select @click-item="showRelatedPromo" :items="expAccSelect" :active-id.sync="activeAccId" :main-active-index.sync="activeAccIndex"/>
        
        <!--Suggested Accounts' Promotion-->
        <van-cell-group v-if="activeAccIndex==0&&activeAccId!=''&&expAccSelect[0].children.length>0" title="Promotions of this account">
         <van-collapse v-model="activePromoNames">
            <van-checkbox-group v-model="promochecked">
            <van-collapse-item v-for="(promo,index) in relatedPromo" :label="promo.promodesc" :name="promo.promoid">
              <div slot="title"> 
                <strong>{{promo.promotitle}}</strong>
              </div>
              <div slot="value"> 
                Minimum: $ {{promo.minimum}}<br/>
              </div>
              <div slot="default">
                <span v-if="promo.duration==true">Valid: {{getDateFormatted(promo.fromdate)}} - {{getDateFormatted(promo.todate)}} <br/></span>
                <span v-if="promo.maxtranscount!=0">Minimum Swipe:<br/>
                  <van-progress :percentage="getSwipePercent(promo)" :pivot-text="promo.transcount" color="#7232dd" text-color="#fff" stroke-width="5"/><br/>
                </span>
                <span v-if="promo.maxtransspend!=0">Available Spend:<br/>
                  <van-progress :percentage="getTransSpendPercent(promo)" :pivot-text="promo.transspend" color="red" text-color="#fff" stroke-width="5"/><br/>
                </span>
                <span v-if="promo.rltexpense.length != getExpCat.length">Categories: {{getExpenseName(promo.rltexpense)}}<br/></span>
                <span v-if="promo.rltexpense.length == getExpCat.length">Categories: All<br/></span>
                <span v-if="promo.expmemo!=''">{{promo.expmemo}}<br/></span>
                <span>Accounts: {{getAccName(promo.rltacc)}}</span><br/>
                <span>Rewards: {{getRewardsName(promo.rltrewards)}}</span><br/>
                <van-checkbox :name="promo.promoid" style="color:red">
                  <template slot="default">
                    <span style="color:blue">Select this promotion.</span>
                  </template>
                </van-checkbox>
              </div>
            </van-collapse-item>
            </van-checkbox-group>
         </van-collapse>
        </van-cell-group>
        </div>
       </van-popup>
    </div>

    <!-- Field for Account(Income)-->
    <div v-if="transItem.type=='Income'">
       <van-field readonly required clickable :error-message="accountError" label="From" placeholder="Choose an account" :value="displayIncAccount" @click="showIncAccList = true"/>
       <van-popup v-model="showIncAccList" position="bottom">
          <div v-if="getAccounts.length==0" style="background-color:white;text-align:center;margin:10% 0%">
            <i style="color:#aaaaaa">Please add a new account.</i>
          </div>
        <div v-if="getAccounts.length>0">
          <van-nav-bar left-text="Cancel" right-text="Confirm" @click-right="accConfirm(activeAccId,'incaccount')" @click-left="cancelAccConfirm('incaccount')"/>
          <van-tree-select :items="accSelect" :active-id.sync="activeAccId" :main-active-index.sync="activeAccIndex"/>
        </div>
       </van-popup>
    </div>

    <!-- Field for From Account(Transfer)-->
    <div v-if="transItem.type=='Transfer'">
       <van-field readonly required clickable :error-message="fromAccountError" label="From" placeholder="Choose an account" :value="displayFromAccount" @click="showFromAccList = true"/>
       <van-popup v-model="showFromAccList" position="bottom">
          <div v-if="getAccounts.length==0" style="background-color:white;text-align:center;margin:10% 0%">
            <i style="color:#aaaaaa">Please add a new account.</i>
          </div>
        <div v-if="getAccounts.length>0">
          <van-nav-bar left-text="Cancel" right-text="Confirm" @click-right="accConfirm(activeFromAccId,'fromaccount')" @click-left="cancelAccConfirm('fromaccount')"/>
          <van-tree-select :items="accSelect" :active-id.sync="activeFromAccId" :main-active-index.sync="activeAccIndex"/>
        </div>
       </van-popup>
    </div>

    <!-- Field for To Account(Transfer)-->
    <div v-if="transItem.type=='Transfer'">
       <van-field readonly required clickable label="To" :error-message="toAccountError" placeholder="Choose an account" :value="displayToAccount" @click="showToAccList = true"/>
       <van-popup v-model="showToAccList" position="bottom">
          <div v-if="getAccounts.length==0" style="background-color:white;text-align:center;margin:10% 0%">
            <i style="color:#aaaaaa">Please add a new account.</i>
          </div>
        <div v-if="getAccounts.length>0">
          <van-nav-bar left-text="Cancel" right-text="Confirm" @click-right="accConfirm(activeToAccId,'toaccount')" @click-left="cancelAccConfirm('toaccount')"/>
          <van-tree-select :items="accSelect" :active-id.sync="activeToAccId" :main-active-index.sync="activeAccIndex"/>
        </div>
       </van-popup>
    </div>
    
    <!-- Field for Contents-->
    <van-field v-model="transItem.contents" label="Contents" type="textarea" rows="1" autosize />

    <!-- Recurring -->
    <van-switch-cell v-model="transItem.recurring" title="Recurring" active-color="green" inactive-color="red"/>

    <!-- Recurring Options-->
    <van-dropdown-menu v-if="transItem.recurring == true">
      <van-dropdown-item v-model="transItem.recurringtype" @change="recurringtypeChange" :options="recurringtypeoptions"/>
      <van-dropdown-item v-model="transItem.recurringtime" :disabled="recurringTimeDisabled" :options="getRecurringTime()"/>
    </van-dropdown-menu>

    <!-- Save Button-->
    <van-button type="primary" size="large" style="width:90%;margin:5%;" @click="saveNewTrans">Save</van-button>

    </van-cell-group>

    <div style="margin:10px;" v-if="relatedPromo.length>0&&promochecked==0">
      <van-notice-bar>Warning: No promotion is selected.</van-notice-bar>
    </div>

    <div style="margin:10px;" v-if="transItem.recurring==true">
      <van-notice-bar wrapable>You may need to open the application when the day you set for the recurring!</van-notice-bar>
    </div>
  </div>
</template>

<script>
  //import Calculator
  import Calculator from './Calculator.vue'
  export default{
    data(){
      return{
        title:"Edit Transactions",

        //Variables Initialize
        transItem:{},
        transOptions:['Expense','Income','Transfer'],
        expAccSelect:[],
        accSelect:[],
        activeAccId:'',
        activeFromAccId:'',
        activeToAccId:'',
        activeAccIndex:0,
        relatedPromo:[],
        showPromoSec:false,
        activePromoNames:[],
        promochecked:[],

        //Picker Initialize
        showTransOptions:false,
        showTransDate:false,
        showCategoryList:false,
        showNumbKeyboard:false,
        showAccList:false,
        showIncAccList:false,
        showFromAccList:false,
        showToAccList:false,
        suggestListPop:false,
        showCalculator:false,
        recurringtypeoptions:[
          {text:'Daily',value:0},
          {text:'Weekly',value:1},
          {text:'Monthly',value:2},
        ],
        recurringTimeDisabled:true,

        //Display Variables
        transDate:'', //Default Display Date
        displayCategory:'',
        displayFromAccount:'',
        displayAccount:'',
        displayIncAccount:'',
        displayToAccount:'',
        transAmount:'',

        //Error Msg Initialize
        categoryError:'',
        accountError:'',
        fromAccountError:'',
        toAccountError:'',
      }
    },
    methods:{
      //Set Default
      setDefault(){
        this.transItem = {};
        this.transDate='', //Default Display Date
        this.transItem.amount = 0;
        this.transAmount = ''; 
        this.accountError = '';
        this.fromAccountError = '';
        this.toAccountError = '';
        this.categoryError = '';
        this.displayAccount = '';
        this.displayIncAccount = '';
        this.displayCategory = '';
        this.displayFromAccount='';
        this.displayToAccount='';
      },
      //Back Button
      back(){
        this.$emit('closeEditTrans'); 
      },
      //Transaction Type Confirm
      transTypeConfirm(value){
        this.transItem.type = value;
        this.showTransOptions = false;
        this.transItem.category = '';
        this.displayCategory = '';
        this.transItem.fromaccount = '';
        this.transItem.toaccount = '';
        this.displayIncAccount = '';
        this.displayFromAccount = '';
        this.displayToAccount = '';
      },

      //Date Confirm
      dateConfirm(value){
        this.transItem.date = value;
        this.transDate = this.$moment(value).format('Do MMMM YYYY');
        this.showTransDate = false;
      },

      //Category Confirm
      categoryConfirm(value){
        if(this.transItem.type=='Expense'){
          this.transItem.category = value.expcatid;
          this.displayCategory = value.expCatName;
        }
        else if(this.transItem.type=='Income'){
          this.transItem.category = value.inccatid;
          this.displayCategory = value.incCatName;
        }
        this.showCategoryList = false;
      },

      //Show Account List Selection
      showAccSelection(){
        let rqm = {};
        rqm.transdate = this.transItem.date;

        if(this.transItem.category)
          rqm.transcat = this.transItem.category;
        else
          rqm.transcat = '';

        if(this.transAmount == '')
          rqm.transamount = 0; 
        else
          rqm.transamount = parseFloat(this.transAmount); 

        this.$store.commit("genSuggestAcc",rqm); 
        console.log(this.expAccSelect);
        if(this.expAccSelect){
          this.expAccSelect[0].children = this.getSuggestAcc;
          this.expAccSelect[0].info = this.expAccSelect[0].children.length;
        }
        this.showAccList = true; 
      },

      //Show Related Promotion of Account
      showRelatedPromo(data){
        this.relatedPromo = [];
        this.activePromoNames = [];
        for(let i in data.rltpromo){
          let temp = this.getPromo.find(o => o.promoid == data.rltpromo[i]); 
          this.activePromoNames.push(data.rltpromo[i]);
          this.relatedPromo.push(temp);
        }
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

      //Account Confirm
      accConfirm(value,type){
        if(value){
         let temp = this.getAccounts.find(o=>o.accid==value);
         switch(type){
           case 'account':
             this.transItem.account = value;
             this.displayAccount = temp.name;
             this.showAccList = false;
             break;
            case 'incaccount':
             this.transItem.account = value;
             this.displayIncAccount = temp.name;
             this.showIncAccList = false;
             break;
            case 'fromaccount':
             this.transItem.fromaccount = value;
             this.displayFromAccount = temp.name;
             this.showFromAccList = false;
             break;
            case 'toaccount':
             this.transItem.toaccount = value;
             this.displayToAccount = temp.name;
             this.showToAccList = false;
             break;
        
          }
        }
      },

      //Cancel Account Confirm
      cancelAccConfirm(value){
        switch(value){
          case 'account':
            this.displayAccount = '';
            this.activeAccId = '';
            this.showAccList = false;
            break;
          case 'incaccount':
            this.displayAccount = '';
            this.activeAccId = '';
            this.showIncAccList = false;
            break;
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
          this.transItem.recurringtime = 1;
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
          if(this.transItem.type=="Expense"){
            this.transItem.usedpromo = this.promochecked;
          }
          this.$store.commit('editTrans',this.transItem);
          this.$store.dispatch('storeAllStateData');
          this.$notify({message:'Transaction Edited',type:'success',duration:3000});
          this.back();
        }       
      },

    getSwipePercent(promo){
      let result = promo.transcount / promo.maxtranscount;
      result = result * 100;
      return result; 
    },
    getTransSpendPercent(promo){
      let result = promo.transspend / promo.maxtransspend;
      result = result * 100;
      result = _.round(result,1);
      return result; 
    },
      
      //Save Validation
      addTransValidation(value){
        let validstate = value;
        if(this.transItem.type != 'Transfer'){
          if(this.transItem.category==null){
            this.categoryError = "Please choose a category";
            validstate=true;
          }
          if(this.transItem.account == null){
            this.accountError = "Please choose an account";
            validstate=true;
          }
        }else{
          if(this.transItem.fromaccount == null){
            this.fromAccountError = "Please choose a from account";
            validstate = true;
          } 
          if(this.transItem.toaccount == null){
            this.toAccountError = "Please choose a to account";
            validstate = true;
          } 
        } 
        return validstate;
      }, 
      
      //Delete Transactions
      deleteTrans(){
        this.$dialog.confirm({
            message:'Are you sure to delete?'
          }).then(()=>{
            this.$store.commit('deleteTrans',this.transItem.transid);
            this.$store.dispatch('storeAllStateData');
            this.back();
          }).catch(()=>{
              this.$dialog.close();
          });
      },

       //Calculator Emit Event Methods
      closeCalculator(){
        this.showCalculator=false
      },
      confirmCalculator(calcResult){
        this.transAmount = parseFloat(calcResult);
        this.showCalculator=false;
      }

    },
    computed:{
      getDays(){
        var days = [];
        for(let i=0;i<31;i++) {
          let tempitem = {text:days.length+1,value:days.length+1};
          days.push(tempitem);
        }
        return days;
      },
      getExpCat(){
        return this.$store.state.expCat;
      },
      getIncCat(){
        return this.$store.state.incCat;
      },
      getAccounts(){
        return this.$store.state.allAccounts;
      },
      getAccGroups(){
        return this.$store.state.accGroups;
      },
      getPromo(){
        return this.$store.state.allPromo;
      },
      getRewardsCat(){
        return this.$store.state.rewardsCat;
      },
      getSuggestedGroupedAccounts(){ 
        let grouped = [];
        let suggestAcc = {
          text:'Suggest',
          children:[],
        };
        suggestAcc.info = suggestAcc.children.length;
        grouped.push(suggestAcc);
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
      getSuggestAcc(){
        return this.$store.state.suggestAcc; 
      },
    },
    beforeMount(){
      this.expAccSelect = this.getSuggestedGroupedAccounts;
      this.accSelect = this.getGroupedAccounts;
    },
    watch:{
      trans(){ 
        this.transItem = Object.assign({},this.trans);
        if(this.transItem){
        if(this.transItem.type == 'Expense'){
          let tempCat = this.getExpCat.find(o=>o.expcatid==this.transItem.category);
          if(tempCat)
            this.displayCategory = tempCat.expCatName;
          else
            this.displayCategory = 'Other';
          let tempAcc = this.getAccounts.find(o=>o.accid==this.transItem.account);
          if(tempAcc)
            this.displayAccount = tempAcc.name;
          else
            this.displayAccount = '';
          this.promochecked = this.transItem.usedpromo;
          this.activeAccId = this.transItem.account;
        }
        else if(this.transItem.type == 'Income'){
          let tempCat = this.getIncCat.find(o=>o.inccatid==this.transItem.category);
          if(tempCat)
            this.displayCategory = tempCat.incCatName;
          else
            this.displayCategory = 'Other';
          let tempAcc = this.getAccounts.find(o=>o.accid==this.transItem.account);
          if(tempAcc)
            this.displayIncAccount = tempAcc.name;
          else
            this.displayIncAccount = '';
          this.activeAccId = this.transItem.account;
        }
        else if(this.transItem.type=='Transfer'){
          let tempFromAcc = this.getAccounts.find(o=>o.accid==this.transItem.fromaccount);
          if(tempFromAcc)
            this.displayFromAccount = tempFromAcc.name;
          let tempToAcc = this.getAccounts.find(o=>o.accid==this.transItem.toaccount);
          if(tempToAcc)
            this.displayToAccount = tempToAcc.name;  
          this.activeFromAccId = this.transItem.fromaccount;
          this.activeToAccId = this.transItem.toaccount;
        }
        this.transDate = this.$moment(this.transItem.date).format('DD MMMM YYYY');
        if(this.transItem.amount)
          this.transAmount = this.transItem.amount.toString();
        }
      }
    },
    mounted(){ 
        this.transItem = Object.assign({},this.trans);
        if(this.transItem){
        if(this.transItem.type == 'Expense'){
          let tempCat = this.getExpCat.find(o=>o.expcatid==this.transItem.category);
          if(tempCat)
            this.displayCategory = tempCat.expCatName;
          else
            this.displayCategory = 'Other';
          let tempAcc = this.getAccounts.find(o=>o.accid==this.transItem.account);
          if(tempAcc)
            this.displayAccount = tempAcc.name;
          else
            this.displayAccount = '';
          this.activeAccId = this.transItem.account;
          this.promochecked = this.transItem.usedpromo;
        }
        else if(this.transItem.type == 'Income'){
          let tempCat = this.getIncCat.find(o=>o.inccatid==this.transItem.category);
          if(tempCat)
            this.displayCategory = tempCat.incCatName;
          else
            this.displayCategory = 'Other';
          let tempAcc = this.getAccounts.find(o=>o.accid==this.transItem.account);
          if(tempAcc)
            this.displayIncAccount = tempAcc.name;
          else
            this.displayIncAccount = '';
          this.activeAccId = this.transItem.account;
        }
        else if(this.transItem.type=='Transfer'){
          let tempFromAcc = this.getAccounts.find(o=>o.accid==this.transItem.fromaccount);
          if(tempFromAcc)
            this.displayFromAccount = tempFromAcc.name;
          let tempToAcc = this.getAccounts.find(o=>o.accid==this.transItem.toaccount);
          if(tempToAcc)
            this.displayToAccount = tempToAcc.name;  
          this.activeFromAccId = this.transItem.fromaccount;
          this.activeToAccId = this.transItem.toaccount;
        }
        this.transDate = this.$moment(this.transItem.date).format('DD MMMM YYYY');
        if(this.transItem.amount)
          this.transAmount = this.transItem.amount.toString();
        }
    },
    components:{
      "calculator":Calculator
    },
    props:['trans']
  
  }
</script>
