<template>
  <div style="padding-top:13%">
    <!-- Top Nav Bar-->
    <van-nav-bar :title="title" left-text="Back" left-arrow @click-left="back()" @click-right="deleteAcc()" fixed>
      <template slot="right">
        <van-icon name="delete" size="15px"/>
        <span style="color:#1989fa;font-size:15px">Delete</span>
      </template>
    </van-nav-bar>


    <van-cell-group>

      <!-- Account Group -->
      <van-field :value="displayAccGroup" label="Group" required readonly clickable placeholder="Choose a group" @click="showGroupPicker = true"/>

      <!--To check if group selected-->
      <div v-if="accItem.accgroup!=null">
       
      <!-- Account Name -->
        <van-field required v-model="accItem.name" clearable label="Name" placeholder="Name of account" :error-message="accNameError" />

      <!-- To check if group is Credit Card or Debit Card -->
        <div v-if="accItem.accgroup==1||accItem.accgroup==2">
      <!--Last 4 Digits-->
          <van-field readonly placeholder="XXXX" clickable label="Last 4 digits" :value="accItem.last4digits" @touchstart.native.stop="showNumbKeyboard = true"/>

      <!--Expiry--> 
          <van-field readonly required clickable placeholder="MM/YY" label="Expiry" :value="displayExpiry" @click="showExpiryDate = true" :error-message="expiryError" />

      <!--Card Type--> 
          <van-field readonly required clickable label="Card Type" :value="accItem.cardtype" placeholder="Type of the card" @click="showCardTypes = true" :error-message="cardtypeError"/>
      <!-- Bank -->    
          <van-field v-model="accItem.bank" clearable label="Bank" placeholder="Bank of the card" />

        </div>
      <!-- To check if group is Credit Card-->
        <div v-if="accItem.accgroup==1">
      <!--Statement Date-->
          <van-field readonly clickable label="Statement Date" :value="displaySDate" placeholder="Choose a date" @click="showSDatePicker = true" required :error-message="sdateError"/>

      <!-- Payment Due Date-->
          <van-field readonly clickable label="Payment Due Date" :value="displayPDueDate" placeholder="Choose a date" @click="showPDueDatePicker = true" required :error-message="pduedateError"/>
        </div>

        <!--To check if group is NOT Credit Card-->
        <div v-if="accItem.accgroup!=1">
        <!--Balance-->   
          <van-field readonly placeholder="0" clickable label="Balance" :value="displayBalance" @touchstart.native.stop="showBalanceNumbKeyboard = true"/>

        </div>

      <van-field v-model="accItem.contents" label="Contents" type="textarea" placeholder="Insert contents" rows="1" autosize/>

      <van-button type="primary" size="large" style="width:90%;margin:5%;" @click="saveNewAcc">Save</van-button>
      </div>

    </van-cell-group> 
  
    <!--Pop Ups-->
    <!--Account Group Picker-->
    <van-popup v-model="showGroupPicker" position="bottom">
      <van-picker show-toolbar :columns="getAccGrps" value-key="groupName" @cancel="showGroupPicker = false" @confirm="accGroupConfirm"/> 
    </van-popup>
    <!--Expiry Date Picker-->
    <van-popup v-model="showExpiryDate" position="bottom">
      <van-datetime-picker v-model="accItem.expiry" type="year-month" @cancel="showExpiryDate=false" @confirm="expiryDateConfirm" />
    </van-popup>
    <!--Card Type Picker-->
    <van-popup v-model="showCardTypes" position="bottom">
        <van-picker show-toolbar :columns="cardTypes" @cancel="showCardTypes = false" @confirm="cardTypesConfirm"/> 
    </van-popup>
    <!-- Statement Date Picker-->
    <van-popup v-model="showSDatePicker" position="bottom">
        <van-picker show-toolbar :columns="getDays" @cancel="showSDatePicker = false" @confirm="sDateConfirm"/> 
    </van-popup>
    <!--Payment Due Date Picker-->
    <van-popup v-model="showPDueDatePicker" position="bottom">
        <van-picker show-toolbar :columns="getDays" @cancel="showPDueDatePicker = false" @confirm="pDueDateConfirm"/> 
    </van-popup>

    <!--Number Keyboards-->
    <!--Last 4 Digits Keyboard-->
    <van-number-keyboard v-model="accItem.last4digits" :show="showNumbKeyboard" :maxlength="4" close-button-text="Close" @blur="showNumbKeyboard = false"/>
    <!--Balance Keyboard-->
    <van-number-keyboard v-model="displayBalance" :show="showBalanceNumbKeyboard" extra-key="." close-button-text="Close" @blur="showBalanceNumbKeyboard = false"/>

  </div>
</template>
<script>
  export default{
    data(){
      return{
        //Title
        title:"Edit Account",
      
        //Variable Initialize
        accItem:{},
        accGroup:[],
        cardTypes:['Visa','Master'],

        //Display Variables
        displayExpiry:'',
        displayBalance:'',
        displayAccGroup:'',
        displaySDate:'',
        displayPDueDate:'',

        //Picker Initialize
        showGroupPicker:false,
        showNumbKeyboard:false,
        showExpiryDate:false,
        showCardTypes:false,
        showSDatePicker:false,
        showPDueDatePicker:false,
        showBalanceNumbKeyboard:false,

        //Error Messages Initialize
        accNameError:'',
        expiryError:'',
        cardtypeError:'',
        sdateError:'',
        pduedateError:'',

      }
    },
    methods:{
      //Set Default
      setDefault(){
       this.displayExpiry='';
       this.displayBalance='';
       this.displayAccGroup='';
       this.accNameError='';
       this.expiryError='';
       this.cardtypeError='';
       this.sdateError='';
       this.pduedateError='';
      
      },

      //Back to Account Page
      back(){
        this.$emit("closeEditAcc"); 
      },

      //Account Group Confirm
      accGroupConfirm(value){
        this.accItem.accgroup = value.grpid;
        this.displayAccGroup = value.groupName;
        this.showGroupPicker=false; 
      },

      //Expiry Confirm
      expiryDateConfirm(value){
        this.displayExpiry = this.$moment(value).format('MM/YY');
        this.showExpiryDate = false;
      },

      //Card Type Confirm
      cardTypesConfirm(value){
        this.accItem.cardtype = value;
        this.showCardTypes = false;
      },

      //SDate Confirm
      sDateConfirm(value){
        this.accItem.sdate = value;
        this.showSDatePicker = false;
        this.displaySDate = this.accItem.sdate;
      },

      //Payment Due Date Confirm
      pDueDateConfirm(value){
        this.accItem.pduedate = value;
        this.showPDueDatePicker = false;
        this.displayPDueDate = this.accItem.pduedate;
      },

      //Save New Account
      saveNewAcc(){
        let hasError = false;
        hasError = this.saveValidation(hasError);
        if(hasError==false){
          if(this.accItem.accgroup!=1&&this.displayBalance==''){
            this.accItem.balance = 0;
          }
          else if(this.accItem.accgroup!=1){
            this.accItem.balance = parseFloat(this.displayBalance);
          }
          else if(this.accItem.accgroup==1){
            this.accItem.sattlestatus = 'Not Settled';
            //this.accItem.dueamount = 0;
            //this.accItem.outstdbalance = 0;
            this.accItem.sdate = this.displaySDate + this.$moment(new Date()).format(' MMMM YYYY');
            this.accItem.pduedate = this.displayPDueDate + this.$moment(new Date()).format(' MMMM YYYY');
            this.accItem.cutoffdate = this.$moment(this.accItem.sdate).toDate();
            this.accItem.cutoffdate = this.$moment(this.accItem.cutoffdate).add('1','months').format('D MMMM YYYY');
            this.accItem.nextduedate = this.$moment(this.accItem.pduedate).toDate();
            this.accItem.nextduedate = this.$moment(this.accItem.nextduedate).add('1','months').format('D MMMM YYYY');  
          }
          this.acc = this.accItem;
          this.$store.commit('editAccount',this.accItem);
          this.$store.dispatch('storeAllStateData');
          this.$notify({message:'Account Edited',type:'success',duration:3000});
          this.back();
        } 
      },
      //Delete Account
      deleteAcc(){
            this.$dialog.confirm({
              message:'Are you sure to delete?'
            }).then(()=>{
              this.$store.commit('deleteAccount',this.accItem.accid);
              this.$store.dispatch('storeAllStateData');
              this.$notify({message:'Account Deleted',type:'success',duration:3000});
              this.back();
            }).catch(()=>{
              this.$dialog.close();
            });
      },
      //Add Account Validation
      saveValidation(value){
        let validstate = value; 
        if(this.accItem.accgroup==1){
          if(this.accItem.name==null){
            this.accNameError="Please insert name of the account";
            validstate = true;
          }
          if(this.accItem.expiry==null){
            this.expiryError="Please insert expiry date";
            validstate = true;
          }
          if(this.accItem.cardtype==null){
            this.cardtypeError="Please insert card type";
            validstate = true;
          }
          if(this.accItem.sdate==null){
            this.sdateError="Please insert statement date";
            validstate = true;
          }
          if(this.accItem.pduedate==null){
            this.pduedateError="Please insert payment due date";
            validstate = true;
          }
          if(this.accItem.sdate>this.accItem.pduedate){
            this.sdateError="Payment due date must later than statement date";
            this.pduedateError="Payment due date must later than statement date"; 
            validstate = true;
          }
        }else if(this.accItem.accgroup=='Debit Card'){
          if(this.accItem.name==null){
            this.accNameError="Please insert name of the account";
            validstate = true;
          }
          if(this.accItem.expiry==null){
            this.expiryError="Please insert expiry date";
            validstate = true;
          }
          if(this.accItem.cardtype==null){
            this.cardtypeError="Please insert card type";
            validstate = true;
          } 
        }else{
          if(this.accItem.name==null){
            this.accNameError="Please insert name of the account";
            validstate = true;
          } 
        } 
        return validstate;
      },    
    },
    computed:{
      getDays(){
        var days = [];
        for(let i=0;i<31;i++) {
          days.push(days.length+1);
        }
        return days;
      },
      getAccGrps(){
        return this.$store.state.accGroups; 
      },
      getAccounts(){
        return this.$store.state.allAccounts;
      }
    },
    watch:{
      acc(){
        this.accItem = this.acc;  
        if(this.accItem){
        let temp = this.getAccGrps.find(o=>o.grpid == this.accItem.accgroup);
        this.displayAccGroup = temp.groupName;
        if(this.accItem.balance)
          this.displayBalance = this.accItem.balance.toString();
        if(this.accItem.accgroup == 1 || this.accItem.accgroup ==2){
          if(this.accItem.expiry)
            this.displayExpiry = this.$moment(this.accItem.expiry).format('MM/YY');
        }
        if(this.accItem.accgroup == 1){
            this.displaySDate = this.$moment(this.accItem.sdate).date();
            this.displayPDueDate = this.$moment(this.accItem.pduedate).date();
            //this.accItem.sdate = parseInt(this.displaySDate);
            //this.accItem.pduedate = parseInt(this.displayPDueDate);
          }
        }
      }
    },
    mounted(){
       this.accItem = this.acc;  
       if(this.accItem){
        let temp = this.getAccGrps.find(o=>o.grpid == this.accItem.accgroup);
        this.displayAccGroup = temp.groupName;
        if(this.accItem.balance)
          this.displayBalance = this.accItem.balance.toString();
        if(this.accItem.accgroup == 1 || this.accItem.accgroup ==2){
          if(this.accItem.expiry)
            this.displayExpiry = this.$moment(this.accItem.expiry).format('MM/YY');
        }
        if(this.accItem.accgroup == 1){
            this.displaySDate = this.$moment(this.accItem.sdate).date();
            this.displayPDueDate = this.$moment(this.accItem.pduedate).date();
            //this.accItem.sdate = parseInt(this.displaySDate);
            //this.accItem.pduedate = parseInt(this.displayPDueDate);
        }
      }
    },
    props:['acc']
  }
</script> 
