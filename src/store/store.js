import Vuex from 'vuex'
import Vue from 'vue'
import localForage from '../storage/storage.js'

Vue.use(Vuex)
const getDefaultState = ()=>{
  return {
    //First Time User
    firstTime:true,

    //Today Date
    todayDate:new Date(),

    //Accounts
    allAccounts:[],
    maxAccId:0,

    //Accounts Groups
    accGroups:[
      {groupName:'Credit Card',grpid:1},
      {groupName:'Debit Card',grpid:2},
      {groupName:'Cash',grpid:3},
      {groupName:'Savings',grpid:5},
      {groupName:'Top-Up/Prepaid',grpid:6},
      {groupName:'Investments',grpid:7},
      {groupName:'Other',grpid:4},
    ],
    maxAccGrpId:0,

    //Transactions
    allTrans:[],
    maxTransId:0,
    maxRecurTransId:0,
    recurAddState:false,

    //Expense Category
    expCat:[
      {expCatName:'Food',expcatid:1},
      {expCatName:'Movies',expcatid:2},
      {expCatName:'Transportation',expcatid:4},
      {expCatName:'Entertainment',expcatid:5},
      {expCatName:'Health',expcatid:6},
      {expCatName:'Petrol',expcatid:7},
      {expCatName:'Household',expcatid:8},
      {expCatName:'Other',expcatid:3}, 
    ],
    maxExpCatId:0,

    //Income Category
    incCat:[
      {incCatName:'Bonus',inccatid:1},
      {incCatName:'Salary',inccatid:2},
      {incCatName:'Allowance',inccatid:4},
      {incCatName:'Petty Cash',inccatid:5},
      {incCatName:'Dividends',inccatid:6},
      {incCatName:'Other',inccatid:3}, 
    ],
    maxIncCatId:0,

    //Budget
    budgetStat:false,
    budgetAmount:0,

    //Promotions
    allPromo:[],
    maxPromoId:0,

    //Rewards Category
    rewardsCat:[
      {rewardsCatName:'Discount',rewardscatid:1},
      {rewardsCatName:'Cashback',rewardscatid:2},
      {rewardsCatName:'Lucky Draw',rewardscatid:4},
      {rewardsCatName:'Other',rewardscatid:3}, 
    ],
    maxRewardsCatId:0,

    //Suggest Accounts
    suggestAcc:[], 
    suggestAccRltPromo:[],

    //Notification Status
    notifyStats:true,

    //Pincode
    PINStat:false,
    PINCode:'',
  }
}

const state = getDefaultState();

function scheduleNotification(){
      cordova.plugins.notification.local.cancelAll(function() {}, this);
      let today = new Date();
      for(let i in state.allAccounts){
        if(state.allAccounts[i].accgroup==1){
          if(Vue.moment(today).month()==Vue.moment(state.allAccounts[i].pduedate).month()){
            let id1 = 10+''+state.allAccounts[i].accid+''+1;
            let id2 = 10+''+state.allAccounts[i].accid+''+2;
            let id3 = 10+''+state.allAccounts[i].accid+''+3;
            if(state.notifyStats==true){
              cordova.plugins.notification.local.schedule([
                {id:id1,
                title:'5 Days Left to Due',
                text:state.allAccounts[i].name,
                trigger:{every:{month:Vue.moment(today).month()+1,day:Vue.moment(state.allAccounts[i].pduedate).date()-5}}},
                {id:id2,
                title:'3 Days Left to Due',
                text:state.allAccounts[i].name,
                trigger:{every:{month:Vue.moment(today).month()+1,day:Vue.moment(state.allAccounts[i].pduedate).date()-3}}},
                {id:id3,
                title:'1 Day Left to Due',
                text:state.allAccounts[i].name,
                trigger:{every:{month:Vue.moment(today).month()+1,day:Vue.moment(state.allAccounts[i].pduedate).date()-1}}},
              ]);
            }
          }
        }
      }

      let allRecurTrans = _.filter(state.allTrans,x=>{
        return x.recurring == true;
      });
      allRecurTrans = _.orderBy(allRecurTrans,['date'],['desc']);
      allRecurTrans = _.uniqBy(allRecurTrans,'recurid'); 
      for(let i in allRecurTrans){
        if(state.notifyStats == true){
        if(allRecurTrans[i].recurringtype == 0){
          let tempid = 11+''+allRecurTrans[i].recurid;
          cordova.plugins.notification.local.schedule({
            id:tempid,
            title:'Recurring Transaction: ' + allRecurTrans[i].contents,
            text:'Tap to add this recurring transaction.',
            trigger:{every:'day'},
            data:{trans:allRecurTrans[i]}
          });
        }else if(allRecurTrans[i].recurringtype == 1){
          let tempid = 11+''+allRecurTrans[i].recurid;
          cordova.plugins.notification.local.schedule({
            id:tempid,
            title:'Recurring Transaction: ' + allRecurTrans[i].contents,
            text:'Tap to add this recurring transaction.',
            trigger:{every:{weekday:allRecurTrans[i].recurringtime}},
            data:{trans:allRecurTrans[i]}
          });
        }else if(allRecurTrans[i].recurringtype == 2){
          let tempid = 11+''+allRecurTrans[i].recurid;
          cordova.plugins.notification.local.schedule({
            id:tempid,
            title:'Recurring Transaction: ' + allRecurTrans[i].contents,
            text:'Tap to add this recurring transaction.',
            trigger:{every:{day:allRecurTrans[i].recurringtime}},
            data:{trans:allRecurTrans[i]}
            });
          }
        }
      }
}

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

    //////////////////Welcome
    //Set the first time usage
    setFirstTime(state,value){
      state.firstTime = value;
    },
    setTodayDate(state,value){
      state.todayDate = value;
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
      this.commit('updateAccountDates');
      scheduleNotification();
    },
    //Edit Account
    editAccount(state,value){
      for(let i in state.allAccounts){
        if(state.allAccounts[i].accid == value.accid){
          state.allAccounts[i] = value; 
        }
      }
      this.commit('updateAccountDates');
      scheduleNotification();
    },
    //Delete Account
    deleteAccount(state,value){
      state.allAccounts = _.filter(state.allAccounts,x=>{
        return x.accid != value; 
      });
      this.commit('updateAccountDates');
      scheduleNotification();
    },
    //Set Accounts to Vuex Store
    setAccounts(state,value){
      state.allAccounts = value;
    },
    //Set Max Id of Accounts
    setMaxAccId(state,value){
      state.maxAccId = value;
    },
    //Update Accounts Dates
    updateAccountDates(state,value){
      let today = new Date();
      for(let i in state.allAccounts){
        if(state.allAccounts[i].accgroup==1){
          let temptoday = Vue.moment(today);
          let tempStatement  = Vue.moment(state.allAccounts[i].sdate);
          let tempPayDue = Vue.moment(state.allAccounts[i].pduedate);
          if(temptoday.isSameOrAfter(tempStatement)){
            let countmonth = temptoday.month() - tempStatement.month() + 1; 
            state.allAccounts[i].sdate = tempStatement.add(countmonth,'months').toDate(); 
            state.allAccounts[i].pduedate = tempPayDue.add(countmonth,'months').toDate();
          }
        }
      }
      this.commit('countAccBalance');
      scheduleNotification();
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
      if(!value.recurid&&value.recurring == true){
        let recurTrans = _.filter(state.allTrans,x=>{
          return x.recurring == true;
        })
        if(recurTrans.length<1&&state.maxRecurTransId==0)
          value.recurid = 1;
        else if(recurTrans.length<1)
          value.recurid = state.maxRecurTransId+1;
        else{
        const maxId = recurTrans.reduce(
        (max, trans) => (trans.recurid>max ? trans.recurid:max),recurTrans[0].recurid);
        if((maxId+1)==state.maxRecurTransId)
          value.recurid = maxId + 2;
        else
          value.recurid = maxId + 1; 
        }  
        state.maxRecurTransId = value.recurid;
      }else if(value.recurid&&value.recurring==false){
        for(let i in state.allTrans){
          if(state.allTrans[i].recurid == value.recurid){
            state.allTrans[i].recurring = value.recurring;
            let tempid = 11+''+value.recurid;
            cordova.plugins.notification.local.cancel(tempid,function(){}); 
          }
        }
      }
      state.allTrans.push(value);
      this.commit('updatePromoSwipeSpend');
      this.commit('countAccBalance');
      scheduleNotification();
    },
    //Edit Transactions
    editTrans(state,value){
      this.commit('deleteTrans',value.transid);
      this.commit('addTrans',value);
      scheduleNotification();
    },
    //Set Transactions to Vuex Store
    setTrans(state,value){
      state.allTrans = value;
    },
    //Delete Transaction
    deleteTrans(state,value){
      state.allTrans = _.filter(state.allTrans,x=>{
        return x.transid != value 
      });
      this.commit('updatePromoSwipeSpend');
      this.commit('countAccBalance');
      scheduleNotification();
    },
    countAccBalance(){
      let tempToday = Vue.moment(new Date());
      for(let i in state.allAccounts){
        let tempStart = Vue.moment(state.allAccounts[i].sdate).subtract(1,'months').toDate();
        tempStart = Vue.moment(tempStart);
        let tempEnd = Vue.moment(state.allAccounts[i].sdate).subtract(1,'days').toDate();
        tempEnd = Vue.moment(tempEnd); 
        if(state.allAccounts[i].accgroup!=1)
          state.allAccounts[i].balance = state.allAccounts[i].initialBalance;
        else if(state.allAccounts[i].accgroup==1){
          state.allAccounts[i].outstdbalance = 0;
          state.allAccounts[i].dueamount = 0;
          state.allAccounts[i].settlestatus = false;
        }

        for(let j in state.allTrans){
          if(state.allTrans[j].account == state.allAccounts[i].accid || state.allTrans[j].fromaccount==state.allAccounts[i].accid||state.allTrans[j].toaccount==state.allAccounts[i].accid){

            if(state.allAccounts[i].accgroup != 1){
              if(state.allTrans[j].type=='Expense')
                state.allAccounts[i].balance -= state.allTrans[j].amount;
              if(state.allTrans[j].type=='Income')
                state.allAccounts[i].balance += state.allTrans[j].amount;
              if(state.allTrans[j].type=='Transfer'){
                if(state.allTrans[j].fromaccount == state.allAccounts[i].accid)
                  state.allAccounts[i].balance -= state.allTrans[j].amount;
                if(state.allTrans[j].toaccount == state.allAccounts[i].accid)
                  state.allAccounts[i].balance += state.allTrans[j].amount;
              }
            }
            else if(state.allAccounts[i].accgroup == 1){
              let tempDate = Vue.moment(state.allTrans[j].date);
              if(tempDate.isBetween(tempStart,tempEnd)){
                if(state.allTrans[j].type=='Expense')
                  state.allAccounts[i].outstdbalance += state.allTrans[j].amount;
                if(state.allTrans[j].type=='Income')
                  state.allAccounts[i].outstdbalance -= state.allTrans[j].amount;
                if(state.allTrans[j].type=='Transfer'){
                  if(!state.allTrans[j].forSettle){
                    if(state.allTrans[j].fromaccount == state.allAccounts[i].accid)
                      state.allAccounts[i].outstdbalance += state.allTrans[j].amount;
                    if(state.allTrans[j].toaccount == state.allAccounts[i].accid)
                      state.allAccounts[i].outstdbalance -= state.allTrans[j].amount;
                  }else{
                    if(state.allTrans[j].toaccount == state.allAccounts[i].accid){
                      state.allAccounts[i].dueamount -= state.allTrans[j].amount;
                      state.allAccounts[i].settlestatus = true;
                    }
                    if(state.allTrans[j].fromaccount == state.allAccounts[i].accid){
                      state.allAccounts[i].outstdbalance += state.allTrans[j].amount;
                    }
                  }
                }
              }else if(tempDate.isBefore(tempStart)){
                if(state.allTrans[j].type=='Expense')
                  state.allAccounts[i].dueamount += state.allTrans[j].amount;
                if(state.allTrans[j].type=='Income')
                  state.allAccounts[i].dueamount -= state.allTrans[j].amount;
                if(state.allTrans[j].type=='Transfer'){
                  if(state.allTrans[j].fromaccount == state.allAccounts[i].accid){
                    state.allAccounts[i].dueamount += state.allTrans[j].amount;
                  }
                  if(state.allTrans[j].toaccount == state.allAccounts[i].accid){
                    state.allAccounts[i].dueamount -= state.allTrans[j].amount;
                  }
                }
              }
            }
          }
        }
      }
    },
    //Set Max Id of Transactions
    setMaxTransId(state,value){
      state.maxTransId = value;
    },
    //Check Recurring Trans Added.
    setRecurAddState(state,value){
      state.recurAddState = value;
    },
    /////////////////////////////////
    //////////////////Budget
    setBudgetState(state,value){
      state.budgetStat = value;
    },
    setBudgetAmount(state,value){
      state.budgetAmount = value;

    },

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
    //Update Promo Minimum Swipe & Maximum Spend Amount
    updatePromoSwipeSpend(state,value){
      for(let i in state.allPromo){
        state.allPromo[i].transcount = state.allPromo[i].maxtranscount;
        state.allPromo[i].transspend = state.allPromo[i].maxtransspend;
        for(let j in state.allTrans){
          let temp = state.allTrans[j].usedpromo;
          if(temp.length>0){
            for(let k in temp){
              if(temp[k] == state.allPromo[i].promoid){
                if(state.allPromo[i].maxtranscount>0)
                  state.allPromo[i].transcount -= 1;
                if(state.allPromo[i].maxtransspend>0)
                  state.allPromo[i].transspend -= state.allTrans[j].amount;
              }
            }
          }
        }
      }
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
              //Check Limit Usage
              if(x.maxtranscount==0 || (x.maxtranscount!=0&&x.transcount>0)){
                if(x.maxtransspend == 0 || (x.maxtransspend!=0&&x.transspend>0))
                  return x; 
                }
              }
            }
          }
        });
        for(let i in state.allAccounts){
          let tempacc = {};
          if(state.allAccounts[i].accgroup!=1&&state.allAccounts[i].accgroup!=2){
            tempacc = {
              text:state.allAccounts[i].name+' ($'+state.allAccounts[i].balance+')',
              id:state.allAccounts[i].accid,
              rltpromo:[],
            };
          }else{
            if(state.allAccounts[i].accgroup==2){
              tempacc = {
                text:state.allAccounts[i].name+'('+state.allAccounts[i].last4digits+')'+'($'+state.allAccounts[i].balance+')',
                id:state.allAccounts[i].accid,
                rltpromo:[],
              };
            }else{
              tempacc = {
                text:state.allAccounts[i].name+'('+state.allAccounts[i].last4digits+')',
                id:state.allAccounts[i].accid,
                rltpromo:[],
              };
            }
          }
          //let tempacc = {
          //  text: state.allAccounts[i].name+'('+'',
          //  id: state.allAccounts[i].accid,
          //  rltpromo:[],
          //};
          for(let j in filteredPromo){
            if(filteredPromo[j]){
              if(filteredPromo[j].rltacc.includes(state.allAccounts[i].accid)){
                tempacc.rltpromo.push(filteredPromo[j].promoid);
              }
            if(tempacc.rltpromo.length>0){
              if(!state.suggestAcc.includes(tempacc))
                state.suggestAcc.push(tempacc);
              }
            }
          }
        }
      }
    },
    //////////////////Notification Feature
    //Set Notification Status
    setNotifyStats(state,value){
      state.notifyStats = value;
      if(value == true){
        scheduleNotification();
      }else if(value == false){
        cordova.plugins.notification.local.cancelAll(function(){},this);
      }
    },
    /////////////////////////////////
    //////////////////Security Feature
    //Set Pin Code
    setPinCode(state,value){
      state.PINCode = value;
    },
    setPinStat(state,value){
      state.PINStat = value;
    }
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
        }else{
          localForage.setItem('state',context.state);
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
