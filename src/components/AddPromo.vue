<template>
  <div style="padding-top:13%">
    <!--Top Nav Bar-->
    <van-nav-bar :title="title" left-arrow left-text="Back" @click-left="back()" fixed @click-right="getSMS()">
      <template slot="right">
        <van-icon color="#1989fa" name="envelop-o"/>
        <span style="color:#1989fa">SMS</span>
      </template>
    </van-nav-bar>

    <!--Add Promotion Steps-->
    <van-steps :active="activeStep">
      <van-step>Step 1</van-step>
      <van-step>Step 2</van-step>
      <van-step>Step 3</van-step>
      <van-step>Step 4</van-step>
      <van-step>Step 5</van-step>
    </van-steps>

    <!--Promotion’s Info-->
    <van-cell-group title="Promotion's Info" v-if="activeStep==0">
      <!--Promotion's Title-->
      <van-field label="Title" clearable placeholder="Promotion's Title" v-model="promoItem.promotitle" required :error-message="titleErrorMsg"/>
      <!--Minimum Spend-->
      <van-field readonly clickable label="Minimum" :value="displayMinimum" @touchstart.native.stop="showMaxNumbKeyboard = false,showMinNumbKeyboard = true" placeholder="$ 0"/>
      <!--Maximum Spend-->
      <van-field readonly clickable label="Maximum" :value="displayMaximum" @touchstart.native.stop="showMaxNumbKeyboard = true, showMinNumbKeyboard = false" placeholder="$ 0"/>
      <van-number-keyboard v-model="displayMinimum" :show="showMinNumbKeyboard" extra-key="." close-button-text="Close" @blur="showMinNumbKeyboard = false"/>
      <van-number-keyboard v-model="displayMaximum" :show="showMaxNumbKeyboard" extra-key="." close-button-text="Close" @blur="showMaxNumbKeyboard = false"/>
      <!--Promotion's Desc-->
      <van-field label="Description" clearable placeholder="Promotion's Description" v-model="promoItem.promodesc"/>

      <!--Duration-->
      <van-switch-cell v-model="promoItem.duration" title="Promotion Period" />
      <!-- From Promo Date-->
      <div v-if="promoItem.duration == true">
      <van-field readonly clickable label="From" required :value="fromPromoDate" @click="showFromPromoDate = true" :error-message="fromDateErrorMsg" />
      <van-popup v-model="showFromPromoDate" position="bottom">
        <van-datetime-picker v-model="promoItem.fromdate" type="date" @cancel="showFromPromoDate=false" @confirm="fromPromoDateConfirm" />
      </van-popup>
      <!-- To Promo Date-->
      <van-field  readonly clickable label="To" required :value="toPromoDate" @click="showToPromoDate = true" :error-message="toDateErrorMsg" />
      <van-popup v-model="showToPromoDate" position="bottom">
        <van-datetime-picker v-model="promoItem.todate" type="date" @cancel="showToPromoDate=false" @confirm="toPromoDateConfirm" />
      </van-popup>
      </div>

      <!--Transactions Count-->
      <van-cell title="Minimum Swipe">
        <van-stepper v-model="promoItem.maxtranscount" min="0"></van-stepper>
      </van-cell>
    </van-cell-group>

    <!-- Related Accounts-->
    <van-cell-group title="Select Accounts" v-if="activeStep==1">
      <van-tree-select v-if="getAccounts.length>0" :items="accountSelect" :active-id.sync="activeAccIds" :main-active-index.sync="activeAccIndex"/>
      <div v-if="getAccounts.length==0" style="text-align:center;font-style:italic;">Please add a new account</div>
    </van-cell-group>

    <!-- Related Expense Categories-->
    <van-cell-group title="Select Categories" v-if="activeStep==2">
      <van-cell title="Select All" clickable @click="toggleToggleAll()">
        <van-checkbox ref="selectallcheckbox" v-model="expCatSelectAll" @change="expCatToggleAll" slot="right-icon"/>
      </van-cell>
      <van-checkbox-group v-model="expcatchecked" ref="expCatCheckboxesGroup">
      <van-cell v-for="(cat,index) in getExpCat" clickable :key="cat.expcatid"  :title="cat.expCatName" @click="expCatToggle(index)">
        <van-checkbox :name="cat.expcatid" slot="right-icon" ref="expcatcheckboxes" :disabled="expCatDisabled"/>
      </van-cell>
      </van-checkbox-group>
      <van-cell title="+Add New Expense Category" style="font-style:italic;color:#555555" @click="showAddExpCat=true"/>
        <van-popup v-model="showAddExpCat" position="bottom" :style="{height:'100%'}">
          <v-exp-category @closeManageExpCat="closeManageExpCat"/> 
        </van-popup>
      <van-field v-model="promoItem.expmemo" clearable label="Memo" type="textarea" placeholder="Expenses' Memo" autosize rows="1"/>
    </van-cell-group>

    <!-- Related Reward-->
    <van-checkbox-group v-model="rewardscatchecked" v-if="activeStep==3">
      <van-cell-group title="Select Rewards Categories">
        <van-cell v-for="(cat,index) in rewardsCat" clickable :key="cat.rewardscatid" :title="cat.rewardsCatName" @click="rewardsCatToggle(index)">
          <van-checkbox :name="cat.rewardscatid" ref="rewardscatcheckboxes" slot="right-icon"/>
        </van-cell>
        <van-cell title="+Add New Reward Category" style="font-style:italic;color:#555555" @click="showAddRewardCat=true"/>
          <van-popup v-model="showAddRewardCat" position="bottom" :style="{height:'100%'}">
            <v-rewards-category @closeManageRewardsCat="closeManageRewardsCat"/> 
          </van-popup>
      </van-cell-group>
    </van-checkbox-group>

    <!-- Rewards Inputs-->
    <van-cell-group title="The value for the rewards" v-if="activeStep==4">
      <van-field v-for="(input,index) in rewardsInputs" clearable placeholder="Enter a value" :label="input.rewardsCatName" v-model="input.rewardsValue"/>
    </van-cell-group>

    <!-- Next, Prev Button-->
    <van-row align="center" gutter="20" style="text-align:center;margin:10px 5px">
      <van-col span="8">
        <van-button v-if="activeStep>0" type="default" @click="prevStep()" plain size="large">Prev</van-button>
      </van-col>
      <van-col span="8"> 
      </van-col>
      <van-col span="8">
        <van-button type="primary" @click="nextStep()" :disabled="nextBtnDisable()" size="large">{{getNextBtnText()}}</van-button>
      </van-col>
    </van-row>

    <!-- SMS Promotion Popup List -->
    <van-popup v-model="showSMSPromos" position="bottom" :style="{ height: '100%' }">
      <van-nav-bar title="SMS Promotions" left-text="Back" left-arrow @click-left="showSMSPromos = false" right-text="Keywords" @click-right="showKeywordManager=true"/>
       <van-pull-refresh v-model="isLoading" @refresh="getSMS()">
        <van-cell-group v-for="bank in bankSMS" :title="bank.bankName">
          <div v-if="bank.length==0" style="background-color:white;text-align:center;margin-top:10%">
            <i style="color:#bbbbbb">No promotions found from SMS.</i>
          </div>
          <van-cell v-for="SMS in bank.SMSContent" :title="SMS.address" :label="SMS.body" :border="true" clickable @click="selectSMS(SMS.body)"/>

          <!-- Keyword manager popup -->
          <van-popup v-model="showKeywordManager" position="bottom" :style="{ height:'100%' }">
            <van-nav-bar title="SMS Search Keywords" left-text="Back" left-arrow @click-left="showKeywordManager=false" right-text="Add" @click-right="addKeywordPop=true,SMSNewKeyword=''"/>

            <!-- SMS Keyword List -->
            <van-cell-group>
              <van-cell v-for="(keyword, index) in SMSKeyword" :border="true" :title="keyword">
                <template slot="default" v-if="index>=3">
                  <van-button size="small" type="danger" @click="deleteKeyword(index)">Delete</van-button>
                </template>
              </van-cell>
            </van-cell-group>

            <!-- Add SMS Keyword Pop -->
            <van-popup v-model="addKeywordPop" closeable position="bottom" :style="{ height: '20%' }">
                <van-field v-model="SMSNewKeyword" required label="Keyword: " :error-message="errorMessage"/>

                <van-button type="default" @click="addKeywordPop=false,SMSNewKeyword=''">Cancel</van-button>
                <van-button type="primary" @click="saveNewKeyword">Save</van-button>
            </van-popup>
          </van-popup>
          
        </van-cell-group>
      </van-pull-refresh>
    </van-popup>
  </div>
</template>
<script>
  import ExpCategory from './ExpCategory.vue'
  import RewardCategory from './RewardsCategory.vue'

  //Local Forage for saving keywords
  import localForage from '../storage/storage.js'

  export default{
    data(){
      return{

        //Variables Initialize
        title:"Add Promotion",
        promoItem:{
          duration:false,
          promodesc:'',
          transcount:0,
          maxtranscount:0,
          transspend:0,
          maxtransspend:0,
          expmemo:'',
        },
        nextBtnText:'Next',
        expCatSelectAll:false,
        expCatDisabled:false,

        //Steps Initialize
        activeStep:0,

        //Error Msg
        titleErrorMsg:'',
        fromDateErrorMsg:'',
        toDateErrorMsg:'',
 
        //Display Variables
        displayMinimum:'',
        displayMaximum:'',
        fromPromoDate:'',
        toPromoDate:'',

        //Picker Initialize
        showMinNumbKeyboard:false,
        showMaxNumbKeyboard:false,
        showFromPromoDate:false,
        showToPromoDate:false,
        showAddExpCat:false,
        showAddRewardCat:false,

        //Accounts Tree Select Initialize
        accountSelect:[],
        activeAccIds:[],
        activeAccIndex:0,

        //Expense Categories Checkbox
        expcatchecked:[],

        //Rewards Categories Checkbox
        rewardsCat:[],
        rewardscatchecked:[],
        rewardsInputs:[], 

        //SMS Promotions popup
        showSMSPromos:false,
        //Keyword manager popup
        showKeywordManager:false,
        //Add Keyword popup
        addKeywordPop:false,

        bankSMS:[],
        SMSKeyword:['CIMB', 'HLB', 'PB Card'],
        SMSNewKeyword:'',
        errorMessage:'',
        savedSMSKeyword:[],
        isLoading:false
      }
    },
    methods:{
      //Set Default
      setDefault(){
        this.promoItem={
          duration:false,
          promodesc:'',
          maxtranscount:0,
          expmemo:'',
        }
        this.showFromPromoDate=false;
        this.showToPromoDate=false;
        this.fromPromoDate='';
        this.toPromoDate='';
        this.activeStep=0;
        this.titleErrorMsg='';
        this.displayMinimum='';
        this.displayMaximum='';
        this.activeAccIds = [];
        this.activeAccIndex = 0;
        this.expcatchecked = [];
        this.rewardscatchecked=[];
        this.rewardsInputs=[];
        this.nextBtnText = 'Next';
        this.expCatSelectAll = false;
        this.expCatDisabled = false;
      },
      //Back Button
      back(){
        this.setDefault();
        this.$emit("closeAddPromo");
      },

      //Promotion's Duration status
      /*getDurationStatus(){
        if(this.promoItem.duration == true)
          return 'Yes';
        else
          return 'No';
      },*/
      //Promotion Start Date
      fromPromoDateConfirm(){
        this.fromPromoDate = this.$moment(this.promoItem.fromdate).format("DD MMMM YYYY");
        this.showFromPromoDate = false;
      },
      //Promotion End Date
      toPromoDateConfirm(){
        this.toPromoDate = this.$moment(this.promoItem.todate).format("DD MMMM YYYY");
        this.showToPromoDate = false;
      },
      //Expense Categories Checkboxes toggle
      expCatToggle(index){ 
        if(this.expCatDisabled == false)
          this.$refs.expcatcheckboxes[index].toggle(); 
      },
      toggleToggleAll(){
        this.$refs.selectallcheckbox.toggle();
      },
      //Expense Categories Checkboxes toggle All
      expCatToggleAll(value){
        if(value == true){
          this.$refs.expCatCheckboxesGroup.toggleAll(true);
          this.expCatDisabled = true;
        }else{
          this.$refs.expCatCheckboxesGroup.toggleAll(false);
          this.expCatDisabled = false;
        }
      },
      //Close Add Expense Categories
      closeManageExpCat(){
        this.showAddExpCat = false;
      },
      //Rewards Categories Checkboxes toggle
      rewardsCatToggle(index){ 
        this.$refs.rewardscatcheckboxes[index].toggle(); 
      },
      //Close Add Rewards Categories
      closeManageRewardsCat(){
        this.showAddRewardCat = false;
      },
      //Rewards Categories Inputs
      showRewardsInputs(){
        this.rewardsInputs = [];
        for(let i in this.rewardscatchecked){
          let temp = this.getRewardsCat.find(o=>o.rewardscatid==this.rewardscatchecked[i])
          this.rewardsInputs.push({
            rewardsID:temp.rewardscatid,
            rewardsCatName:temp.rewardsCatName,
            rewardsValue:''
          });
        } 
      },
      //Next Button Text
      getNextBtnText(){
        if(this.activeStep == 4){
          return 'Submit';
        }
        else{
          return 'Next';
        }
      },
      //Next Button Disable Validation
      nextBtnDisable(){
        let hasErrors = false;
        if(this.activeStep == 0){ 
          if(this.promoItem.promotitle == '' || this.promoItem.promotitle==undefined){
            hasErrors = true;
          }
          if(this.promoItem.duration == true){
            if(this.promoItem.fromdate == undefined || this.promoItem.fromdate == ''){
              hasErrors = true;
            }
            if(this.promoItem.todate == undefined || this.promoItem.todate == ''){
              hasErrors = true;
            }
            if(this.promoItem.fromdate > this.promoItem.todate)
              hasErrors = true;
          }
        } 
        if(this.activeStep == 1){
          if(this.activeAccIds.length<1){
            hasErrors = true;
          }
        }
        if(this.activeStep == 2){
          if(this.expcatchecked.length<1){
            hasErrors = true;
          }
        }
        if(this.activeStep == 3){
          if(this.rewardscatchecked.length<1){
            hasErrors = true;
          }
        }
        return hasErrors;
      },
      //Next Button
      nextStep(){
        if(this.activeStep>=0 && this.activeStep<6){
          this.activeStep++;
          console.log(this.promoItem);
        }
        if(this.activeStep==4){
          this.showRewardsInputs();
        }
        if(this.activeStep==5){
          this.saveNewPromo();
          this.activeStep = 0;
        }
        console.log(this.rewardscatchecked);
      },
      //Prev Button
      prevStep(){
        if(this.activeStep>0)
          this.activeStep--;
        if(this.activeStep < 0)
          this.activeStep = 4; 
      },
      //Save New Promotion
      saveNewPromo(){
        this.promoItem.transcount = this.promoItem.maxtranscount;
        this.promoItem.rltacc = this.activeAccIds;
        this.promoItem.rltexpense = this.expcatchecked;
        this.promoItem.rltrewards = this.rewardsInputs;
        if(this.displayMinimum != '')
          this.promoItem.minimum = parseFloat(this.displayMinimum);
        else
          this.promoItem.minimum = 0;
        if(this.displayMaximum != '')
          this.promoItem.maxtransspend = parseFloat(this.displayMaximum);
        else
          this.promoItem.maxtransspend = 0;
        this.promoItem.transspend = this.promoItem.maxtransspend;
        this.$store.commit('addNewPromo',this.promoItem);
        this.$store.dispatch('storeAllStateData');
        this.$notify({message:'Promotion Added', type:'success', duration:3000});
        this.back(); 
      },

      //SMS Promotion START
      //get Promotions from SMS
      getSMS(){
        this.showSMSPromos=true;
        this.showKeywordManager=false;
        this.addKeywordPop=false;

        this.bankSMS=[];

        let getPermission = new Promise((resolve)=>{
          smsreader.filterSenders(['Get Permission Only']).then((sms)=>{
            //This filterSenders is only used for getting permission and prevent crash
            resolve('Permission obtained');
          });
        });

        getPermission.then((msg)=>{
          //async requirement, may have to init SMSKeyword with local forage inside promise
          let populateSMS = new Promise((resolve)=>{

            localForage.getItem('keyword').then(value=>{
              if(value!=null){
                console.log('Get saved data called');
                this.savedSMSKeyword = value;

                //filter duplicates
                let filter = this.SMSKeyword.concat(value.filter((item) => this.SMSKeyword.indexOf(item) < 0));
                this.SMSKeyword = filter;
                console.log(this.SMSKeyword);
                resolve('Populated SMS');
              } else {
                resolve('No keyword found, get default');
              }
            });
          }).then((msg)=>{
            console.log(msg);
            this.SMSKeyword.forEach(keyword => {
              this.SMSReader(keyword);
            });

            console.log(this.bankSMS);
            this.isLoading=false;
          });
        });
      },

      //SMS Plugin Reader call
      SMSReader(keyword){
        smsreader.filterBody([keyword]).then((sms)=>{
          if(sms.length!=0){
            // Fetches all SMS, with body containing words 'PB Card'.
            let bankSMSObj={
              bankName:'',
              SMSContent:[]
            };

            bankSMSObj.bankName = keyword;
            bankSMSObj.SMSContent = bankSMSObj.SMSContent.concat(sms);

            this.bankSMS.push(bankSMSObj);
          } else {
            console.log('SMS search by keyword: ' + keyword + ' returns empty result');
          }
        },(err)=>{
            console.error(err);
        });
      },

      //Populate add promo description with SMS body content
      selectSMS(SMSBody){
        this.promoItem.promodesc = SMSBody;
        this.showSMSPromos = false;
      },

      //Add keyword
      saveNewKeyword(){
        if(this.SMSNewKeyword=='')
          this.errorMessage = 'Please input a name';
        else{
          this.savedSMSKeyword.push(this.SMSNewKeyword);
        
          //localforage set saved keywords
          let saveKeywordPromise = new Promise((resolve)=>{
            localForage.setItem('keyword', this.savedSMSKeyword);
            resolve('Save complete');
          }).then((msg)=>{
            console.log(msg);
            this.SMSNewKeyword=''
            this.getSMS();
          });
        }
      },

      //Delete keyword
      deleteKeyword(index){
        //Confirm Delete dialog
        this.$dialog.confirm({
          message:'Delete this keyword? ' + this.SMSKeyword[index]
        }).then(()=>{
          //Minus 3 is from the default 3 keywords
          this.savedSMSKeyword.splice(index-3, 1);
          this.SMSKeyword.splice(index, 1);

          let deletePromise = new Promise((resolve)=>{
            localForage.setItem('keyword', this.savedSMSKeyword);
            resolve('Delete complete');
          }).then((msg)=>{
            console.log(msg);
            this.getSMS();
          });
        });
      },
      //SMS Promotion END
    },
    computed:{
      getAccounts(){
        return this.$store.state.allAccounts; 
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
                  text:accounts[j].name,
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
          if(temp.children.length>0)
            temp.info = temp.children.length;
          grouped.push(temp);
        }
        return grouped;
      },
      getAccGroups(){
        return this.$store.state.accGroups;
      },
      getExpCat(){
        return this.$store.state.expCat;
      },
      getRewardsCat(){
        return this.$store.state.rewardsCat;
      }
    },
    mounted(){
      this.accountSelect = this.getGroupedAccounts;
      this.rewardsCat = this.getRewardsCat;
    },
    components:{
      'v-exp-category':ExpCategory,
      'v-rewards-category':RewardCategory,
    }
  }
</script>
