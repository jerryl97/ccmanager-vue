<template>
  <div>
    <!-- Tabs -->
    <van-tabs v-model="active" sticky>
      <!--Accounts Tab-->
      <van-tab>
        <div slot="title">
          <van-icon name="credit-pay"/>
            Accounts
        </div>
        <v-accounts/>
      </van-tab>

      <!-- Transactions Tab-->
      <van-tab>
        <div slot="title">
          <van-icon name="orders-o"/>
            Transactions
        </div>
        <v-transactions :acc="acc" :isProfile="isProfile" />
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
  import Accounts from '../components/Accounts.vue'
  import Transactions from '../components/Transactions.vue'
  
  export default{
    data(){
      return{
        active:this.$route.query.activeTab,
        acc:'',
        isProfile:false,
      }
    },
    components:{
      'v-accounts':Accounts,
      'v-transactions':Transactions,
    },
    
  }
</script>
