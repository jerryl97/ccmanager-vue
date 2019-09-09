<template>
  <div>
    <!--Top Nav Bar-->
    <van-nav-bar :title="title" left-text="Back" left-arrow @click-left="back()" right-text="Add" @click-right="addAccGroup"/>

    <!-- Account Groups List-->
      <van-cell-group>
        <van-cell v-for="(group,key) in getAccGrps" :border="true" :title="group.groupName">
          <template slot="default" v-if="group.grpid!=1&&group.grpid!=2&&group.grpid!=3&&group.grpid!=4">
            <van-button size="small" type="primary" plain @click="editAccGroup(key)">Edit</van-button>
            <van-button size="small" type="danger" @click="deleteAccGroup(key)">Delete</van-button>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- Account Group Creating and Editing Popup -->
      <van-popup v-model="addGroupPop" closeable position="bottom" :style="{ height: '20%' }">
        <van-field v-model="accGrpItem.groupName" required label="Name: " :error-message="errorMessage"/>

        <van-button type="default" @click="addGroupPop=false,accGrpItem={}">Cancel</van-button>
        <van-button type="primary" @click="saveAccGroup">Save</van-button>
      </van-popup>

  </div>
</template>

<script>

  export default{
    data(){
      return{
        title:'Account Groups',

        //Variable Initialize
        accGrpItem:{},
        accGroups:this.getAccGroups,
        tempKey:'',

        //Popup Initialize
        addGroupPop:false,
        isEdit:false,

        //Error Msg Initialize
        errorMessage:'',

      }
    },
    methods:{
      setDefault(){
        this.errorMessage='';
        this.accGrpItem={};
        this.addGroupPop=false;
        this.isEdit=false;
        this.tempKey='';
      },
      //Back to Settings
      back(){
        this.$emit('closeManageAccGroups'); 
      },
      //Add Account Group Pop
      addAccGroup(){
        this.addGroupPop=true;
        this.isEdit = false;
      },
      //Save Account Group
      saveAccGroup(){
        let hasError = false;
        hasError = this.saveValidation(hasError);
        if(hasError == true)
          this.errorMessage = 'Please input a name';
        else{
          this.errorMessage = '';
          if(this.isEdit == true){
            this.accGroups[this.tempKey].groupName = this.accGrpItem.groupName; 
            this.$store.commit('setAccGroup',this.accGroups);
            this.$store.dispatch('storeAccGroups');
          }else{
            this.$store.commit('addAccGroup',this.accGrpItem); 
            this.$store.dispatch('storeAccGroups');
          }
          this.setDefault();
        }
      },
      //Edit Account Group
      editAccGroup(key){
        this.isEdit = true;
        this.addGroupPop = true;
        this.accGrpItem.grpid = this.accGroups[key].grpid;
        this.accGrpItem.groupName = this.accGroups[key].groupName;
        this.tempKey = key;
      },
      //Delete Account Group
      deleteAccGroup(key){
        this.accGroups.splice(key,1);
        this.$store.commit('setAccGroup',this.accGroups);
        this.$store.dispatch('storeAccGroups');
      },
      //Add Account Group Validation
      saveValidation(value){
        let validstate = value;
        if(this.accGrpItem.groupName==null||this.accGrpItem.groupName=='')
          return validstate = true; 
      },
    }, 
    computed:{
      getAccGrps(){
        return this.$store.state.accGroups;
      }
    },
    mounted(){
      this.accGroups = this.getAccGrps;
    }
  }
</script>
