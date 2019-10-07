<template>
  <div id="app">
    <!--A View for Router Pages-->
    <router-view @notifyDue="notifyDue"></router-view>

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
      active:0,
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

    notifyDue(){
      let today = new Date();
      for(let i in this.getAccounts){
        if(this.getAccounts[i].accgroup==1){
        if(this.$moment(today).month() == this.$moment(this.getAccounts[i].pduedate).month()){
          let id1 = this.getAccounts[i].accid + '' + 1;
          let id2 = this.getAccounts[i].accid + '' + 2;
          let id3 = this.getAccounts[i].accid + '' + 3;
          if(this.getNotifyStats == true){
          cordova.plugins.notification.local.schedule([
            {id:id1,
            title:'5 Days Left to Due',
            text:this.getAccounts[i].name,
            trigger:{every:{month:this.$moment(today).month()+1,day:this.$moment(this.getAccounts[i].pduedate).date()-5}}},
            {id:id2,
            title:'3 Days Left to Due',
            text:this.getAccounts[i].name,
            trigger:{every:{month:this.$moment(today).month()+1,day:this.$moment(this.getAccounts[i].pduedate).date()-3}}},
            {id:id3,
            title:'1 Day Left to Due',
            text:this.getAccounts[i].name,
            trigger:{every:{month:this.$moment(today).month()+1,day:this.$moment(this.getAccounts[i].pduedate).date()-1}}},
          ]);
          }else if(this.getNotifyStats == false){
            cordova.plugins.notification.local.cancel([id1,id2,id3],function(){
            })
          }
          }
        }
      } 
    },
    updateAccDates(){
      let today = new Date();
      for(let i in this.getAccounts){
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
              this.getAccounts[i].dueamount += this.getAccounts[i].outstdbalance;
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
    },
    getNotifyStats(){
      return this.$store.state.notifyStats;
    }
  },
  mounted(){
    document.addEventListener("backbutton",this.onBackKeyDown,false);
  },
  updated(){
    this.updateAccDates();
    this.notifyDue();
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
