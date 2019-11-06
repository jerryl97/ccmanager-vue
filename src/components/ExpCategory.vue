<template>
  <div style="padding-top:13%;margin-bottom:25%">
    <!--Top Nav Bar-->
    <van-nav-bar :title="title" left-text="Back" left-arrow @click-left="back()" @click-right="addExpCat" fixed>
    </van-nav-bar>

    <vue-fab :hidden="hideAddExpCatFab" icon="icon-plus"  size="big" style="margin-bottom:10%" @clickMainBtn="addExpCat"/>
    <!-- Expense Categories List -->
    <van-cell-group>
      <van-cell v-for="(cat,key) in getExpCat" :border="true" :title="cat.expCatName">
        <template slot="default" v-if="cat.expcatid!=3">
          <van-button size="small" type="primary" @click="editExpCat(key)" icon="edit">Edit</van-button>
          <van-button size="small" type="danger" @click="deleteExpCat(key)" icon="delete">Delete</van-button>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- Add Expense Categories Pop -->
    <van-popup v-model="addExpCatPop" closeable position="bottom" :style="{ height: '20%' }">
        <van-field v-model="cat.expCatName" required label="Name: " :error-message="errorMessage"/>

        <van-button type="default" @click="addExpCatPop=false,cat={}">Cancel</van-button>
        <van-button type="primary" @click="saveExpCat">Save</van-button>
    </van-popup>

  </div>
</template>

<script>

  export default{
    data(){
      return{
        title:'Expense Categories',

        //Variable Initialize
        expCat:[],
        cat:{},
        hideAddExpCatFab:false,

        //Popup Initialize
        isEdit:false,
        tempKey:'',
        addExpCatPop:false,

        //Error Msg Initialize
        errorMessage:'',
      }
    },
    methods:{
      //Set Default
      setDefault(){
        this.errorMessage='';
        this.cat={};
        this.addExpCatPop=false;
        this.isEdit=false;
        this.tempKey=''; 
      },
      //Back to Settings
      back(){
        this.$emit("closeManageExpCat");
      },
      //Add Expense Category Pop
      addExpCat(){
        this.setDefault();
        this.addExpCatPop=true;
        this.isEdit=false;
      },
      //Save Expense Category
      saveExpCat(){
        let hasError = false;
        hasError = this.saveValidation(hasError);
        if(hasError)
          this.errorMessage = 'Please input a name';
        else{
          this.errorMessage = '';
          if(this.isEdit == true){
            this.expCat[this.tempKey].expCatName = this.cat.expCatName; 
            this.$store.commit('setExpCat',this.expCat);
            this.$store.dispatch('storeAllStateData');
          }else{
            this.$store.commit('addExpCat',this.cat); 
            this.$store.dispatch('storeAllStateData');
          }
          this.setDefault();
        }
      },
      //Edit Expense Category 
      editExpCat(key){
        this.isEdit = true;
        this.addExpCatPop = true;
        this.cat.expcatid = this.expCat[key].expcatid;
        this.cat.expCatName = this.expCat[key].expCatName;
        this.tempKey = key;
      },
      //Delete Expense Category 
      deleteExpCat(key){
        this.$dialog.confirm({
          message:'Are you sure to delete'
        }).then(()=>{
          this.expCat.splice(key,1);
          this.$store.commit('setExpCat',this.expCat);
          this.$store.dispatch('storeAllStateData');
        }).catch(()=>{
          this.$dialog.close();
        });
      },
      //Save Validation
      saveValidation(value){
        let validstate = value;
        if(this.cat.expCatName==null||this.cat.expCatName=='')
          return validstate = true; 
      },
      
    },
    computed:{
      getExpCat(){
        return this.$store.state.expCat; 
      }
    },
    watch:{
      addExpCatPop(){
        if(this.addExpCatPop == true){
          this.hideAddExpCatFab = true;
        }else{
          this.hideAddExpCatFab = false;
        }
      }
    },
    mounted(){
      this.expCat = this.getExpCat;
    },
  }
</script>
