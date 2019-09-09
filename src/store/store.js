import Vuex from 'vuex'
import Vue from 'vue'
import localForage from '../storage/storage.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    allAccounts:[],
    maxAccId:0,

    accGroups:[
      {groupName:'Credit Card',grpid:1},
      {groupName:'Debit Card',grpid:2},
      {groupName:'Cash',grpid:3},
      {groupName:'Other',grpid:4},
    ],
    maxAccGrpId:0,

  },
  
  getters: {
  },
  
  mutations: {

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
  },
  
  actions: {
    
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
      })
      localForage.getItem('maxaccgrpid').then(value=>{
        if(value!=null){
          let maxid = value;
          context.commit('setMaxAccGrpId',maxid);
        } 
      })
    },
  }
  
});
