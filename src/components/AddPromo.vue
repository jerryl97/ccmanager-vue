<template>
  <div id="addpromomaindiv">
    <!--Top Nav Bar-->
    <van-nav-bar :title="title" left-arrow left-text="Back" @click-left="back()"/>

    <!--Add Promotion Steps-->
    <van-steps :active="activeStep">
      <van-step>Step 1</van-step>
      <van-step>Step 2</van-step>
      <van-step>Step 3</van-step>
      <van-step>Step 4</van-step>
    </van-steps>

    <!--Promotion’s Info-->
    <van-cell-group title="Promotion's Info" v-if="activeStep==0">
      <!--Promotion's Title-->
      <van-field label="Title" clearable placeholder="Promotion's Title" v-model="promoItem.promotitle" required :error-message="titleErrorMsg"/>
      <!--Minimum Spend-->
      <van-field readonly clickable label="Minimum" :value="displayMinimum" @touchstart.native.stop="showNumbKeyboard = true" placeholder="$ 0"/>
      <van-number-keyboard v-model="displayMinimum" :show="showNumbKeyboard" extra-key="." close-button-text="Close" @blur="showNumbKeyboard = false"/>

      <!--Duration-->
      <van-switch-cell v-model="promoItem.duration" :title="'Has duration? '+ getDurationStatus()" />
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
    </van-cell-group>

    <!-- Related Accounts-->
    <van-cell-group title="Related Accounts" v-if="activeStep==1">
      <van-tree-select :items="accountSelect" :active-id.sync="activeAccIds" :main-active-index.sync="activeAccIndex"/>
    </van-cell-group>

    <!-- Related Expense Categories-->
    <van-checkbox-group v-model="expcatchecked" v-if="activeStep==2">
      <van-cell-group title="Related Expense Categories">
        <van-cell v-for="(cat,index) in getExpCat" clickable :key="cat.expcatid" :title="cat.expCatName" @click="expCatToggle(index)">
          <van-checkbox :name="cat.expcatid" ref="expcatcheckboxes" slot="right-icon"/>
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>

    <!-- Related Reward-->
    <van-checkbox-group v-model="rewardscatchecked" v-if="activeStep==3">
      <van-cell-group title="Related Rewards Categories">
        <van-cell v-for="(cat,index) in rewardsCat" clickable :key="cat.rewardscatid" :title="cat.rewardsCatName" @click="rewardsCatToggle(index)">
          <van-checkbox :name="cat.rewardscatid" ref="rewardscatcheckboxes" slot="right-icon"/>
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>

    <!-- Rewards Inputs-->
    <!--<van-cell-group title="The value for the rewards" v-if="activeStep==4">
      <van-field v-for="(input,index) in rewardsInputs" :label="input.rewardsCatName" :v-model="input.rewardsValue"/>
    </van-cell-group>-->

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

  </div>
</template>
<script>
  export default{
    data(){
      return{

        //Variables Initialize
        title:"Add Promotion",
        promoItem:{
          duration:false,
        },
        nextBtnText:'Next',

        //Steps Initialize
        activeStep:0,

        //Error Msg
        titleErrorMsg:'',
        fromDateErrorMsg:'',
        toDateErrorMsg:'',
 
        //Display Variables
        displayMinimum:'',
        fromPromoDate:'',
        toPromoDate:'',

        //Picker Initialize
        showNumbKeyboard:false,
        showFromPromoDate:false,
        showToPromoDate:false,

        //Accounts Tree Select Initialize
        accountSelect:[],
        activeAccIds:[],
        activeAccIndex:0,

        //Expense Categories Checkbox
        expcatchecked:[],

        //Rewards Categories Checkbox
        rewardsCat:[],
        rewardscatchecked:[],
        //rewardsInputs:[], 
      }
    },
    methods:{
      //Set Default
      setDefault(){
        this.promoItem = {}; 
        this.promoItem.duration=false; 
        this.showFromPromoDate=false;
        this.showToPromoDate=false;
        this.fromPromoDate='';
        this.toPromoDate='';
        this.activeStep=0;
        this.titleErrorMsg='';
        this.displayMinimum='';
        this.accountSelect = [];
        this.activeAccIds = [];
        this.activeAccIndex = [];
        this.expcatchecked = [];
        this.rewardsCat=[];
        this.rewardscatchecked=[];
        this.rewardsInputs=[];
        this.nextBtnText = 'Next';
      },
      //Back Button
      back(){
        this.setDefault();
        this.$emit("closeAddPromo");
      },
      //Promotion's Duration status
      getDurationStatus(){
        if(this.promoItem.duration == true)
          return 'Yes';
        else
          return 'No';
      },
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
        this.$refs.expcatcheckboxes[index].toggle(); 
      },
      //Rewards Categories Checkboxes toggle
      rewardsCatToggle(index){ 
        this.$refs.rewardscatcheckboxes[index].toggle(); 
      },
      //Rewards Categories Inputs
      /*showRewardsInputs(){
        this.rewardsInputs = [];
        for(let i in this.rewardscatchecked){
          let temp = this.getRewardsCat.find(o=>o.rewardscatid==this.rewardscatchecked[i])
          this.rewardsInputs.push({
            rewardsID:temp.rewardscatid,
            rewardsCatName:temp.rewardsCatName,
            rewardsValue:'',
          });
        } 
      },*/
      //Next Button Text
      getNextBtnText(){
        if(this.activeStep == 3){
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
        if(this.activeStep>=0 && this.activeStep<5){
          this.activeStep++;
          console.log(this.promoItem);
        }
        if(this.activeStep==4){
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
          this.activeStep = 3; 
      },
      //Save New Promotion
      saveNewPromo(){
        this.promoItem.rltacc = this.activeAccIds;
        this.promoItem.rltrewards = this.rewardscatchecked;
        if(this.displayMinimum != '')
          this.promoItem.minimum = parseFloat(this.displayMinimum);
        else
          this.promoItem.minimum = 0;
        this.$store.commit('addNewPromo',this.promoItem);
        this.$store.dispatch('storePromotions');
        this.back(); 
      }
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
              let tempAcc = {
                text:accounts[j].name,
                id:accounts[j].accid
              };
              temp.children.push(tempAcc); 
            }
          }
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
    }
  }
</script>
