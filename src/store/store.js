import Vuex from 'vuex'
import Vue from 'vue'
import localForage from '../storage/storage.js'

Vue.use(Vuex)
const getDefaultState = ()=>{
  return {
    //Accounts
    allAccounts:[],
    maxAccId:0,

    //Accounts Groups
    accGroups:[
      {groupName:'Credit Card',grpid:1},
      {groupName:'Debit Card',grpid:2},
      {groupName:'Cash',grpid:3},
      {groupName:'Other',grpid:4},
    ],
    maxAccGrpId:0,

    //Transactions
    allTrans:[],
    maxTransId:0,

    //Expense Category
    expCat:[
      {expCatName:'Food',expcatid:1},
      {expCatName:'Movies',expcatid:2},
      {expCatName:'Other',expcatid:3}, 
    ],
    maxExpCatId:0,

    //Income Category
    incCat:[
      {incCatName:'Bonus',inccatid:1},
      {incCatName:'Salary',inccatid:2},
      {incCatName:'Other',inccatid:3}, 
    ],
    maxIncCatId:0,

    //Promotions
    allPromo:[],
    maxPromoId:0,

    //Rewards Category
    rewardsCat:[
      {rewardsCatName:'Discount',rewardscatid:1},
      {rewardsCatName:'Cashback',rewardscatid:2},
      {rewardsCatName:'Other',rewardscatid:3}, 
    ],
    maxRewardsCatId:0,

    suggestAcc:[], 
  }
}

const state = getDefaultState();

export default new Vuex.Store({
  state,
  
  getters: {
  },
  
  mutations: {
    //////////////////State
    //Set the State Data
    setAllStateData(state,value){
      Object.assign(state,value);
    },
    //Set the State Data to Default
    setStateToDefault(state){
      Object.assign(state,getDefaultState());
    },
    //////////////////Account
    //Add Account to Vuex Store
    addAccount(state,value){
      //Assigning id to account
      if(state.allAccounts.length<1&&state.maxAccId==0)
        value.accid=1;
      else if(state.allAccounts.length<1)
        value.accid = state.maxAccId+1; 
      else{
        const maxId = state.allAccounts.reduce(
        (max, acc) => (acc.accid>max ? acc.accid:max),state.allAccounts[0].accid);
        if((maxId+1)==state.maxAccId)
          value.accid = maxId + 2;
        else
          value.accid = maxId + 1; 
      } 
      state.maxAccId = value.accid;
      state.allAccounts.push(value);
    },
    //Edit Account
    editAccount(state,value){
      for(let i in state.allAccounts){
        if(state.allAccounts[i].accid == value.accid){
          state.allAccounts[i] = value; 
          console.log(value);
        }
      }
    },
    //Delete Account
    deleteAccount(state,value){
      state.allAccounts = _.filter(state.allAccounts,x=>{
        return x.accid != value; 
      });
    },
    //Set Accounts to Vuex Store
    setAccounts(state,value){
      state.allAccounts = value;
    },
    //Set Max Id of Accounts
    setMaxAccId(state,value){
      state.maxAccId = value;
    },
    /////////////////////////////////
    
    //////////////////Account Groups
    //Add Account Group
    addAccGroup(state,value){
      if(state.accGroups.length<1&&state.maxAccGrpId==0)
        value.grpid=1;
      else if(state.accGroups.length<1)
        value.accid = state.maxAccGrpId+1; 
      else{
        const maxId = state.accGroups.reduce(
        (max, accgrp) => (accgrp.grpid>max ? accgrp.grpid:max),state.accGroups[0].grpid);
        if((maxId+1)==state.maxAccId)
          value.grpid = maxId+2;
        else
          value.grpid = maxId + 1;
      } 
      state.maxAccGrpId = value.grpid;
      state.accGroups.push(value);
    },
    //Set Account Group to Vuex Store
    setAccGroup(state,value){
      state.accGroups = value;
    },
    //Set Max Id of Account Group
    setMaxAccGrpId(state,value){
      state.maxAccGrpId = value;
    },
    /////////////////////////////////

    //////////////////Account
    //Add Transactions to Vuex Store
    addTrans(state,value){
      //Assigning id to account
      if(!value.transid){
      if(state.allTrans.length<1&&state.maxTransId==0)
        value.transid=1;
      else if(state.allTrans.length<1)
        value.transid = state.maxTransId+1; 
      else{
        const maxId = state.allTrans.reduce(
        (max, trans) => (trans.transid>max ? trans.transid:max),state.allTrans[0].transid);
        if((maxId+1)==state.maxTransId)
          value.transid = maxId + 2;
        else
          value.transid = maxId + 1; 
      } 
      state.maxTransId = value.transid;
      }
      state.allTrans.push(value);
      switch(value.type){
        case 'Expense':
          for(let i = 0;i<state.allAccounts.length;i++){
            if(state.allAccounts[i].accid == value.account)
              if(state.allAccounts[i].accgroup == 1)
                state.allAccounts[i].outstdbalance += value.amount;
              else
                state.allAccounts[i].balance -= value.amount;
          }
          break;
        case 'Income':
          for(let i = 0;i<state.allAccounts.length;i++){
            if(state.allAccounts[i].accid == value.account)
              if(state.allAccounts[i].accgroup == 1)
                state.allAccounts[i].outstdbalance -= value.amount;
              else
                state.allAccounts[i].balance += value.amount;
          }
          break;
        case 'Transfer':
          for(let i=0;i<state.allAccounts.length;i++){
            if(state.allAccounts[i].accid == value.fromaccount)
              if(state.allAccounts[i].accgroup == 1)
                state.allAccounts[i].outstdbalance += value.amount;
              else
                state.allAccounts[i].balance -= value.amount;
            if(state.allAccounts[i].accid == value.toaccount)
              if(state.allAccounts[i].accgroup == 1)
                state.allAccounts[i].outstdbalance -= value.amount;
              else
                state.allAccounts[i].balance += value.amount;
            }
          break;
      }
    },
    //Edit Transactions
    editTrans(state,value){
      this.commit('deleteTrans',value.transid);
      this.commit('addTrans',value);
    },
    //Set Transactions to Vuex Store
    setTrans(state,value){
      state.allTrans = value;
    },
    //Delete Transaction
    deleteTrans(state,value){
      let deletedTrans = state.allTrans.find(trans => trans.transid == value);
      switch(deletedTrans.type){
        case 'Expense':
          for(let i = 0;i<state.allAccounts.length;i++){
            if(state.allAccounts[i].accid == deletedTrans.account)
              if(state.allAccounts[i].accgroup == 1)
                state.allAccounts[i].outstdbalance -= deletedTrans.amount;
              else
                state.allAccounts[i].balance += deletedTrans.amount;
          }
          break;
        case 'Income':
          for(let i = 0;i<state.allAccounts.length;i++){
            if(state.allAccounts[i].accid == deletedTrans.account)
              if(state.allAccounts[i].accgroup == 1)
                state.allAccounts[i].outstdbalance += deletedTrans.amount;
              else
                state.allAccounts[i].balance -= deletedTrans.amount;
          } 
          break;
        case 'Transfer':
          for(let i=0;i<state.allAccounts.length;i++){
            if(state.allAccounts[i].accid == deletedTrans.fromaccount){
              if(state.allAccounts[i].accgroup == 1)
                state.allAccounts[i].outstdbalance -= deletedTrans.amount;
              else
                state.allAccounts[i].balance += deletedTrans.amount;
            }
            if(state.allAccounts[i].accid == deletedTrans.toaccount){
              if(state.allAccounts[i].accgroup == 1)
                state.allAccounts[i].outstdbalance += deletedTrans.amount;
              else
                state.allAccounts[i].balance -= deletedTrans.amount;
            }
          } 
          break;
      }
      state.allTrans = _.filter(state.allTrans,x=>{
        return x.transid != value 
      });
    },
    //Set Max Id of Accounts
    setMaxTransId(state,value){
      state.maxTransId = value;
    },
    /////////////////////////////////

    //////////////////Expense Categories
    //Add Expense Categories
    addExpCat(state,value){
      if(state.expCat.length<1&&state.maxExpCatId==0)
        value.expcatid=1;
      else if(state.expCat.length<1)
        value.expcatid = state.maxExpCatId+1; 
      else{
        const maxId = state.expCat.reduce(
        (max, expcat) => (expcat.expcatid>max ? expcat.expcatid:max),state.expCat[0].expcatid);
        if((maxId+1)==state.maxExpCatId)
          value.expcatid = maxId+2;
        else
          value.expcatid = maxId + 1;
      } 
      state.maxExpCatId = value.expcatid;
      state.expCat.push(value);
    },
    //Set Expense Categories to Vuex Store
    setExpCat(state,value){
      state.expCat = value;
    },
    //Set Max Id of Expense Category 
    setMaxExpCatId(state,value){
      state.maxExpCatId = value;
    },
    /////////////////////////////////

    //////////////////Income Categories
    //Add Income Categories
    addIncCat(state,value){
      if(state.incCat.length<1&&state.maxIncCatId==0)
        value.inccatid=1;
      else if(state.incCat.length<1)
        value.inccatid = state.maxIncCatId+1; 
      else{
        const maxId = state.incCat.reduce(
        (max, inccat) => (inccat.inccatid>max ? inccat.inccatid:max),state.incCat[0].inccatid);
        if((maxId+1)==state.maxIncCatId)
          value.inccatid = maxId+2;
        else
          value.inccatid = maxId + 1;
      } 
      state.maxIncCatId = value.inccatid;
      state.incCat.push(value);
    },
    //Set Income Categories to Vuex Store
    setIncCat(state,value){
      state.incCat = value;
    },
    //Set Max Id of Income Category 
    setMaxIncCatId(state,value){
      state.maxIncCatId = value;
    },
    ///////////////////////////////// 

    //////////////////Promotions
    //Add Promotions
    addNewPromo(state,value){
      //Assigning id to promotion
      if(state.allPromo.length<1&&state.maxPromoId==0)
        value.promoid=1;
      else if(state.allPromo.length<1)
        value.promoid = state.maxPromoId+1; 
      else{
        const maxId = state.allPromo.reduce(
        (max, promo) => (promo.promoid>max ? promo.promoid:max),state.allPromo[0].promoid);
        if((maxId+1)==state.maxPromoId)
          value.promoid = maxId + 2;
        else
          value.promoid = maxId + 1; 
      } 
      state.maxPromoId = value.promoid;
      state.allPromo.push(value);
    },
    //Edit Promotion
    editPromo(state,value){
      for(let i in state.allPromo){
        if(state.allPromo[i].promoid == value.promoid){ 
          state.allPromo[i] = value;
          console.log(value); 
        }
      }
    },
    //Delete Promotion
    deletePromo(state,value){
      state.allPromo = _.filter(state.allPromo,x=>{
        return x.promoid != value;
      }); 
    },
    //Set Promotions to Vuex Store
    setPromotions(state,value){
      state.allPromo = value;
    },
    //Set Max Id of Promo
    setMaxPromoId(state,value){
      state.maxPromoId = value;
    }, 
    /////////////////////////////////

    //////////////////Rewards Categories
    //Add Rewards Categories
    addRewardsCat(state,value){
      if(state.rewardsCat.length<1&&state.maxRewardsCatId==0)
        value.rewardscatid=1;
      else if(state.rewardsCat.length<1)
        value.rewardscatid = state.maxRewardsCatId+1; 
      else{
        const maxId = state.rewardsCat.reduce(
        (max, rewardscat) => (rewardscat.rewardscatid>max ? rewardscat.rewardscatid:max),state.rewardsCat[0].rewardscatid);
        if((maxId+1)==state.maxRewardsCatId)
          value.rewardscatid = maxId+2;
        else
          value.rewardscatid = maxId + 1;
      } 
      state.maxRewardsCatId = value.rewardscatid;
      state.rewardsCat.push(value);
    },
    //Set Rewards Categories to Vuex Store
    setRewardsCat(state,value){
      state.rewardsCat = value;
    },
    //Set Max Id of Rewards Category 
    setMaxRewardsCatId(state,value){
      state.maxRewardsCatId = value;
    },

    //////////////////Suggesting Feature
    //Generate Suggest Accounts
    genSuggestAcc(state,value){
      state.suggestAcc = [];
      if(state.allPromo){
      let filteredPromo = _.filter(state.allPromo,x=>{
        //Check Minimum
        if(x.minimum <= value.transamount){
          //Check Duration
          if(x.duration==false || (x.duration==true&&Vue.moment(value.transdate).isBetween(x.fromdate,x.todate))){
            //Check Expense Category
            if(x.rltexpense.includes(value.transcat)){
              return x; 
              }
            }
          }
        }); 
        for(let i in state.allAccounts){
          let tempacc = {
            text: state.allAccounts[i].name,
            id: state.allAccounts[i].accid,
            rltpromo:[],
          };
          for(let j in filteredPromo){
            if(filteredPromo[j]){
              if(filteredPromo[j].rltacc.includes(state.allAccounts[i].accid)){
                tempacc.rltpromo.push(filteredPromo[j].promoid);
              }
            if(tempacc.rltpromo.length>0){
              state.suggestAcc.push(tempacc);
              }
            }
          }
        }
      }
    },
    /////////////////////////////////
  },
  /////////////////////////////////
  
  actions: {
    //Store All the State Data into Database
    storeAllStateData(context,payload){
      localForage.setItem('state',context.state);
    }, 
    //Get All the State Data from Database
    getAllStateData(context){
      localForage.getItem('state').then(value=>{
        if(value!=null){
          context.commit('setAllStateData',value);
        }
      })
    },
    //Clear Database
    clearDatabase(context){
      localForage.clear().then(()=>{
        console.log('Database is empty now');
      });
    }
  } 
});
