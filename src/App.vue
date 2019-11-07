<template>
  <div id="app">
    <!--A View for Router Pages-->
    <router-view></router-view>

  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return{
      accList:[],
      notifystats:'',
    }
  },
  methods:{
    onBackKeyDown(){
      this.$dialog.confirm({
        message:'Are you sure to quit?'
      }).then(()=>{
        let today = new Date();
        this.$store.commit('setTodayDate',today);
        this.$store.dispatch('storeAllStateData');
        navigator.app.exitApp();
      }).catch(()=>{
        this.$dialog.close();
      })
    },

    addRecurringTrans(){
      let today = new Date();
      let allRecurTrans = this.getRecurringTrans;
      let tempToday = this.$moment(today).format('YYYY-MMMM-DD');
      if(allRecurTrans.length>0){
      for(let i in allRecurTrans){
          let tempdate = this.$moment(allRecurTrans[i].date).format('YYYY-MMMM-DD');
          //let existed = _.filter(this.getTrans,x=>{
          //  return this.$moment(x.date).format('YYYY-MM-DD') == todayformatted && x.recurid == allRecurTrans[i].recurid;
          //});
        let tempStoreDay = this.$moment(this.getTodayDate).format('YYYY-MMMM-DD');

        if(tempToday!=tempStoreDay&&this.getRecurAddState==false){
        if(allRecurTrans[i].recurringtype == 0){
          if(tempToday!=tempdate){
            let temp = Object.assign({},allRecurTrans[i]);
            temp.transid = null;
            temp.date = new Date();
            this.$store.commit('addTrans',temp);
            this.$store.dispatch('storeAllStateData');
          }
        }else if(allRecurTrans[i].recurringtype == 1){
            let tempweekday = allRecurTrans[i].recurringtime;
            if(tempweekday == 7)
              tempweekday = 0;
            if(this.$moment(today).day() == tempweekday){
              let temp = Object.assign({},allRecurTrans[i]);
              temp.transid = null;
              temp.date = new Date();
              this.$store.commit('addTrans',temp);
              this.$store.dispatch('storeAllStateData');
            }
        }else if(allRecurTrans[i].recurringtype == 2){
            if(this.$moment(today).date() == allRecurTrans[i].recurringtime){
              let temp = Object.assign({},allRecurTrans[i]);
              temp.transid = null;
              temp.date = new Date();
              this.$store.commit('addTrans',temp);
              this.$store.dispatch('storeAllStateData'); 
              }
            }
          }
        }
      this.$store.commit('setRecurAddState',true);
      this.$store.dispatch('storeAllStateData');
      }
    },
    updateAccDates(){
      this.$store.commit('updateAccountDates');
      this.$store.dispatch('storeAllStateData')
    },
  },
  computed:{
    getAccounts(){
      return this.$store.state.allAccounts;
    },
    getTodayDate(){
      return this.$store.state.todayDate;
    },
    getRecurAddState(){
      return this.$store.state.recurAddState;
    },
    getTrans(){
      return this.$store.state.allTrans; 
    },
    getNotifyStats(){
      return this.$store.state.notifyStats;
    },
    getRecurringTrans(){
      let temp = _.filter(this.getTrans, x=>{
        return x.recurring == true;
      });
      temp = _.orderBy(temp,['date'],['desc']);
      temp = _.uniqBy(temp,'recurid'); 
      return temp;
    }
  },
  mounted(){
    this.$store.dispatch('getAllStateData');
    document.addEventListener("backbutton",this.onBackKeyDown,false); 
  },
  updated(){
    let tempToday = this.$moment(new Date()).format('YYYY-MMM-DD');
    let tempStoreDay = this.$moment(this.getTodayDate).format('YYYY-MMM-DD');
    if(tempToday != tempStoreDay){
      this.$store.commit('setRecurAddState',false);
      this.addRecurringTrans();
      this.$store.commit('setTodayDate',new Date());
      this.$store.dispatch('storeAllStateData');
    }
    this.updateAccDates(); 
  }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
