<template>
  <div>
    <!-- Tabs -->
    <van-tabs v-model="activeName" sticky>
      <!--Accounts Tab-->
      <van-tab name="accounts">
        <div slot="title">
          <van-icon name="credit-pay"/>
            Accounts
        </div>
        <v-accounts></v-accounts>
      </van-tab>

      <!-- Transactions Tab-->
      <van-tab name="transactions">
        <div slot="title">
          <van-icon name="orders-o"/>
            Transactions
        </div>
        <v-transactions></v-transactions>
      </van-tab>

    </van-tabs>

  </div>
</template>

<script>
  //Import Accounts component
  import Accounts from './Accounts.vue'; 
  //Import Transactions component
  import Transactions from './Transactions.vue';
  
  export default{
    data(){
      return{
        activeName:'accounts'
      }
    },

    components:{
      'v-accounts':Accounts,
      'v-transactions':Transactions
    }
  }
</script>
