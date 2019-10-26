<template>
  <div style="padding-top:13%">
    <!--Top Nav Bar-->
    <van-nav-bar :title="title" left-text="Back" left-arrow @click-left="back()" right-text="Add" @click-right="addRewardsCat" fixed/>

    <!-- Rewards Categories List -->
    <van-cell-group>
      <van-cell v-for="(cat,key) in getRewardsCat" :border="true" :title="cat.rewardsCatName">
        <template slot="default" v-if="cat.rewardscatid!=3">
          <van-button size="small" type="primary" @click="editRewardsCat(key)" icon="edit">Edit</van-button>
          <van-button size="small" type="danger" @click="deleteRewardsCat(key)" icon="delete">Delete</van-button>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- Add Rewards Categories Pop -->
    <van-popup v-model="addRewardsCatPop" closeable position="bottom" :style="{ height: '20%' }">
        <van-field v-model="cat.rewardsCatName" required label="Name: " :error-message="errorMessage"/>

        <van-button type="default" @click="addRewardsCatPop=false,cat={}">Cancel</van-button>
        <van-button type="primary" @click="saveRewardsCat">Save</van-button>
    </van-popup>

  </div>
</template>

<script>

  export default{
    data(){
      return{
        title:'Rewards Categories',

        //Variable Initialize
        expCat:[],
        cat:{},

        //Popup Initialize
        isEdit:false,
        tempKey:'',
        addRewardsCatPop:false,

        //Error Msg Initialize
        errorMessage:'',
      }
    },
    methods:{
      //Set Default
      setDefault(){
        this.errorMessage='';
        this.cat={};
        this.addRewardsCatPop=false;
        this.isEdit=false;
        this.tempKey=''; 
      },
      //Back to Settings
      back(){
        this.$emit("closeManageRewardsCat");
      },
      //Add Rewards Category Pop
      addRewardsCat(){
        this.setDefault();
        this.addRewardsCatPop=true;
        this.isEdit=false;
      },
      //Save Rewards Category
      saveRewardsCat(){
        let hasError = false;
        hasError = this.saveValidation(hasError);
        if(hasError)
          this.errorMessage = 'Please input a name';
        else{
          this.errorMessage = '';
          if(this.isEdit == true){
            this.rewardsCat[this.tempKey].rewardsCatName = this.cat.rewardsCatName; 
            this.$store.commit('setRewardsCat',this.rewardsCat);
            this.$store.dispatch('storeAllStateData');
          }else{
            this.$store.commit('addRewardsCat',this.cat); 
            this.$store.dispatch('storeAllStateData');
          }
          this.setDefault();
        }
      },
      //Edit Rewards Category 
      editRewardsCat(key){
        this.isEdit = true;
        this.addRewardsCatPop = true;
        this.cat.rewardscatid = this.rewardsCat[key].rewardscatid;
        this.cat.rewardsCatName = this.rewardsCat[key].rewardsCatName;
        this.tempKey = key;
      },
      //Delete Rewards Category 
      deleteRewardsCat(key){
        this.$dialog.confirm({
          message:'Are you sure to delete?'
        }).then(()=>{
          this.rewardsCat.splice(key,1);
          this.$store.commit('setRewardsCat',this.rewardsCat);
          this.$store.dispatch('storeAllStateData'); 
        }).catch(()=>{
          this.$dialog.close();
        })
      },
      //Save Validation
      saveValidation(value){
        let validstate = value;
        if(this.cat.rewardsCatName==null||this.cat.rewardsCatName=='')
          return validstate = true; 
      },
      
    },
    computed:{
      getRewardsCat(){
        return this.$store.state.rewardsCat; 
      }
    },
    mounted(){
      this.rewardsCat = this.getRewardsCat;
    }
  }
</script>
