<template>
  <div style="margin-bottom:20%">
    <van-tabs type="card" v-model="transtab" style="padding-top:5%">

    <!--Summary-->
    <van-tab title="Summary">
    
    <!-- Add Transaction Float Action Button-->
    <vue-fab v-if="!isProfile" :hidden="hideAddTransFab" icon="icon-plus" size="normal" style="margin-bottom:20%" @clickMainBtn="addTransButton"/>

    <!-- Transaction Summary-->
    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
      {{getDateFormatted(currentMonth)}}
    </van-divider>
    
    <van-row style="text-align:center" type="flex" align="center">
      <van-col span="3">
        <van-icon name="arrow-left" @click="changeMonth('prev')"/>
      </van-col>
      <van-col span="6" style="background-color:#f1f9f1">
        <span style="font-size:13px;color:#7acc7a">Income<br/>$ {{monthTotalInc}}</span>
      </van-col>
      <van-col span="6" style="background-color:#ffeaea">
        <span style="font-size:13px;color:#FF3434">Expense<br/>$ {{monthTotalExp}}</span>
      </van-col>
      <van-col span="6" style="background-color:#eaeaea">
        <span style="font-size:13px">Total<br/>$ {{monthTotal}}</span>
      </van-col>
      <van-col span="3">
        <van-icon name="arrow" @click="changeMonth('next')"/>
      </van-col>
    </van-row>
    
    <!-- Transaction List-->
    <div style="margin-bottom:40px;">
      <van-collapse v-model="activeNames" accordion>
        <van-collapse-item v-for="(trans,key) in getDateGroupedTrans" :title="key" :name="key">
         <van-swipe-cell v-for="one in trans" :on-close="transOnClose" :name="one.transid">
            <van-cell clickable style="background-color:#f9f9f9" size="small" is-link arrow-direction="left" @click="showEditTrans(one)">
              <!--Not Transfer-->
              <template v-if="one.type!='Transfer'" slot="title">
                <span style="font-size:13px" v-if="one.contents!=''">{{one.contents}}<br/></span>
                <van-tag plain type="danger" v-if="one.type=='Expense'">{{getCatName(one.type,one.category)}}</van-tag> 
                <van-tag plain type="success" v-if="one.type=='Income'">{{getCatName(one.type,one.category)}}</van-tag> 
                <van-tag plain>{{getAccName(one.account)}}</van-tag> 
              </template>

              <!-- Is Transfer-->
              <template slot="label" v-if="one.type=='Transfer'">
                <span>{{getAccName(one.fromaccount)}}&nbsp</span>
                <van-icon name="arrow"/>
                <span>{{getAccName(one.toaccount)}}&nbsp</span>
              </template>
              <template v-if="one.type=='Transfer'" slot="title">
                <span style="font-size:13px" v-if="one.contents!=''">{{one.contents}}<br/></span>
                <van-tag plain type="primary">Transfer</van-tag> 
              </template>

              <template slot="default">
                <span style="color:#FF3434" v-if="one.type=='Expense'">$ {{one.amount}}<br/></span>
                <span style="color:#7acc7a" v-if="one.type=='Income'">$ {{one.amount}}<br/></span>
                <span style="color:#4da6ff" v-if="one.type=='Transfer'">$ {{one.amount}}<br/></span>
                <van-tag plain v-if="one.recurring == true" type="warning">Recurring</van-tag>
                <van-tag plain v-if="one.recurring == true" type="warning">{{getRecurringTime(one)}}</van-tag>
              </template>
            </van-cell>
            <template slot="right">
              <van-button type="danger" text="Delete"/>
            </template>
         </van-swipe-cell>
         <div slot="value">
           <span style="color:#7acc7a">$ {{getDateSummary(key,'Income')}}</span>
           &nbsp &nbsp
           <span style="color:#FF3434">$ {{getDateSummary(key,'Expense')}}</span>
         </div>
        </van-collapse-item>
      </van-collapse>
      </div>
      </van-tab>

      <!-- Statistics -->
      <van-tab title="Statistics">
        <van-row style="text-align:center;margin-top:15px" type="flex" align="center">
          <van-col span="3">
            <van-icon name="arrow-left" @click="changeMonth('prev')"/>
          </van-col>
          <van-col span="18">
            {{getDateFormatted(currentMonth)}}
          </van-col>
          <van-col span="3">
            <van-icon name="arrow" @click="changeMonth('next')"/>
          </van-col>
        </van-row>
        <van-dropdown-menu>
          <van-dropdown-item v-model="statsmode" :options="statsmodeoptions"/>   
        </van-dropdown-menu>
        <v-expense-chart v-if="statsmode==0" :expdata="setChartData(getMonthly('Expense'),'Expense')"></v-expense-chart>
        <v-income-chart v-if="statsmode==1" :incdata="setChartData(getMonthly('Income'),'Income')"></v-income-chart>
        <van-cell-group v-if="statsmode==0">
          <van-cell v-for="cat in getMonthly('Expense')" :title="getCatName('Expense',cat.category)" :value="'$' + cat.expensesum"/>
        </van-cell-group>
        <van-cell-group v-if="statsmode==1">
          <van-cell v-for="cat in getMonthly('Income')" :title="getCatName('Income',cat.category)" :value="'$' + cat.incomesum"/>
        </van-cell-group>
      </van-tab>
    </van-tabs>

    <!-- Edit Transaction Page(Popup)-->
    <van-popup v-model="editTransPop" position="bottom" :style="{height:'100%'}">
      <v-edit-trans @closeEditTrans="closeEditTrans" :trans="selectedTrans"></v-edit-trans>
    </van-popup>
  </div>
</template>
<script>
  import EditTrans from './EditTrans.vue'
  import ExpenseChart from './ExpenseChart.vue'
  import IncomeChart from './IncomeChart.vue'

  export default{
    data(){
      return{
        hideAddTransFab:false,
        activeNames:'1',
        currentMonth:new Date(),
        dateSummary:[],
        monthTotalExp:0,
        monthTotalInc:0,
        monthTotal:0,
        editTransPop:false,
        selectedTrans:'',
        transtab:0,
        statsmode:0,
        statsmodeoptions:[
          {text:'Expense',value:0},
          {text:'Income',value:1},
        ],
      }
    },
    methods:{
      //Add Transaction Button
      addTransButton(){
        this.$router.push("/addtrans");
      },

      //Show Edit Account
      showEditTrans(trans){
        this.editTransPop = true;
        this.hideAddTransFab = true;
        this.selectedTrans = trans;
      }, 
      //Close Edit Trans
      closeEditTrans(){
        this.editTransPop = false;
        this.hideAddTransFab = false; 
        this.selectedTrans = '';
      },
      //Formatting the date
      getDateFormatted(date){
        return this.$moment(date).format('MMMM YYYY');
      },

      //Arrow Button to change Month
      changeMonth(value){
        switch(value){
          case 'prev':
            this.currentMonth = this.$moment(this.currentMonth).subtract(1,'month');
            break;
          case 'next':
            this.currentMonth = this.$moment(this.currentMonth).add(1,'month');
            break;
        } 
      },

      //Get Accounts Name
      getAccName(value){
        let temp = this.getAccounts.find(o=>o.accid==value);
        if(temp == null || temp==undefined)
          return "Deleted Account";
        else
          return temp.name;
      },

      //Get Category Name
      getCatName(type,value){
        switch(type){
        case 'Expense':
          let tempExp = this.getExpCat.find(o=>o.expcatid==value);
          if(tempExp == null || tempExp == undefined)
              return "Other";
          else
              return tempExp.expCatName;
          break;
        case 'Income':
          let tempInc = this.getIncCat.find(o=>o.inccatid==value);
          if(tempInc == null || tempInc == undefined)
              return "Other";
          else
              return tempInc.incCatName;
          break; 
        }
      },

      //Get Month's Summary
      getTotalSummary(list){
        this.monthTotalInc = 0;
        this.monthTotalExp = 0;
        this.monthTotal = 0;
        for(let i in list){
          if(list[i].type=='Expense')
            this.monthTotalExp += list[i].amount;
          else if(list[i].type=='Income')
            this.monthTotalInc += list[i].amount;  
        }
        this.monthTotal = this.monthTotalInc - this.monthTotalExp;   
      },

      //Get Date Summary
      getDateSummary(date,type){
        let result = this.dateSummary.find(item => item.date == date);
        if(type=='Expense')
          return result.exptotal;
        else if(type=='Income')
          return result.inctotal; 
      },

      getRecurringTime(trans){
        let temp = [
            {text:'Sunday',value:7},
            {text:'Monday',value:1},
            {text:'Tuesday',value:2},
            {text:'Wednesday',value:3},
            {text:'Thursday',value:4},
            {text:'Friday',value:5},
            {text:'Saturday',value:6},
        ]
        if(trans.recurringtype == 0){
          return 'Daily'
        }else if(trans.recurringtype == 1){
          let result = temp.find(o=>o.value == trans.recurringtime);
          return result.text;
        }else if(trans.recurringtype == 2){
          return trans.recurringtime;
        }
      },
      //Get Monthly Expense & Income
      getMonthly(type){
        let temp = [];
        if(this.isProfile)
           temp = _.filter(this.getTrans, x=>{
            return x.account == this.acc.accid || x.fromaccount == this.acc.accid || x.toaccount == this.acc.accid;
          }); 
        else
          temp = this.getTrans;
        let tempList = [];
        switch(type){
          case 'Expense':
            for(let i in temp){
              let tempDate = this.$moment(temp[i].date);
              let tempCurrentDate = this.$moment(this.currentMonth);
              if(tempDate.month()==tempCurrentDate.month()&&tempDate.year()==tempCurrentDate.year()&&temp[i].type=="Expense")
                tempList.push(temp[i]);
              } 
            tempList = _.groupBy(tempList,'category');
            tempList = _.map(tempList,(obj,keys)=>({
              'category':keys,
              'expensesum':_.sumBy(obj,'amount') 
            }));
            break;
          case 'Income':
            for(let i in temp){
              let tempDate = this.$moment(temp[i].date);
              let tempCurrentDate = this.$moment(this.currentMonth);
              if(tempDate.month()==tempCurrentDate.month()&&tempDate.year()==tempCurrentDate.year()&&temp[i].type=="Income")
                tempList.push(temp[i]);
            } 
            tempList = _.groupBy(tempList,'category');
            tempList = _.map(tempList,(obj,keys)=>({
              'category':keys,
              'incomesum':_.sumBy(obj,'amount') 
            }));
            break;
        }
        return tempList; 
      },

      //Set Data for Charts
      setChartData(data,type){
        let forchartdata = {
          labels:[],
          data:[],
        }
        switch(type){
          case 'Expense':
            for(let j in data){
            let findcat = this.getExpCat.find(o=>o.expcatid==data[j].category);
            forchartdata.labels.push(findcat.expCatName);
            forchartdata.data.push(data[j].expensesum);
            }  
            break;
          case 'Income':
            for(let j in data){
            let findcat = this.getIncCat.find(o=>o.inccatid==data[j].category);
            forchartdata.labels.push(findcat.incCatName);
            forchartdata.data.push(data[j].incomesum);
            }  
            break;
        }
        return forchartdata;
      },

      //SwipeCell onClose Transaction Delete
      transOnClose(clickPosition, instance,detail){
        switch(clickPosition){
          case 'left':
          case 'cell':
          case 'outside':
            instance.close();
            break;
          case 'right':
            this.$dialog.confirm({
              message:'Are you sure to delete?'
            }).then(()=>{
              this.$store.commit('deleteTrans',detail.name);
              this.$store.dispatch('storeAllStateData');
            }).catch(()=>{
              this.$dialog.close();
            });
            break;
        }
      },
      
    },
    computed:{
      getTrans(){
        return this.$store.state.allTrans;
      },
      getDateGroupedTrans(){
        this.monthTotalInc = 0;
        this.monthTotalExp = 0;
        this.monthTotal = 0;
        let temp = [];
        if(this.isProfile)
           temp = _.filter(this.getTrans, x=>{
            return x.account == this.acc.accid || x.fromaccount == this.acc.accid || x.toaccount == this.acc.accid;
          }); 
        else
          temp = this.getTrans;
        let tempList = [];
        for(let i in temp){
          let tempDate = this.$moment(temp[i].date);
          let tempCurrentDate = this.$moment(this.currentMonth);
          if(tempDate.month()==tempCurrentDate.month()&&tempDate.year()==tempCurrentDate.year())
            tempList.push(temp[i]);
        }
        this.getTotalSummary(tempList);
        tempList.sort((a,b)=>{
          return b.date - a.date;
        });
        let grouped = _.groupBy(tempList,group=>{
          return this.$moment(group.date).format('DD MMMM YYYY');
        });
        this.dateSummary = [];
        for(let i in grouped){
          let expTotal = 0;
          let incTotal = 0;
          for(let j in grouped[i]){
            if(grouped[i][j].type == "Expense")
              expTotal += grouped[i][j].amount;
            else if(grouped[i][j].type == "Income")
              incTotal += grouped[i][j].amount;          
          }
          let summary = {
            date:this.$moment(grouped[i][0].date).format('DD MMMM YYYY'),
            exptotal:expTotal,
            inctotal:incTotal
          }
          this.dateSummary.push(summary);
        }
        return grouped;
      },
      getAccounts(){
        return this.$store.state.allAccounts;
      },
      getExpCat(){
        return this.$store.state.expCat; 
      },
      getIncCat(){
        return this.$store.state.incCat;
      }
    },
    mounted(){
    },
    components:{
      'v-edit-trans':EditTrans,
      'v-expense-chart':ExpenseChart,
      'v-income-chart':IncomeChart
    },
    props:['acc','isProfile']
  }
</script>
