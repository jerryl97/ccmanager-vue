<template>
  <div style="padding-top:13%;margin-bottom:25%">
    <!--Top Nav Bar-->
    <van-nav-bar :title="title" left-text="Back" left-arrow @click-left="back()" fixed/>

    <vue-fab :hidden="hideAddAccGrpFab" icon="icon-plus"  size="big" style="margin-bottom:10%" @clickMainBtn="addAccGroup"/>
    <!-- Account Groups List-->
      <van-cell-group>
        <van-cell v-for="(group,key) in getAccGrps" :border="true" :title="group.groupName">
          <template slot="default" v-if="group.grpid!=1&&group.grpid!=2&&group.grpid!=3&&group.grpid!=4">
            <van-button size="small" type="primary" @click="editAccGroup(key)" icon="edit">Edit</van-button>
            <van-button size="small" type="danger" @click="deleteAccGroup(key)" icon="delete">Delete</van-button>
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
        hideAddAccGrpFab:false,

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
            this.$store.dispatch('storeAllStateData');
          }else{
            this.$store.commit('addAccGroup',this.accGrpItem); 
            this.$store.dispatch('storeAllStateData');
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
        this.$dialog.confirm({
          message:'Are you sure to delete'
        }).then(()=>{
          this.accGroups.splice(key,1);
          this.$store.commit('setAccGroup',this.accGroups);
          this.$store.dispatch('storeAllStateData');  
        }).catch(()=>{
          this.$dialog.close();
        });
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
    watch:{
      addGroupPop(){
        if(this.addGroupPop == true){
          this.hideAddAccGrpFab = true;
        }else{
          this.hideAddAccGrpFab = false;
        }
      }
    },
    mounted(){
      this.accGroups = this.getAccGrps;
    }
  }
</script>
