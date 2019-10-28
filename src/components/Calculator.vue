<template>
<div class="container">
  <van-nav-bar title="Calculator" left-text="Back" left-arrow @click-left="back()"/>

  <div class="calculator">
      <div id="result">
    <span>{{ valueDisplayed }}</span>
  </div>
  <div id="pad">
    <div class="btn" id="clear" @click="clear">C</div>
    <div class="btn" @click="handleOp('/')">/</div>
    <div class="btn" @click="handleDigit(7)">7</div>
    <div class="btn" @click="handleDigit(8)">8</div>
    <div class="btn" @click="handleDigit(9)">9</div>
    <div class="btn" @click="handleOp('x')">x</div>
    <div class="btn" @click="handleDigit(4)">4</div>
    <div class="btn" @click="handleDigit(5)">5</div>
    <div class="btn" @click="handleDigit(6)">6</div>
    <div class="btn" @click="handleOp('-')">-</div>
    <div class="btn" @click="handleDigit(1)">1</div>
    <div class="btn" @click="handleDigit(2)">2</div>
    <div class="btn" @click="handleDigit(3)">3</div>
    <div class="btn" @click="handleOp('+')">+</div>
    <div id="dot" class="btn" @click="handleDot()">.</div>
    <div id="zero" class="btn" @click="handleDigit(0)">0</div>
    <div id="equal" class="btn" @click="handleOp('=')">=</div>
  </div>
  </div>

  <!-- Confirm Button-->
  <van-button type="info" size="large" style="width:90%;margin-left:5%;margin-right:5%" @click="confirm()">Confirm</van-button>
</div>
</template>

<script>
export default {
  data() {
    return {
      currentValue: '0',
      savedValue: false,
      currentOp: false
    }
  },
  methods: {
    clear () {
      this.currentValue = '0'
      this.savedValue = false
      this.currentOp = false
    },
    handleDigit (digit) {
      if (this.currentOp === '=') {
        this.savedValue = false
      }

      if (this.currentValue === '0') {
        this.currentValue = ''
        this.currentValue += digit
      } 
      else {
        this.currentValue += digit
      }
    },
    handleDot () {
      if(this.currentValue.indexOf(".") === -1){
        this.currentValue = this.currentValue.concat('.');
      }
    },
    handleOp (op){
      if (this.currentOp) {
         this.process()
      }
      else {
        this.savedValue = this.currentValue
      }
      this.currentValue = ''
      this.currentOp = op

      if(Number.isNaN(this.savedValue)){
        this.currentValue = '0'
        this.savedValue = '0';
      }      
    },
    process() {
      //parse to float before running any calculations
      this.currentValue = parseFloat(this.currentValue);
      this.savedValue = parseFloat(this.savedValue);

      if (this.currentOp === '+') {
        this.savedValue += this.currentValue
      }
      else if (this.currentOp === '-') {
        this.savedValue -= this.currentValue
      }
      else if (this.currentOp === 'x') {
        this.savedValue *= this.currentValue
      }
      else if (this.currentOp === '/') {
        this.savedValue /= this.currentValue
      }
      else if (this.currentOp === '=' && this.currentValue) {
        this.savedValue = this.currentValue
      }
      this.currentValue = ''
      this.currentOp = false

      //round of to 2 decimal place
      this.savedValue = Number(Math.round(this.savedValue+'e'+2)+'e-'+2)
    },
    back(){
      this.$emit('closeCalculator');
    },
    confirm(){
      if(this.savedValue==false){
        this.$emit('confirmCalculator', this.currentValue)
      } else {
        this.$emit('confirmCalculator', this.savedValue);
      }
    }
  },
  computed: {
     valueDisplayed () {
      return this.savedValue ? 
        this.currentValue ? 
        this.currentValue : this.savedValue
        : this.currentValue
    }
  }
}
</script>

<style scoped>
html{
  background: #CCC;
  font-family: sans-serif;
}
body{
  display: grid;
  justify-items: center;
  align-items: center;
  height: 100vh;
  }
#calculator{
  border: 2px solid #222;
  border-radius: 4px;
  max-width: 350px;
}
#result{
  font-size: 42px;
  width: 100%;
  height: 70px;
  box-sizing: border-box;
  display: grid;
  padding: 10px;
  justify-items: end;
  align-items: center;
  border-bottom: 2px solid #222;
}
#pad{
  display: grid;
  grid-template-columns: repeat(4, minmax(60px, 1fr));
  grid-gap: 10px;
  padding: 15px;
}
.btn{
  cursor: pointer;
  font-size: 20px;
  display: grid;
  padding: 15px 10px;
  justify-items: center;
  align-items: center;
  color: #FAFAFA;
  border: 1px solid #222;
  border-radius: 4px;
  background: #777;
}
#clear{
  background: steelblue;
  grid-column: 1/4;
}
#zero{
  grid-column: 2/4;
}
#equal{
  background: seagreen;
}


</style>
