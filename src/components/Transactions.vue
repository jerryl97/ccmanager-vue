<template>
  <div>
    <!-- Add Transaction Float Action Button-->
    <vue-fab :hidden="hideFab" icon="icon-plus" size="normal" style="margin-bottom:20%" @clickMainBtn="addTransButton"/>

    <!-- Transaction List-->
    <van-panel title="Date" desc="Description">
      <div>Content</div>
    </van-panel>
    
  </div>
</template>
<script>
  export default{
    data(){
      return{
        hideFab:false,
      }
    },
    methods:{
      addTransButton(){
        this.$router.push("/addtrans");
      },
    },
    computed:{
      getTrans(){
        return this.$store.allTrans;
      }
    },
    mounted(){
    }
  }
</script>
