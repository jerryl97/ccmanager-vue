<template>
  <div style="position:absolute;height:100%;width:100%;background-color:#f3f3f9"> 
    <van-nav-bar title="Set a new Pincode" left-text="Back" left-arrow @click-left="back()"/>
    <p style="text-align:center">Enter New 4-digit Pincode</p>
    <!--Pin Password Input -->
    <van-password-input
      :value="value"
      :length="4"
      :gutter="15"
      :focused="showKeyboard"
      @focus="showKeyboard = true"
      :error-info="pinErrorMsg"
    />
    <div style="margin-top:50px;padding:0 10px">
      <van-button type="primary" size="large" @click="savePin()">Save</van-button>
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
      pinErrorMsg:'',
    }
  },
  methods:{
    back(){
      this.$emit("closeNewPin"); 
    },
    onInput(key){
      this.value = (this.value+key).slice(0,4);
    },
    onDelete(){
      this.value = this.value.slice(0,this.value.length-1);
    },
    savePin(){
      if(this.value.length!=4){
        this.pinErrorMsg = 'Please enter a 4-digit Pincode';
        this.value = '';
      }else if(this.value.length==4){
        let hashedCode = CryptoJS.SHA256(this.value);
        hashedCode = hashedCode.toString(CryptoJS.enc.Base64);
        this.$store.commit("setPinCode",hashedCode);
        this.$store.commit("setPinStat",true);
        this.$store.dispatch("storeAllStateData");
        this.value = '';
        this.back();
      }
    }
  },
  props:['fromSetting']
}
</script>
