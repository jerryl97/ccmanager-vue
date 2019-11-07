<template>
  <div style="padding-top:13%">
    <!--Top Navbar-->
    <van-nav-bar :title="title" fixed>
      <template slot="title">
        <van-icon color="#333333" name="add-o"/>&nbsp
        <strong>{{title}}</strong>
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
                <van-checkbox :name="promo.promoid">Use this promotion</van-checkbox>
                <!--<van-button type="info" size="mini" @click="showEditPromo(promo)">Edit</van-button>
                <van-button type="danger" size="mini" @click="deletePromo(promo.promoid)">Delete</van-button>-->
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
       <van-field readonly required clickable :error-message="accountError" label="Account" placeholder="Choose an account" :value="displayIncAccount" @click="showIncAccList = true"/>
       <van-popup v-model="showIncAccList" position="bottom">
        <van-nav-bar left-text="Cancel" right-text="Confirm" @click-right="accConfirm(activeAccId,'incaccount')" @click-left="cancelAccConfirm('incaccount')"/>
        <div v-if="getAccounts.length>0">
          <van-tree-select :items="accSelect" :active-id.sync="activeAccId" :main-active-index.sync="activeAccIndex"/>
        </div>
        <div v-if="getAccounts.length==0" style="background-color:white;text-align:center;margin:10% 0%">
            <i style="color:#aaaaaa">Please add a new account.</i>
        </div>
       </van-popup>
    </div>

    <!-- Field for From Account(Transfer)-->
    <div v-if="transItem.type=='Transfer'">
       <van-field readonly required clickable :error-message="fromAccountError" label="From" placeholder="Choose an account" :value="displayFromAccount" @click="showFromAccList = true"/>
       <van-popup v-model="showFromAccList" position="bottom">
        <van-nav-bar left-text="Cancel" right-text="Confirm" @click-right="accConfirm(activeFromAccId,'fromaccount')" @click-left="cancelAccConfirm('fromaccount')"/>
        <div v-if="getAccounts.length==0" style="background-color:white;text-align:center;margin:10% 0%">

            <i style="color:#aaaaaa">Please add a new account.</i>
          </div>
        <div v-if="getAccounts.length>0">
          <van-tree-select :items="accSelect" :active-id.sync="activeFromAccId" :main-active-index.sync="activeAccIndex"/>
        </div>
       </van-popup>
    </div>

    <!-- Field for To Account(Transfer)-->
    <div v-if="transItem.type=='Transfer'">
       <van-field readonly required clickable label="To" :error-message="toAccountError" placeholder="Choose an account" :value="displayToAccount" @click="showToAccList = true"/>
       <van-popup v-model="showToAccList" position="bottom">
          <van-nav-bar left-text="Cancel" right-text="Confirm" @click-right="accConfirm(activeToAccId,'toaccount')" @click-left="cancelAccConfirm('toaccount')"/>
          <div v-if="getAccounts.length==0" style="background-color:white;text-align:center;margin:10% 0%">
            <i style="color:#aaaaaa">Please add a new account.</i>
          </div>
        <div v-if="getAccounts.length>0">
          <van-tree-select :items="accSelect" :active-id.sync="activeToAccId" :main-active-index.sync="activeAccIndex"/>
        </div>
       </van-popup>
    </div>
    
    <!-- Field for Contents-->
    <van-field v-model="transItem.contents" clearable label="Contents" type="textarea" rows="1" autosize />

    <!-- Recurring -->
    <van-switch-cell v-model="transItem.recurring" title="Recurring" active-color="#07c160" inactive-color="#f6f6f6"/>

    <!-- Recurring Options-->
    <van-dropdown-menu v-if="transItem.recurring == true">
      <van-dropdown-item v-model="transItem.recurringtype" @change="recurringtypeChange" :options="recurringtypeoptions"/>
      <van-dropdown-item v-model="transItem.recurringtime" :disabled="recurringTimeDisabled" :options="getRecurringTime()"/>
    </van-dropdown-menu>

    <!-- Save Button-->
    <van-button type="primary" size="large" style="width:90%;margin:5%;" @click="saveNewTrans">Save</van-button>
    </van-cell-group>

    <!--Budget-->
    <div style="margin:10px;text-align:center" v-if="getBudgetStat==true"> 
      <span style="font-size:15px;">Monthly Budget: $ {{getTotalSpend()}}/{{getBudgetAmount}}</span><br/>

      <van-progress v-if="getBudgetPercent()<=100":percentage="getBudgetPercent()" style="margin-top:10px;" :pivot-text="getBudgetPercent()+'%'" color="#f2826a" text-color="#fff" stroke-width="5"/>
      <span style="color:red;font-size:15px;" v-if="getBudgetPercent()>100">Over Budget!!</span>

    </div>

  </div>
</template>

<script>
//import Calculator
import Calculator from './Calculator.vue'

  export default{
    data(){
      return{
        title:"Add Transactions",

        //Variables Initialize
        transItem:{
          type:'Expense',
          date:new Date(),
          category:'',
          recurring:false,
          contents:'',
          amount:0,
          recurringtype:0,
          recurringtime:0,
          forSettle:false,

        },
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
        promochecked:[],

        //Display Variables
        transDate:this.$moment(new Date()).format('DD MMMM YYYY'), //Default Display Date
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
        this.transItem.type = 'Expense';
        this.transItem.date = new Date();
        this.transDate=this.$moment(new Date()).format('DD MMMM YYYY'), //Default Display Date
        this.transItem.amount = 0;
        this.transItem.recurring = false;
        this.transItem.contents = '';
        this.transItem.category = '';
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
        this.accSelect=[];
        this.expAccSelect=[];
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
        this.transDate = this.$moment(value).format('DD MMMM YYYY');
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
      //Account Confirm
      accConfirm(value,type){
        if(value){
         let temp = this.getAccounts.find(o=>o.accid==value);
         switch(type){
           case 'account':
             this.transItem.account = value;
             if(temp.accgroup!=1&&temp.accgroup!=2)
              this.displayAccount = temp.name;
             else
              this.displayAccount = temp.name+'('+temp.last4digits+')';
             this.showAccList = false;
             break;
            case 'incaccount':
             this.transItem.account = value;
             if(temp.accgroup!=1&&temp.accgroup!=2)
              this.displayIncAccount = temp.name;
             else
              this.displayIncAccount = temp.name+'('+temp.last4digits+')';
             this.showIncAccList = false;
this.activeAccId = '';
             break;
            case 'fromaccount':
             this.transItem.fromaccount = value;
             if(temp.accgroup!=1&&temp.accgroup!=2)
              this.displayFromAccount = temp.name;
             else
              this.displayFromAccount = temp.name+'('+temp.last4digits+')';
             this.showFromAccList = false;
             break;
            case 'toaccount':
             this.transItem.toaccount = value;
             if(temp.accgroup!=1&&temp.accgroup!=2)
              this.displayToAccount = temp.name;
             else
              this.displayToAccount = temp.name+'('+temp.last4digits+')';
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
            this.activeFromAccId = '';
            this.showFromAccList = false;
            break;
          case 'toaccount':
            this.displayToAccount = '';
            this.activeToAccId = '';
            this.showToAccList = false;
            break;
        }
      },
      recurringtypeChange(value){
        if(value == 1){
          this.transItem.recurringtime = 7;
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
          this.$store.commit('addTrans',this.transItem);
          this.$store.commit('updatePromoSwipeSpend');
          this.$store.dispatch('storeAllStateData');
          if(this.getBudgetStat){
            if(this.getTotalSpend > this.getBudgetAmount){
              this.$notify({message:'Transaction Added',type:'success',duration:3000});
              this.$notify({message:'Over Monthy Budget!!',type:'danger',duration:3000});
            }else{
              this.$notify({message:'Transaction Added',type:'success',duration:3000});
            }
          }else{
              this.$notify({message:'Transaction Added',type:'success',duration:3000});
          }
          this.setDefault();
          this.$router.push({path:'/main/acctrans',query:{activeTab:1}});
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
      return result; 
    },
      
      //Save Validation
      addTransValidation(value){
        let validstate = value;
        if(this.transItem.type != 'Transfer'){
          if(this.transItem.category==''){
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

       //Calculator Emit Event Methods
      closeCalculator(){
        this.showCalculator=false
      },
      confirmCalculator(calcResult){
        this.transAmount = parseFloat(calcResult);
        this.showCalculator=false;
      },
      getTotalSpend(){
        let today =  new Date();
        let filteredTrans = _.filter(this.getTrans,x=>{
          let temptoday = this.$moment(today);
          let tempdate = this.$moment(x.date);
          return temptoday.month() == tempdate.month() && temptoday.year() == tempdate.year() && x.type=='Expense';
        });

        let result = 0;
        for(let i in filteredTrans){
          result += filteredTrans[i].amount;
        }
        return result;
      },
      getBudgetPercent(){
        let result = 0;
        if(this.getBudgetStat){
          result = (this.getTotalSpend() / this.getBudgetAmount) * 100;
          result = _.round(result,1);
          return result;
        }
      },

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
      getTrans(){
        return this.$store.state.allTrans;
      },
      getBudgetStat(){
        return this.$store.state.budgetStat;
      },
      getBudgetAmount(){
        return this.$store.state.budgetAmount;
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
      getRewardsCat(){
        return this.$store.state.rewardsCat;
      }
    },
    mounted(){
      this.expAccSelect = this.getSuggestedGroupedAccounts;
      this.accSelect = this.getGroupedAccounts;
    },
    components:{
      "calculator":Calculator
    }
  }
</script>
