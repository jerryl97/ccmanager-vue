<template>
  <div>
    <!--Top Navbar-->
    <van-nav-bar :title="title"/>

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
       <van-field readonly clickable label="Amount" :value="transAmount" @touchstart.native.stop="showNumbKeyboard = true" placeholder="0"/>
       <van-number-keyboard v-model="transAmount" :show="showNumbKeyboard" extra-key="." close-button-text="Close" @blur="showNumbKeyboard = false"/>

    <!-- Field for Accounts(with Popup Picker)-->
    <div v-if="transItem.type!='Transfer'">
       <van-field required readonly clickable :error-message="accountError" label="Account" placeholder="Choose an account" :value="displayAccount" @click="showAccSelection">
       </van-field>

       <van-popup v-model="showAccList" position="bottom">
        <van-nav-bar left-text="Cancel" right-text="Confirm" @click-right="accConfirm(activeAccId,'account')" @click-left="cancelAccConfirm('account')"/>
        <van-tree-select :items="accountSelect" :active-id.sync="activeAccId" :main-active-index.sync="activeAccIndex"/>
       </van-popup>
       <van-popup v-model="suggestListPop" position="bottom">
        <p>haha</p> 
       </van-popup>
    </div>

    <!-- Field for From Account(Transfer)-->
    <div v-if="transItem.type=='Transfer'">
       <van-field readonly required clickable :error-message="fromAccountError" label="From" placeholder="Choose an account" :value="displayFromAccount" @click="showFromAccList = true"/>
       <van-popup v-model="showFromAccList" position="bottom">
        <van-nav-bar left-text="Cancel" right-text="Confirm" @click-right="accConfirm(activeAccId,'fromaccount')" @click-left="cancelAccConfirm('fromaccount')"/>
        <van-tree-select :items="accountSelect" :active-id.sync="activeAccId" :main-active-index.sync="activeAccIndex"/>
       </van-popup>
    </div>

    <!-- Field for To Account(Transfer)-->
    <div v-if="transItem.type=='Transfer'">
       <van-field readonly required clickable label="To" :error-message="toAccountError" placeholder="Choose an account" :value="displayToAccount" @click="showToAccList = true"/>
       <van-popup v-model="showToAccList" position="bottom">
        <van-nav-bar left-text="Cancel" right-text="Confirm" @click-right="accConfirm(activeAccId,'toaccount')" @click-left="cancelAccConfirm('toaccount')"/>
        <van-tree-select :items="accountSelect" :active-id.sync="activeAccId" :main-active-index.sync="activeAccIndex"/>
       </van-popup>
    </div>
    
    <!-- Field for Contents-->
    <van-field v-model="transItem.contents" label="Contents" type="textarea" rows="1" autosize />

    <!-- Save Button-->
    <van-button type="primary" size="large" style="width:90%;margin:5%;" @click="saveNewTrans">Save</van-button>

    </van-cell-group>

  </div>
</template>

<script>
  export default{
    data(){
      return{
        title:"Add Transactions",

        //Variables Initialize
        transItem:{
          type:'Expense',
          date:new Date(),
        },
        transOptions:['Expense','Income','Transfer'],
        accountSelect:[],
        activeAccId:'',
        activeAccIndex:0,

        //Picker Initialize
        showTransOptions:false,
        showTransDate:false,
        showCategoryList:false,
        showNumbKeyboard:false,
        showAccList:false,
        showFromAccList:false,
        showToAccList:false,
        suggestListPop:false,

        //Display Variables
        transDate:this.$moment(new Date()).format('DD MMMM YYYY'), //Default Display Date
        displayCategory:'',
        displayFromAccount:'',
        displayAccount:'',
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
        this.transAmount = ''; 
        this.accountError = '';
        this.fromAccountError = '';
        this.toAccountError = '';
        this.categoryError = '';
        this.displayAccount = '';
        this.displayCategory = '';
        this.displayFromAccount='';
        this.displayToAccount='';
      },

      //Transaction Type Confirm
      transTypeConfirm(value){
        this.transItem.type = value;
        this.showTransOptions = false;
        this.transItem.category = '';
        this.displayCategory = '';
        this.transItem.fromaccount = '';
        this.transItem.toaccount = '';
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
        this.accountSelect[0].children = this.getSuggestAcc;
        this.accountSelect[0].info = this.accountSelect[0].children.length;
        console.log(this.accountSelect[0]);
        this.showAccList = true; 
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
             this.activeAccId = '';
             break;
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
          case 'account':
            this.displayAccount = '';
            this.activeAccId = '';
            this.showAccList = false;
            break;
          case 'fromaccount': 
            this.displayFromAccount = '';
            this.activeAccId = '';
            this.showAccList = false;
            break;
          case 'toaccount':
            this.displayToAccount = '';
            this.activeAccId = '';
            this.showAccList = false;
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
          this.setDefault();
          this.$router.push({path:'/acctrans',query:{activeTab:1}});
        }       
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

    },
    computed:{
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
      getGroupedAccounts(){ 
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
      getSuggestAcc(){
        return this.$store.state.suggestAcc; 
      },
    },
    updated(){
      this.accountSelect = this.getGroupedAccounts; 
    }, 
  }
</script>
