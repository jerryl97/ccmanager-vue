<template>
  <div style="padding-bottom:50px">
    <div style="background-color:#f6f6f6;color:#333333;padding-bottom:5px">
     <van-row style="text-align:center;padding:10px" type="flex" align="center">
       <van-col span="3">
         <van-icon name="arrow-left" @click="changeStatementRange('prev')"/>
       </van-col>
       <van-col span="18">
         <strong>{{getStatementRange()}}</strong>
       </van-col>
       <van-col span="3">
         <van-icon name="arrow" @click="changeStatementRange('next')"/>
       </van-col>
     </van-row>

     <van-row style="text-align:center" type="flex" align="center">
       <van-col span="8">
         <span style="font-size:15px;color:#7acc7a"><strong>Income $</strong><br/>{{stateTotalInc}}</span>
       </van-col>
       <van-col span="8">
         <span style="font-size:15px;color:#FF3434"><strong>Expense $</strong><br/>{{stateTotalExp}}</span>
       </van-col>
       <van-col span="8">
         <span style="font-size:15px"><strong>Total $</strong><br/>{{stateTotal}}</span>
       </van-col>
     </van-row>
    </div>

    <van-tabs background="#f6f6f6" title-active-color="#07c160" title-inactive-color="#333333" color="#07c160" v-model="transtab">
      <van-tab>
        <template slot="title">
          <van-icon name="orders-o"/>
          Summary
        </template>
         <div>
          <van-collapse v-model="activeNames" accordion>
          <van-collapse-item v-for="(trans,key) in getDateGroupedTrans" :name="key">
           <template slot="title">
             <strong>{{key}}</strong>
           </template>
           <template slot="value">
             <span style="color:#7acc7a">Inc: {{getDateSummary(key,'Income')}}</span>
             &nbsp &nbsp
             <span style="color:#FF3434">Exp: {{getDateSummary(key,'Expense')}}</span>
           </template>
         <van-swipe-cell v-for="one in trans" :on-close="transOnClose" :name="one.transid">
            <van-cell id="transcell" clickable size="small" is-link arrow-direction="left" @click="showTransActionSheet(one)">
              <!--Not Transfer-->
              <template v-if="one.type!='Transfer'" slot="title">
                <span style="font-size:13px" v-if="one.contents!=''">{{one.contents}}<br/></span>
                <van-tag plain type="danger" v-if="one.type=='Expense'">{{getCatName(one.type,one.category)}}</van-tag> 
                <van-tag plain type="success" v-if="one.type=='Income'">{{getCatName(one.type,one.category)}}</van-tag> 
                <van-tag plain>{{getAccName(one.account)}}</van-tag><br/>
              </template>

              <!-- Is Transfer-->
              <template slot="label" v-if="one.type=='Transfer'">
                <van-tag plain>{{getAccName(one.fromaccount)}}&nbsp</van-tag>
                <van-icon name="arrow"/>
                <van-tag plain>{{getAccName(one.toaccount)}}&nbsp</van-tag>
              </template>
              <template v-if="one.type=='Transfer'" slot="title">
                <span style="font-size:13px" v-if="one.contents!=''">{{one.contents}}<br/></span>
                <van-tag plain type="primary">Transfer</van-tag> 
              </template>

              <template slot="default">
                <span style="color:#FF3434;font-size:17px" v-if="one.type=='Expense'">- {{one.amount}}<br/></span>
                <span style="color:#7acc7a;font-size:17px" v-if="one.type=='Income'">+ {{one.amount}}<br/></span>
                <span style="color:#4da6ff;font-size:17px" v-if="one.type=='Transfer'">{{one.amount}}<br/></span>
                <van-tag plain v-if="one.recurring == true" type="warning">Recurring</van-tag>
                <van-tag plain v-if="one.recurring == true" type="warning">{{getRecurringTime(one)}}</van-tag>
              </template>
            </van-cell>
            <template slot="right">
              <van-button type="danger" text="Delete"/>
            </template>
         </van-swipe-cell>
        </van-collapse-item>
      </van-collapse>
      </div>
      </van-tab>

      <van-action-sheet v-model="transActionSheetShow" :actions="transActionSheetActions" :description="transActionSheetDesc" @select="onTransActionSheetSelect"/>
      <!-- Statistics -->
      <van-tab>
        <template slot="title">
          <van-icon name="bar-chart-o"/>
          Statistics
        </template>
        <van-dropdown-menu>
          <van-dropdown-item v-model="statsmode" :options="statsmodeoptions"/>   
        </van-dropdown-menu>

        <v-expense-chart v-if="statsmode==0" :expdata="setChartData(getMonthly('Expense'),'Expense')"></v-expense-chart>

        <v-income-chart v-if="statsmode==1" :incdata="setChartData(getMonthly('Income'),'Income')"></v-income-chart>

        <v-totalstats-chart v-if="statsmode==2" :totaldata="setChartData(getTotalStatsData('Expense'),'ExpTotalStats')"/>
        <v-totalstats-chart v-if="statsmode==2" :totaldata="setChartData(getTotalStatsData('Income'),'IncTotalStats')"/>

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
  import TotalStatsChart from './TotalStatsChart.vue'
  export default{
    data(){
      return{
        startdate:0,
        enddate:0,
        stateTotalExp:0,
        stateTotalInc:0,
        stateTotal:0,
        dateSummary:[],
        activeNames:'1',        
        editTransPop:false,
        selectedTrans:'',
        transtab:0,
        statsmode:0,
        statsmodeoptions:[
          {text:'Expense',value:0},
          {text:'Income',value:1},
          {text:'Total Stats',value:2},
        ],
        transActionSheetShow:false,
        transActionSheetDesc:'',
        transActionSheetActions:[
          {name:'Edit transaction'},
          {name:'Delete transaction'},
        ]
      }
    },
    methods:{
      //Show Transaction Action Sheet
      showTransActionSheet(trans){
        this.selectedTrans = trans;
        this.transActionSheetShow=true;
        this.hideAddTransFab = true;
        this.transActionSheetDesc = trans.contents;
      },
      onTransActionSheetSelect(item,index){
        this.transActionSheetShow=false;
        switch(index){
          case 0:
            this.showEditTrans();
            break;
          case 1:
            this.$dialog.confirm({
              message:'Are you sure to delete?'
            }).then(()=>{
              this.$store.commit('deleteTrans',this.selectedTrans.transid);
              this.$store.dispatch('storeAllStateData');
            }).catch(()=>{
              this.$dialog.close();
            });
            break; 
        }
      },
      //Show Edit Account
      showEditTrans(){
        this.editTransPop = true;
        this.hideAddTransFab = true;
        //this.selectedTrans = trans;
      }, 
      //Close Edit Trans
      closeEditTrans(){
        this.editTransPop = false;
        this.hideAddTransFab = false; 
        this.selectedTrans = '';
      },
      getStatementRange(){
        let displaystartdate = this.$moment(this.startdate).format("DD MMM YYYY");
        let displayenddate = this.$moment(this.enddate).format("DD MMM YYYY");
        return displaystartdate + ' - ' + displayenddate;
      },
      changeStatementRange(type){
        switch(type){
          case 'prev':
            this.startdate = this.$moment(this.startdate).subtract(1,'month').toDate();
            this.enddate = this.$moment(this.enddate).subtract(1,'month').toDate();
            break;
          case 'next':
            this.startdate = this.$moment(this.startdate).add(1,'month').toDate();
            this.enddate = this.$moment(this.enddate).add(1,'month').toDate();
            break;
        }
      },
      getTotalSummary(list){
        this.stateTotalInc = 0;
        this.stateTotalExp = 0;
        this.stateTotal = 0;
        for(let i in list){
          if(list[i].type=='Expense')
            this.stateTotalExp += list[i].amount;
          else if(list[i].type=='Income')
            this.stateTotalInc += list[i].amount;  
        }
        this.stateTotal = this.stateTotalInc - this.stateTotalExp;   
      },
      //Get Date Summary
      getDateSummary(date,type){
        let result = this.dateSummary.find(item => item.date == date);
        if(type=='Expense')
          return result.exptotal;
        else if(type=='Income')
          return result.inctotal; 
      },
      //Get Accounts Name
      getAccName(value){
        let temp = this.getAccounts.find(o=>o.accid==value);
        if(temp == null || temp==undefined)
          return "Deleted Account";
        else{
          if(temp.accgroup == 1 || temp.accgroup == 2)
            return temp.name+'('+temp.last4digits+')';
          else
            return temp.name
        }
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
          return 'Weekly '+result.text;
        }else if(trans.recurringtype == 2){
          return 'Monthly ' + trans.recurringtime;
        }
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
               let tempStart = this.$moment(this.startdate);
               let tempEnd = this.$moment(this.enddate);
               if(tempDate.isBetween(tempStart,tempEnd)&&temp[i].type=="Expense")
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
               let tempStart = this.$moment(this.startdate);
               let tempEnd = this.$moment(this.enddate);
               if(tempDate.isBetween(tempStart,tempEnd)&&temp[i].type=="Income")
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
      getTotalStatsData(type){
        let resultdata = [];
        let temp = [];
        if(this.isProfile)
           temp = _.filter(this.getTrans, x=>{
            return x.account == this.acc.accid || x.fromaccount == this.acc.accid || x.toaccount == this.acc.accid;
          }); 
        else
          temp = this.getTrans;
        switch(type){
          case 'Expense':
            let expfiltered = _.filter(temp,x=>{
              return x.type == "Expense";
            });
            let expsorted = expfiltered.sort((a,b)=>{
              return a.date - b.date;
            });
            let expgrouped = _.groupBy(expsorted,group=>{
              return this.$moment(group.date).format('MMM YYYY');
            });
            resultdata = _.map(expgrouped,(obj,keys)=>({
              'month':keys,
              'sum':_.sumBy(obj,'amount')
            }));
            break;
          case 'Income':
            let incfiltered = _.filter(temp,x=>{
              return x.type == "Income";
            });
            let incsorted = incfiltered.sort((a,b)=>{
              return a.date - b.date;
            });
            let incgrouped = _.groupBy(incsorted,group=>{
              return this.$moment(group.date).format('MMM YYYY');
            });
            resultdata = _.map(incgrouped,(obj,keys)=>({
              'month':keys,
              'sum':_.sumBy(obj,'amount')
            }));
            break;
        }
        return resultdata;
      },
      setChartData(data,type){
        let forchartdata = {
          labels:[],
          data:[],
          label:'',
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
          case 'ExpTotalStats':
            for(let j in data){
              forchartdata.labels.push(data[j].month);
              forchartdata.data.push(data[j].sum);
            }
            forchartdata.label = 'Expense';
            break;
          case 'IncTotalStats':
            for(let j in data){
              forchartdata.labels.push(data[j].month);
              forchartdata.data.push(data[j].sum);
            }
            forchartdata.label = 'Income';
            break;

        }
        return forchartdata;
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
        let tempList = [];
        for(let i in temp){
          let tempDate = this.$moment(temp[i].date);
          let tempStart = this.$moment(this.startdate);
          let tempEnd = this.$moment(this.enddate);
          if(tempDate.isBetween(tempStart,tempEnd))
            tempList.push(temp[i]);
        }
        this.getTotalSummary(tempList);
        tempList.sort((a,b)=>{
          return b.date - a.date;
        });
        let grouped = _.groupBy(tempList,group=>{
          return this.$moment(group.date).format('DD MMM YYYY');
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
            date:this.$moment(grouped[i][0].date).format('DD MMM YYYY'),
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
    watch:{
      acc(){
        let temptoday = this.$moment(new Date());
        this.startdate = this.acc.sdate;
        this.enddate = this.$moment(this.startdate).add(1,'months').subtract(1,'days').toDate();
        let tempStart = this.$moment(this.startdate);
        let tempEnd = this.$moment(this.enddate);
        if(!temptoday.isBetween(tempStart,tempEnd)){
          if(temptoday.isBefore(tempStart)){
            this.startdate = this.$moment(this.acc.sdate).subtract(1,'months').toDate();
            this.enddate = this.$moment(this.startdate).add(1,'months').subtract(1,'days').toDate();
          }else if(temptoday.isAfter(tempEnd)){
            this.startdate = this.$moment(this.acc.sdate).add(1,'months').toDate();
            this.enddate = this.$moment(this.startdate).add(1,'months').subtract(1,'days').toDate();
          }
        } 
      }
    },
    mounted(){
        let temptoday = this.$moment(new Date());
        this.startdate = this.acc.sdate;
        this.enddate = this.$moment(this.startdate).add(1,'months').subtract(1,'days').toDate();
        let tempStart = this.$moment(this.startdate);
        let tempEnd = this.$moment(this.enddate);
        if(!temptoday.isBetween(tempStart,tempEnd)){
          if(temptoday.isBefore(tempStart)){
            this.startdate = this.$moment(this.acc.sdate).subtract(1,'months').toDate();
            this.enddate = this.$moment(this.startdate).add(1,'months').subtract(1,'days').toDate();
          }else if(temptoday.isAfter(tempEnd)){
            this.startdate = this.$moment(this.acc.sdate).add(1,'months').toDate();
            this.enddate = this.$moment(this.startdate).add(1,'months').subtract(1,'days').toDate();
          }
        } 
    },
    components:{
      'v-edit-trans':EditTrans,
      'v-expense-chart':ExpenseChart,
      'v-income-chart':IncomeChart,
      'v-totalstats-chart':TotalStatsChart,
    },
    props:['acc','isProfile']
  }
</script>
