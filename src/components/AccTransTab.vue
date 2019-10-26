<template>
  <div>
    <!-- Tabs -->
    <van-tabs color="#07c160" title-active-color="#07c160" v-model="active" sticky>
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
          <van-icon name="bars"/>
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
