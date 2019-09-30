<template>
  <div id="app">
    <!--A View for Router Pages-->
    <router-view></router-view>

    <!--Main Tabbar-->
    <van-tabbar v-model="active" active-color="#07c160" inactive-color="#000" route>
      <van-tabbar-item replace to="/addtrans" icon="plus">Add Trans</van-tabbar-item>
      <van-tabbar-item replace to="/acctrans" icon="paid">Acc & Trans</van-tabbar-item>
      <van-tabbar-item replace to="/promotions" icon="gift-o">Promo</van-tabbar-item>
      <van-tabbar-item replace to="/settings" icon="setting-o">Settings</van-tabbar-item>
    </van-tabbar> 
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return{
      active:0
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
    updateAccDates(){
      console.log('haha');
      for(let i in this.getAccounts){
        let today = new Date();
        if(this.$moment(today).date() > this.$moment(this.getAccounts[i].sdate).date()){
          if(this.$moment(today).month() != this.$moment(this.getAccounts[i].sdate).month()){
            let tempsdate = this.$moment(this.getAccounts[i].sdate).date() + this.$moment(today).format(' MMMM YYYY');
            this.getAccounts[i].sdate = tempsdate;
            let temppdate = this.$moment(this.getAccounts[i].pduedate).date() + this.$moment(today).format(' MMMM YYYY');
            this.getAccounts[i].pduedate = temppdate;
            this.getAccounts[i].cutoffdate = this.$moment(this.getAccounts[i].sdate).toDate();
            this.getAccounts[i].cutoffdate = this.$moment(this.getAccounts[i].cutoffdate).add('1','months').format('D MMMM YYYY');
            this.getAccounts[i].nextduedate = this.$moment(this.getAccounts[i].pduedate).toDate();
            this.getAccounts[i].nextduedate = this.$moment(this.getAccounts[i].nextduedate).add('1','months').format('D MMMM YYYY');  
            if(this.getAccounts[i].outstdbalance != 0){
              this.getAccounts[i].dueamount = this.getAccounts[i].dueamount + this.getAccounts[i].outstdbalance;
              this.getAccounts[i].outstdbalance = 0;
            }
            this.getAccounts[i].settlestatus = false;
            this.$store.dispatch('storeAllStateData');
          }
        }
      } 
      
    },
  },
  computed:{
    getAccounts(){
      return this.$store.state.allAccounts;
    } 
  },
  mounted(){
    document.addEventListener("backbutton",this.onBackKeyDown,false); 
    //this.updateAccDates();
  },
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
