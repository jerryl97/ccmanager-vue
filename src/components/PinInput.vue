<template>
  <div style="height:100%;width:100%;position:absolute;background-color:#f3f3f9;"> 
    <van-nav-bar v-if="fromSetting == true" title="Enter Pincode" left-text="Back" left-arrow @click-left="back()"/>
    <div style="position:relative;top:30px">
      <p style="text-align:center">Enter your 4-digit Pincode</p>
      <!--Pin Password Input -->
      <van-password-input
        :value="value"
        :length="4"
        :gutter="15"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
        :error-info="pinErrorMSg"
      />
    </div>
    <!-- NumberKeyboard -->
    <van-number-keyboard
      :show="showKeyboard"
      @input="onInput"
      @delete="onDelete"
      @blur="showKeyboard = false"
    />

  </div>
</template>
<script>
import CryptoJS from 'crypto-js'
export default{
  data(){
    return{
      value:'',
      showKeyboard:true,
      pinErrorMSg:'',
      
    }
  },
  methods:{
    back(){
      this.$emit("closePinInput");

    },
    onInput(key){
      this.value = (this.value+key).slice(0,4);
    },
    onDelete(){
      this.value = this.value.slice(0,this.value.length-1);
    }
  },
  computed:{
    getPinCode(){
      return this.$store.state.PINCode;
    },
  },
  watch:{
    value(){
      if(this.value.length==4){
        let hashed = CryptoJS.SHA256(this.value);
        let hashedString = hashed.toString(CryptoJS.enc.Base64);
        if(hashedString == this.getPinCode){
          if(this.fromSetting == undefined){
            this.$router.push({path:'/main/addtrans'});
            this.value = '';
          }
          else if(this.fromSetting == true){
            this.$store.commit("setPinStat",false);
            this.$store.dispatch('storeAllStateData');
            this.$notify({message:'Pin Disabled',type:'primary',duration:3000}); 
            this.value = '';
            this.back();
          }
        }else{
          this.pinErrorMSg = 'Wrong Pincode!';
          this.value = '';
        }
      }
    }
  },
  props:['fromSetting']
}
</script>
