<template>
  <div style="padding-top:13%">
    <!-- Top Nav Bar -->
    <van-nav-bar :title="title" left-text="Back" left-arrow @click-left="back()" fixed/>

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
      <van-switch-cell v-model="promoItem.duration" title="Active Duration" />
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
      <van-tree-select :items="accountSelect" :active-id.sync="activeAccIds" :main-active-index.sync="activeAccIndex"/>
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
        <van-popup v-model="showAddExpCat" position="bottom" style="{height:'100%'}">
          <v-exp-category @closeManageExpCat="closeManageExpCat"/> 
        </van-popup>
      <van-field v-model="promoItem.expmemo" label="Memo" type="textarea" placeholder="Expenses' Memo" autosize rows="1"/>
    </van-cell-group>

    <!-- Related Reward-->
    <van-checkbox-group v-model="rewardscatchecked" v-if="activeStep==3">
      <van-cell-group title="Related Rewards Categories">
        <van-cell v-for="(cat,index) in rewardsCat" clickable :key="cat.rewardscatid" :title="cat.rewardsCatName" @click="rewardsCatToggle(index)">
          <van-checkbox :name="cat.rewardscatid" ref="rewardscatcheckboxes" slot="right-icon"/>
        </van-cell>
        <van-cell title="+Add New Reward Category" style="font-style:italic;color:#555555" @click="showAddRewardCat=true"/>
          <van-popup v-model="showAddRewardCat" position="bottom" style="{height:'100%'}">
            <v-rewards-category @closeManageRewardsCat="closeManageRewardsCat"/> 
          </van-popup>
      </van-cell-group>
    </van-checkbox-group>

    <!-- Rewards Inputs-->
    <van-cell-group title="The value for the rewards" v-if="activeStep==4">
      <van-field v-for="(input,index) in rewardsInputs" :label="input.rewardsCatName" v-model="input.rewardsValue"/>
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

  </div>
</template>
<script>
  import ExpCategory from './ExpCategory.vue'
  import RewardCategory from './RewardsCategory.vue'

  export default{
    data(){
      return{
        //Variables Initialize
        title:"Edit Promotion", 
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
      }
    },
    methods:{
      //Set Default
      setDefault(){
        this.promoItem = {}; 
        this.promoItem.duration=false; 
        this.promoItem.promodesc='';
        this.promoItem.expmemo='';
        this.promoItem.transcount=0;
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
      back(){
        this.activeStep = 0;
        this.$emit("closeEditPromo");
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
        let existed = [];
        console.log(this.promoItem.rltrewards);
        if(this.promoItem.rltrewards.length>0){
          this.rewardsInputs = this.promoItem.rltrewards;
          for(let i in this.rewardsInputs){
            existed.push(this.rewardsInputs[i].rewardsID);
          }
          console.log(existed);
        }
        for(let i in this.rewardscatchecked){
          if(!existed.includes(this.rewardscatchecked[i])){
          let temp = this.getRewardsCat.find(o=>o.rewardscatid==this.rewardscatchecked[i])
          this.rewardsInputs.push({
            rewardsID:temp.rewardscatid,
            rewardsCatName:temp.rewardsCatName,
            rewardsValue:'',
            });
          }
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
        if(this.activeStep>=0 && this.activeStep<5){
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
        this.promoItem.rltacc = this.activeAccIds;
        this.promoItem.rltexpense = this.expcatchecked;
        this.promoItem.rltrewards = this.rewardsInputs;
        if(this.displayMinimum != '')
          this.promoItem.minimum = parseFloat(this.displayMinimum);
        else
          this.promoItem.minimum = 0;
        this.$store.commit('editPromo',this.promoItem);
        this.$store.dispatch('storeAllStateData');
        this.$notify({message:'Promotion Edited',type:'success',duration:3000});
        this.activeStep = 0;
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
    watch:{
      promo(){
        this.promoItem = Object.assign({},this.promo);
        if(this.promoItem){
          this.displayMinimum = this.promoItem.minimum.toString(); 
          this.displayMaximum = this.promoItem.maxtransspend.toString();
          if(this.promoItem.duration==true){
            this.fromPromoDate = this.$moment(this.promoItem.fromdate).format('DD MMMM YYYY');
            this.toPromoDate = this.$moment(this.promoItem.todate).format('DD MMMM YYYY');
          }
          this.activeAccIds = this.promoItem.rltacc;
          this.expcatchecked = this.promoItem.rltexpense;
          this.rewardscatchecked = [];
          for(let i in this.promoItem.rltrewards){
            this.rewardscatchecked.push(this.promoItem.rltrewards[i].rewardsID);
          }
        }
      
      }
    },
    mounted(){
      this.accountSelect = this.getGroupedAccounts;
      this.rewardsCat = this.getRewardsCat;
      this.promoItem = Object.assign({},this.promo);
      if(this.promoItem){
        this.displayMinimum = this.promoItem.minimum.toString(); 
        this.displayMaximum = this.promoItem.maxtransspend.toString();
        if(this.promoItem.duration==true){
          this.fromPromoDate = this.$moment(this.promoItem.fromdate).format('DD MMMM YYYY');
          this.toPromoDate = this.$moment(this.promoItem.todate).format('DD MMMM YYYY');
        }
        this.activeAccIds = this.promoItem.rltacc;
        this.expcatchecked = this.promoItem.rltexpense;
        for(let i in this.promoItem.rltrewards){
          this.rewardscatchecked.push(this.promoItem.rltrewards[i].rewardsID);
        }
      }
    },
    components:{
      'v-exp-category':ExpCategory,
      'v-rewards-category':RewardCategory,
    },
    props:['promo']
  }
</script>
