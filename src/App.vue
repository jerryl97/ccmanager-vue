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
        navigator.app.exitApp();
      }).catch(()=>{
        this.$dialog.close();
      })
    },
    addRecurringTrans(){
      let today = new Date();
      let allRecurTrans = this.getRecurringTrans;
      let todayformatted = this.$moment(new Date()).format('YYYY-MM-DD');
      if(allRecurTrans.length>0){
      for(let i in allRecurTrans){
          let tempdate = this.$moment(allRecurTrans[i].date).format('YYYY-MM-DD');
          let existed = _.filter(this.getTrans,x=>{
            return this.$moment(x.date).format('YYYY-MM-DD') == todayformatted && x.recurid == allRecurTrans[i].recurid;
          }); 
        if(existed.length == 0){
        if(allRecurTrans[i].recurringtype == 0){
          if(this.$moment(todayformatted).isSame(tempdate) == false){
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
      }
    },
    updateAccDates(){
      this.$store.commit('updateAccountDates');
      this.$store.dispatch('')
    },
  },
  computed:{
    getAccounts(){
      return this.$store.state.allAccounts;
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
  beforeUpdate(){
    this.updateAccDates();
    this.addRecurringTrans();
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
