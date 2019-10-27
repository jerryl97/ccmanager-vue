<template>
  <div style="padding-top:13%">
    <van-nav-bar :title="title" left-text="Back" left-arrow @click-left="back()" @click-right="addRecurTrans" fixed>
      <template slot="right">
        <van-icon name="plus" size="15px"/>
        <span style="color:#1989fa;font-size:15px">Add</span>
      </template>
    </van-nav-bar>

    <div style="margin-bottom:40px;">
      <van-collapse v-model="activeNames" accordion>
        <van-collapse-item v-for="(trans,key) in getGroupedTrans" :title="key" :name="key">
        <van-swipe-cell v-for="one in trans" :on-close="transOnClose" :name="one.recurid">
          <van-cell style="background-color:#f9f9f9" size="small" arrow-direction="left" is-link @click="showEditTrans(one)">

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
                <van-tag plain v-if="one.recurring == true" type="warning">{{key}}</van-tag>
                <van-tag plain v-if="one.recurring == true && one.recurringtype != 0" type="warning">{{getRecurringTime(one)}}</van-tag>
              </template>
              
          </van-cell>
          <template slot="right">
            <van-button type="danger" text="Delete"/>
          </template>
        </van-swipe-cell>
        </van-collapse-item>
        </van-collapse>
    </div>

    <!-- Edit Transaction Page(Popup)-->
    <van-popup v-model="editTransPop" position="bottom" :style="{height:'100%'}">
      <v-edit-trans @closeEditTrans="closeEditTrans" :trans="selectedTrans"></v-edit-trans>
    </van-popup>

     
  </div>
</template>
<script>
  import EditTrans from './EditTrans.vue'
  export default{
    data(){
      return{
        title:'Recurring Transactions',
        activeNames:'',
        selectedTrans:'',
        editTransPop:false, 
      }
    },
    methods:{
      back(){
        this.$emit("closeRecurringTrans");
      },
      addRecurTrans(){
        this.$emit("closeRecurringTrans");
        this.$router.push({path:'/main/addtrans'});
      },
      //Get Accounts Name
      getAccName(value){
        let temp = this.getAccounts.find(o=>o.accid==value);
        if(temp == null || temp==undefined)
          return "Deleted Account";
        else
          return temp.name;
      },
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
          return result.text;
        }else if(trans.recurringtype == 2){
          return trans.recurringtime;
        }
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
              let temp = _.filter(this.getTrans,x=>{
                return x.recurid = detail.name;
              });
              for(let i in temp){
                temp[i].recurring = false;
                this.$store.commit('editTrans',temp[i]);
              }
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
      getAccounts(){
        return this.$store.state.allAccounts;
      },
      getExpCat(){
        return this.$store.state.expCat; 
      },
      getIncCat(){
        return this.$store.state.incCat;
      },
      getGroupedTrans(){
        let temp = this.getTrans;
        temp = _.filter(temp, x=>{
          return x.recurring == true;
        });  
        temp = _.uniqBy(temp,"recurid");
        let grouped = _.groupBy(temp,group=>{
          let temp = '';
          if(group.recurringtype == 0){
            temp = 'Daily';
          }else if(group.recurringtype == 1){
            temp = 'Weekly';
          }else if(group.recurringtype == 2){
            temp = 'Monthly';
          }
          return temp;
        })
        return grouped;
      },
    },
    components:{
      'v-edit-trans':EditTrans,
    }
  }

</script>
