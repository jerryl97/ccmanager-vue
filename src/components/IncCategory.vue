<template>
  <div style="padding-top:13%">
    <!--Top Nav Bar-->
    <van-nav-bar :title="title" left-text="Back" left-arrow @click-left="back()" @click-right="addIncCat" fixed>
      <template slot="right">
        <van-icon name="plus" size="15px"/>
        <span style="color:#1989fa;font-size:15px">Add</span>
      </template>
    </van-nav-bar>

    <!-- Income Categories List -->
    <van-cell-group>
      <van-cell v-for="(cat,key) in getIncCat" :border="true" :title="cat.incCatName">
        <template slot="default" v-if="cat.inccatid!=3">
          <van-button size="small" type="primary" @click="editIncCat(key)" icon="edit">Edit</van-button>
          <van-button size="small" type="danger" @click="deleteIncCat(key)" icon="delete">Delete</van-button>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- Add Income Categories Pop -->
    <van-popup v-model="addIncCatPop" closeable position="bottom" :style="{ height: '20%' }">
        <van-field v-model="cat.incCatName" required label="Name: " :error-message="errorMessage"/>

        <van-button type="default" @click="addIncCatPop=false,cat={}">Cancel</van-button>
        <van-button type="primary" @click="saveIncCat">Save</van-button>
    </van-popup>

  </div>
</template>

<script>

  export default{
    data(){
      return{
        title:'Income Categories',

        //Variable Initialize
        incCat:[],
        cat:{},

        //Popup Initialize
        isEdit:false,
        tempKey:'',
        addIncCatPop:false,

        //Error Msg Initialize
        errorMessage:'',
      }
    },
    methods:{
      //Set Default
      setDefault(){
        this.errorMessage='';
        this.cat={};
        this.addIncCatPop=false;
        this.isEdit=false;
        this.tempKey=''; 
      },
      //Back to Settings
      back(){
        this.$emit("closeManageIncCat");
      },
      //Add Income Category Pop
      addIncCat(){
        this.setDefault();
        this.addIncCatPop=true;
        this.isEdit=false;
      },
      //Save Income Category
      saveIncCat(){
        let hasError = false;
        hasError = this.saveValidation(hasError);
        if(hasError)
          this.errorMessage = 'Please input a name';
        else{
          this.errorMessage = '';
          if(this.isEdit == true){
            this.incCat[this.tempKey].incCatName = this.cat.incCatName; 
            this.$store.commit('setIncCat',this.incCat);
            this.$store.dispatch('storeAllStateData');
          }else{
            this.$store.commit('addIncCat',this.cat); 
            this.$store.dispatch('storeAllStateData');
          }
          this.setDefault();
        }
      },
      //Edit Income Category 
      editIncCat(key){
        this.isEdit = true;
        this.addIncCatPop = true;
        this.cat.inccatid = this.incCat[key].inccatid;
        this.cat.incCatName = this.incCat[key].incCatName;
        this.tempKey = key;
      },
      //Delete Income Category 
      deleteIncCat(key){
        this.$dialog.confirm({
          message:'Are you sure to delete?'
        }).then(()=>{
          this.incCat.splice(key,1);
          this.$store.commit('setIncCat',this.incCat);
          this.$store.dispatch('storeAllStateData'); 
        }).catch(()=>{
          this.$dialog.close();
        });
      },
      //Save Validation
      saveValidation(value){
        let validstate = value;
        if(this.cat.incCatName==null||this.cat.incCatName=='')
          return validstate = true; 
      },
      
    },
    computed:{
      getIncCat(){
        return this.$store.state.incCat; 
      }
    },
    mounted(){
      this.incCat = this.getIncCat;
    }
  }
</script>
