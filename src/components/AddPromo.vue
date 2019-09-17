<template>
  <div id="addpromomaindiv">
    <!--Top Nav Bar-->
    <van-nav-bar :title="title" left-arrow left-text="Back" @click-left="back()"/>

    <!--Add Promotion Steps-->
    <van-steps :active="activeStep">
      <van-step>Step1</van-step>
      <van-step>Step2</van-step>
      <van-step>Step3</van-step>
      <van-step>Step4</van-step>
    </van-steps>

    <!--Promotion’s Info-->
    <van-cell-group title="Promotion's Info" v-if="activeStep==0">
      <!--Promotion's Title-->
      <van-field label="Title" placeholder="Promotion's Title" v-model="promoItem.promotitle" required :error-message="titleErrorMsg"/>
      <!--Minimum Spend-->
      <van-field readonly clickable label="Minimum" :value="displayMinimum" @touchstart.native.stop="showNumbKeyboard = true" placeholder="$ 0"/>
      <van-number-keyboard v-model="displayMinimum" :show="showNumbKeyboard" extra-key="." close-button-text="Close" @blur="showNumbKeyboard = false"/>
    </van-cell-group>

    <!-- Related Accounts-->
    <van-cell-group title="Related Accounts" v-if="activeStep==1">
      <van-tree-select :items="accountSelect" :active-id.sync="activeIds" :main-active-index.sync="activeIndex"/>
    </van-cell-group>

    <van-row>
      <van-col offset="12" span="12" style="text-align:center">
        <van-button plain type="default" v-if="activeStep>0" @click="prevStep()">Prev</van-button> 
        <van-button type="info" @click="nextStep()">Next</van-button>
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
        promoItem:{},

        //Steps Initialize
        activeStep:0,

        //Error Msg
        titleErrorMsg:'',
        
        //Display Variables
        displayMinimum:'',

        //Picker Initialize
        showNumbKeyboard:false,

        //Tree Select Initialize
        accountSelect:[],
        activeIds:[],
        activeIndex:0,
      
      }
    },
    methods:{
      //Back Button
      back(){
        this.$emit("closeAddPromo");
      },
      nextStep(){
        if(this.activeStep>=0 && this.activeStep<4)
          this.activeStep++;
        if(this.activeStep > 3)
          this.activeStep = 0;
        console.log(this.promoItem);
        console.log(this.activeIds);
      },
      prevStep(){
        if(this.activeStep>0)
          this.activeStep--;
        if(this.activeStep < 0)
          this.activeStep = 3; 
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
      }
    },
    mounted(){
      this.accountSelect = this.getGroupedAccounts;
    }
  }
</script>
