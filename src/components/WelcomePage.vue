<template>
  <div style="width:100%;height:100%;position:absolute;">
  <van-swipe ref="welcomeSwipe" style="width:100%;height:100%;background-color:#3498DB" indicator-color="white">
    <van-swipe-item>
      <div style="top:50%;position:relative;text-align:center;">
        <h2 style="margin:0;color:white">Welcome!</h2>
      </div>
    </van-swipe-item>
    <van-swipe-item>
      <div style="top:50%;position:relative">
        <h2 style="margin:0;text-align:center;color:white">Set a pincode?</h2>
        <div style="margin-top:40px;padding:10px">
          <van-button :disabled="setPinDisabled" size="large" @click="setPinPop=true">Yes</van-button>
          <van-button size="large" color="#3498DB" @click="skipSwipe()">Skip</van-button>
        </div>
      </div>
      <van-popup v-model="setPinPop" position="bottom" :style="{height:'100%'}">
        <v-newpin @closeNewPin="closeNewPin"/>
      </van-popup>
    </van-swipe-item>
    <van-swipe-item>
      <div style="top:50%;position:relative;text-align:center;">
        <h2 style="margin:0;color:white">Hope you will enjoy!</h2>
        <div style="margin-top:40px;padding:10px">
          <van-button size="large" @click="startMain()">Let's Start</van-button>
        </div>
      </div>
    </van-swipe-item>
  </van-swipe>
  </div>
</template>
<script>
import NewPin from './NewPin.vue'
export default{
  data(){
    return{
      setPinPop:false,
      setPinDisabled:false,

    }
  },
  methods:{
    closeNewPin(){
      this.setPinPop = false;
      if(this.getPinStat){
        this.setPinDisabled = true;
        this.$refs.welcomeSwipe.swipeTo(2);
      }
    },
    skipSwipe(){
      this.$refs.welcomeSwipe.swipeTo(2);
    },
    startMain(){
      this.$store.commit('setFirstTime',false);
      this.$store.dispatch('storeAllStateData');
      this.$router.push({path:'/main/acctrans'});  
    }
  },
  computed:{
    getPinCode(){
      return this.$store.state.PINCode;
    },
    getPinStat(){
      return this.$store.state.PINStat;
    }
  },
  components:{
    'v-newpin':NewPin
  }
}
</script>
