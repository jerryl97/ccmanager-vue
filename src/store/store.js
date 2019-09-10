import Vuex from 'vuex'
import Vue from 'vue'
import localForage from '../storage/storage.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
  },
  
  getters: {
  },
  
  mutations: {

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
      state.allTrans.push(value);
    },
    //Set Transactions to Vuex Store
    setTrans(state,value){
      state.allTrans = value;
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

    //////////////////Accounts&Transactions Calculations
    calAccBalance(state){
      var transcalresult = state.allTrans.reduce((acc,val)=>{
        var o = acc.filter(obj=>{
          return obj.account == val.account;
        }).pop()||{account:val.account,amount:0};
        if(val.type=='Expense')
          o.amount -= val.amount;
        else if(val.type=='Income')
          o.amount += val.amount;
        acc.push(o);
        return acc;
      },[]);
      var finaltranscalresult = transcalresult.filter((itm, i, a)=>{
        return i == a.indexOf(itm);
      });
      console.log(finaltranscalresult);
      state.allAccounts.forEach(acc=>{
        finaltranscalresult.forEach(result=>{
          if(result.account == acc.accid){
              if(acc.accgroup==1)
                acc.outstdbalance -= result.amount;
              else
                acc.balance = acc.baseBalance + result.amount;
            }
        });
      });
      console.log(state.allAccounts);
    }
  },
  /////////////////////////////////
  
  actions: {
    
    //////////////////Accounts
    //Store Accounts
    storeAccounts(context){
      localForage.setItem('accounts',context.state.allAccounts);
      localForage.setItem('maxAccId',context.state.maxAccId);
    }, 
    //Get Accounts 
    getAccounts(context){
      localForage.getItem('accounts').then(value=>{
        if(value!=null){
          let accounts = value;
          context.commit('setAccounts',accounts);
        } 
      })
      localForage.getItem('maxAccId').then(value=>{
        if(value!=null){
          let maxid = value;
          context.commit('setMaxAccId',maxid);
        } 
      })
    },
    /////////////////////////////////

    //////////////////Accounts Groups
    //Store Account Groups
    storeAccGroups(context){
      localForage.setItem('accgroups',context.state.accGroups);
      localForage.setItem('maxaccgrpid',context.state.maxAccGrpId);
    }, 
    //Get Account Groups
    getAccGroups(context){
      localForage.getItem('accgroups').then(value=>{
        if(value!=null){
          let accgrps = value;
          context.commit('setAccGroup',accgrps);
        } 
      });
      localForage.getItem('maxaccgrpid').then(value=>{
        if(value!=null){
          let maxid = value;
          context.commit('setMaxAccGrpId',maxid);
        } 
      });
    },
    ////////////////////////////////

    //////////////////Transactions
    //Store Transactions
    storeTrans(context){
      localForage.setItem('transactions',context.state.allTrans).then(()=>{
        context.commit('calAccBalance');
        localForage.setItem('accounts',context.state.allAccounts);
      });
      localForage.setItem('maxTransId',context.state.maxTransId);
    }, 
    //Get Transactions 
    getTrans(context){
      localForage.getItem('transactions').then(value=>{
        if(value!=null){
          let trans = value;
          context.commit('setTrans',trans);
        } 
      })
      localForage.getItem('maxTransId').then(value=>{
        if(value!=null){
          let maxid = value;
          context.commit('setMaxTransId',maxid);
        } 
      })
    },
    /////////////////////////////////

    //////////////////Expense Categories
    //Store Expense Categories 
    storeExpCat(context){
      localForage.setItem('expcat',context.state.expCat);
      localForage.setItem('maxexpcatid',context.state.maxExpCatId);
    }, 
    //Get Expense Categories
    getExpCat(context){
      localForage.getItem('expcat').then(value=>{
        if(value!=null){
          let expcats = value;
          context.commit('setExpCat',expcats);
        } 
      })
      localForage.getItem('maxexpcatid').then(value=>{
        if(value!=null){
          let maxid = value;
          context.commit('setMaxExpCatId',maxid);
        } 
      })
    },
    /////////////////////////////////

    //////////////////Income Categories
    //Store Income Categories 
    storeIncCat(context){
      localForage.setItem('inccat',context.state.incCat);
      localForage.setItem('maxinccatid',context.state.maxIncCatId);
    }, 
    //Get Income Categories
    getIncCat(context){
      localForage.getItem('inccat').then(value=>{
        if(value!=null){
          let inccats = value;
          context.commit('setIncCat',inccats);
        } 
      })
      localForage.getItem('maxinccatid').then(value=>{
        if(value!=null){
          let maxid = value;
          context.commit('setMaxIncCatId',maxid);
        } 
      })
    },
    /////////////////////////////////
    
  }
  
});
