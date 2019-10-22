<template>
  <div style="position:absolute;height:100%;width:100%;background-color:#f3f3f9">
    <van-nav-bar title="Change Pincode" left-text="Back" left-arrow @click-left="back()"/>
    <p style="text-align:center">Enter your 4-digit Pincode</p>

    <!--Pin Password Input -->
    <van-password-input
      :value="oldvalue"
      :length="4"
      :gutter="15"
      :focused="showOldKeyboard"
      @focus="showOldKeyboard = true,showNewKeyboard=false"
      :error-info="oldPinErrorMsg"
    />

    <p style="text-align:center">Enter New 4-digit Pincode</p>
    <van-password-input
      :value="newvalue"
      :length="4"
      :gutter="15"
      :focused="showNewKeyboard"
      @focus="showNewKeyboard = true,showOldKeyboard=false"
      :error-info="newPinErrorMsg"
    />
    <div style="margin-top:50px;padding:0 10px">
      <van-button type="primary" size="large" @click="savePin()">Save</van-button>
    </div>
    <!-- NumberKeyboard -->
    <van-number-keyboard
      :show="showOldKeyboard"
      @input="onOldInput"
      @delete="onOldDelete"
      @blur="showOldKeyboard = false"
    />
    <van-number-keyboard
      :show="showNewKeyboard"
      @input="onNewInput"
      @delete="onNewDelete"
      @blur="showNewKeyboard = false"
    />
  </div>
</template>
<script>
import CryptoJS from 'crypto-js'
export default{
  data(){
    return{
      oldvalue:'',
      showOldKeyboard:false,
      oldPinErrorMsg:'', 
      newvalue:'',
      showNewKeyboard:false,
      newPinErrorMsg:'', 
    }
  },
  methods:{
    back(){
      this.$emit("closeChangePin");

    },
    onOldInput(key){
      this.oldvalue = (this.oldvalue+key).slice(0,4);
    },
    onOldDelete(){
      this.oldvalue = this.oldvalue.slice(0,this.oldvalue.length-1);
    },
    onNewInput(key){
      this.newvalue = (this.newvalue+key).slice(0,4);
    },
    onNewDelete(){
      this.newvalue = this.newvalue.slice(0,this.newvalue.length-1);
    },
    savePin(){
      if(this.oldvalue.length==4 && this.newvalue.length==4){
      let oldHashed = CryptoJS.SHA256(this.oldvalue);
      let oldHashedString = oldHashed.toString(CryptoJS.enc.Base64);
      if(oldHashedString == this.getPinCode){
        let newHashed = CryptoJS.SHA256(this.newvalue);
        let newHashedString = newHashed.toString(CryptoJS.enc.Base64);
        this.$store.commit("setPinCode",newHashedString);
        this.$store.dispatch("storeAllStateData");
        this.$notify({message:'Pin Changed',type:'primary',duration:3000});
        this.oldvalue = '';
        this.newvalue = '';
        this.back();
      }else{
        this.oldPinErrorMsg = 'Wrong Pincode!';
        this.oldvalue = '';
        this.newvalue = '';
        }
      }else{
        this.oldPinErrorMsg = 'Please enter a 4-digit Pincode';
        this.newPinErrorMsg = 'Please enter a 4-digit Pincode';
      }
    }
  },
  computed:{
    getPinCode(){
      return this.$store.state.PINCode;
    },
  }
}
</script>
