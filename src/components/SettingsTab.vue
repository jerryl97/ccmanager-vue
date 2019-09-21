<template>
  <div id="settingmaindiv">
    <!--Top Navbar-->
    <van-nav-bar :title="title"/>

    <!--Accounts Section-->
    <van-cell-group title="Accounts">
      <!--Managing Account Groups-->
      <van-cell title="Manage Account Groups" @click="showManageAccGroups=true" is-link/>
    </van-cell-group>

    <!--Tranactions Section-->
    <van-cell-group title="Transactions">
      <!--Managing Expense Categories-->
      <van-cell title="Manage Expense Categories" @click="showManageExpCat=true" is-link/>
      <!--Managing Income Categories-->
      <van-cell title="Manage Income Categories" @click="showManageIncCat=true" is-link/>
    </van-cell-group>

    <!--Promotions Section-->
    <van-cell-group title="Promotions">
      <!--Managing Rewards Categories-->
      <van-cell title="Manage Rewards Categories" @click="showManageRewards=true" is-link/>
    </van-cell-group>

    <!--Data Section-->
    <van-cell-group title="Data">
      <!--Backup Data-->
      <van-cell title="Backup Data" @click="backupAllData()" is-link/>
      <!--Import Data From File-->
      <input type="file" ref="importinput" style="display:none" accept="text/plain" @change="readBackupFile($event)"/>
      <van-cell title="Import Data From File" @click="$refs.importinput.click()" is-link/>
      <!--Reset to Default-->
      <van-cell title="Reset To Default" @click="resetAllData()" is-link/>
    </van-cell-group>


    <!-- Setting Pop Ups-->
    <!-- Manage Account Groups Pop-->
    <van-popup v-model="showManageAccGroups" position="bottom" :style="{height:'100%'}">
       <v-accgroup @closeManageAccGroups="closeManageAccGroups"></v-accgroup>
    </van-popup>
    <!-- Manage Expense Category Pop-->
    <van-popup v-model="showManageExpCat" position="bottom" :style="{height:'100%'}">
       <v-expcat @closeManageExpCat="closeManageExpCat"></v-expcat>
    </van-popup>
    <!-- Manage Income Category Pop-->
    <van-popup v-model="showManageIncCat" position="bottom" :style="{height:'100%'}">
       <v-inccat @closeManageIncCat="closeManageIncCat"></v-inccat>
    </van-popup>
    <!-- Manage Rewards Category Pop-->
    <van-popup v-model="showManageRewards" position="bottom" :style="{height:'100%'}">
       <v-rewardscat @closeManageRewardsCat="closeManageRewardsCat"></v-rewardscat>
    </van-popup>

  </div>
</template>

<script>

  //Import Components
  import AccGroups from './AccGroups.vue'
  import ExpCategory from './ExpCategory.vue'
  import IncCategory from './IncCategory.vue'
  import RewardsCategory from './RewardsCategory.vue'

  export default{
    data(){
      return{
        title:'Settings',
        showManageAccGroups:false,
        showManageExpCat:false,
        showManageIncCat:false,
        showManageRewards:false,


      }
    },
    methods:{
      //Close Manage Account Groups
      closeManageAccGroups(){
        this.showManageAccGroups = false;
      },
      //Close Manage Expense Categories
      closeManageExpCat(){
        this.showManageExpCat=false;
      },
      //Close Manage Income Categories
      closeManageIncCat(){
        this.showManageIncCat=false;
      },
      //Close Manage Rewards Categories
      closeManageRewardsCat(){
        this.showManageRewards=false;
      },
      //Backup All Data
      backupAllData(){
        this.$dialog.confirm({
          message:'Backup all the data?'
        }).then(()=>{
          this.createBackupFile();
        }).catch(()=>{
          this.$dialog.close();
        });
      },
      //Create Backup File
      createBackupFile(){
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,(fs)=>{
          let tempdate = this.$moment(new Date()).format('YYYY-MM-DD');
          fs.getFile(tempdate+'.txt',{create:true,exclusive:false},(fileEntry)=>{
            fileEntry.createWriter(fileWriter=>{
              fileWriter.onwriteend = (e)=>{
                alert('Backup Completed. Path: /Android/data/com.vue.expensemanager.app/files/'); 
              };
              fileWriter.onerror = (e)=>{
                alert('Backup Failed '+e.toString()); 
              };
              let backupdata = JSON.stringify(this.getStateData);
              console.log(backupdata);
              var blob = new Blob([backupdata],{type:'text/plain'});
              fileWriter.write(blob);
            });
          });
        });
      },
      //Read and Import Backup Data
      readBackupFile(e){
        var readingpromise = new Promise((resolve,reject)=>{
          var input = e.target;
          var reader = new FileReader();
          reader.onload = ()=>{
            resolve(reader.result);
          };
          reader.readAsText(input.files[0]); 
        });
        readingpromise.then((result)=>{
          let importedData = JSON.parse(result);
          this.$store.commit('setAllStateData',importedData);
          this.$store.dispatch('storeAllStateData');
          this.$notify({
            message:'Data Imported',
            type:'primary',
            duration:4000,
          });
        }); 
      },
      //Reset the data to default
      resetAllData(){
        this.$dialog.confirm({
          message:'Are you sure to reset?'
        }).then(()=>{
          this.$store.commit('setStateToDefault');
          this.$store.dispatch('storeAllStateData');
          this.$notify({
            message:'Reset Completed.',
            type:'primary',
            duration:4000,
          });
        }).catch(()=>{
          this.$dialog.close();
        });
      
      }
    },
    computed:{
      getStateData(){
        return this.$store.state;
      }
    },
    components:{
      'v-accgroup':AccGroups,
      'v-expcat':ExpCategory,
      'v-inccat':IncCategory,
      'v-rewardscat':RewardsCategory,
    }
  }

</script>
<style scoped>
#settingmaindiv{
  background-color:#f6f6f6
}
</style>
