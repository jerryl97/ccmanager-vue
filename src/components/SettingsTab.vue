<template>
  <div id="settingmaindiv">
    <!--Top Navbar-->
    <van-nav-bar fixed>
      <template slot="title">
        <van-icon color="#333333" name="setting-o"/>&nbsp
        <strong>{{title}}</strong>
      </template>
    </van-nav-bar>

    <!--Accounts Section-->
    <van-cell-group>
      <template slot="title">
        <van-icon name="credit-pay"/>&nbsp
        <span>Accounts</span>
      </template>
      <!--Managing Account Groups-->
      <van-cell title="Manage Account Groups" @click="showManageAccGroups=true" is-link/>
    </van-cell-group>

    <!--Tranactions Section-->
    <van-cell-group>
      <template slot="title">
        <van-icon name="bars"/>&nbsp
        <span>Transactions</span>
      </template>
      <!--Managing Expense Categories-->
      <van-cell title="Manage Expense Categories" @click="showManageExpCat=true" is-link/>
      <!--Managing Income Categories-->
      <van-cell title="Manage Income Categories" @click="showManageIncCat=true" is-link/>
      <!--Managing Recurring Transactions-->
      <van-cell title="Manage Recurring Transactions" @click="showRecurringTrans=true" is-link/>
    </van-cell-group>

    <!--Promotions Section-->
    <van-cell-group>
      <template slot="title">
        <van-icon name="point-gift-o"/>&nbsp
        <span>Promotions</span>
      </template>
      <!--Managing Rewards Categories-->
      <van-cell title="Manage Rewards Categories" @click="showManageRewards=true" is-link/>
    </van-cell-group>

    <!--Data Section-->
    <van-cell-group>
      <template slot="title">
        <van-icon name="points"/>&nbsp
        <span>Data</span>
      </template>
      <!--Backup Data-->
      <van-cell title="Backup Data" @click="backupAllData()" is-link/>
      <!--Local Backup Manager-->
      <van-cell title="Local Backup Manager" @click="getBackupList" is-link/>
      <!--Import Data From File-->
      <input type="file" ref="importinput" style="display:none" accept="text/plain" @change="readBackupFile($event)"/>
      <van-cell title="Import Data From Google Drive" @click="$refs.importinput.click()" is-link/>
      <!--Send Backup to Email using Composer Plugin-->
      <van-cell title="Send Backup To Email" @click="emailComposer" is-link/>
      <!--Reset to Default-->
      <van-cell title="Reset To Default" @click="resetAllData()" is-link/>
    </van-cell-group>

    <!--Notification Section-->
    <van-cell-group>
      <template slot="title">
        <van-icon name="comment-o"/>&nbsp
        <span>Notification</span>
      </template>
      <van-switch-cell v-model="getNotifyStats" :title="getNotifyStatsTitle(getNotifyStats)" @change="notifyTrigger"/>
    </van-cell-group>

    <!--Security Section-->
    <van-cell-group>
      <template slot="title">
        <van-icon name="warn-o"/>&nbsp
        <span>Security</span>
      </template>
      <van-switch-cell v-model="getPinStat" :title="getPinStatTitle(getPinStat)" @change="pinTrigger"/>
      <van-cell title="Change Pincode" @click="changePinTrigger" is-link/>
    </van-cell-group>

    <!--Feedback Form-->
    <van-cell-group>
      <template slot="title">
        <van-icon name="records"/>&nbsp
        <span>Feedback</span>
      </template>
      <!--Google Form Feedback Plugin link button-->
      <van-cell title="Feedback Form Link" is-link url="https://forms.gle/TBRfbhW6KRT9m9R78"/>
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
    <!--Manage Recurring Transactions Pop-->
    <van-popup v-model="showRecurringTrans" position="bottom" :style="{height:'100%'}">
       <v-recurringtrans @closeRecurringTrans="closeRecurringTrans"></v-recurringtrans>
    </van-popup>
    <!-- Manage Rewards Category Pop-->
    <van-popup v-model="showManageRewards" position="bottom" :style="{height:'100%'}">
       <v-rewardscat @closeManageRewardsCat="closeManageRewardsCat"></v-rewardscat>
    </van-popup>

    <!-- Backup Manager Popup -->
    <van-popup v-model="showBackup" position="bottom" :style="{ height: '100%' }">
      <van-nav-bar title="Backup Manager" left-text="Back" @click-left="showBackup = false"/>
      <van-cell-group title="Choose a Backup to import:">
        <div v-if="backupList.length==0" style="background-color:white;text-align:center;margin-top:10%">
          <i style="color:#bbbbbb">No local backup found.</i>
        </div>
        <van-cell v-for="backup in backupList" :title="backup" :border="true">
          <template slot="default">
            <van-button size="small" type="primary" @click="importThisLocalBackup(backup)">Import</van-button>
            <van-button size="small" type="danger" @click="deleteBackupFile(backup)">Delete</van-button>
          </template>
        </van-cell>
      </van-cell-group>
    </van-popup>

    <van-popup v-model="showSetPin" position="bottom" :style="{height:'100%'}">
      <v-newpin @closeNewPin="closeNewPin" :fromSetting="fromSetting"/>
    </van-popup>
    <van-popup v-model="showPinInput" position="bottom" :style="{height:'100%'}">
      <v-pininput @closePinInput="closePinInput" :fromSetting="fromSetting"/>
    </van-popup>
    <van-popup v-model="showChangePin" position="bottom" :style="{height:'100%'}">
      <v-changepin @closeChangePin="closeChangePin"/>
    </van-popup>

  </div>
</template>

<script>

  //Import Components
  import AccGroups from './AccGroups.vue'
  import ExpCategory from './ExpCategory.vue'
  import IncCategory from './IncCategory.vue'
  import RewardsCategory from './RewardsCategory.vue'
  import RecurringTrans from './RecurringTrans.vue'
  import NewPin from './NewPin.vue'
  import PinInput from './PinInput.vue'
  import ChangePin from './ChangePin.vue'

    //Import crypto-js
  import CryptoJS from 'crypto-js';

  export default{
    data(){
      return{
        title:'Settings',
        showManageAccGroups:false,
        showManageExpCat:false,
        showManageIncCat:false,
        showManageRewards:false,
        showRecurringTrans:false,
        notifytitle:'Enabled',
        showSetPin:false,
        fromSetting:true,
        showPinInput:false,
        showChangePin:false,

        //Backup list and popup init
        showBackup:false,
        backupList:[]
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
      //Close Recurring Transactions
      closeRecurringTrans(){
        this.showRecurringTrans=false;
      },
      //Close Manage Rewards Categories
      closeManageRewardsCat(){
        this.showManageRewards=false;
      },
      //Close set New Pin
      closeNewPin(){
        this.showSetPin = false;
        if(this.getPinCode.length==0){
          this.getPinStat = false;
        }
      },
      closePinInput(){
        this.showPinInput = false;
      },
      closeChangePin(){
        this.showChangePin = false;
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

              //Encrypt Backup Data START
              // Encrypt
              let ciphertext = CryptoJS.AES.encrypt(backupdata, 'ccmamangerapplicationsecretkey').toString();
              console.log(ciphertext);

              // Decrypt
              let bytes  = CryptoJS.AES.decrypt(ciphertext, 'ccmamangerapplicationsecretkey');
              let originalText = bytes.toString(CryptoJS.enc.Utf8);
              console.log(originalText); // 'my message'
              //Encrypt Backup Data END

              var blob = new Blob([ciphertext],{type:'text/plain'});
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
          //Decrypt Backup from Drive START
          let bytes  = CryptoJS.AES.decrypt(result, 'ccmamangerapplicationsecretkey');
          let originalData = bytes.toString(CryptoJS.enc.Utf8);
          //console.log(originalText); // 'my message'
          //Decrypt END

          let importedData = JSON.parse(originalData);
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
      },
       //Email Composer Plugin
      emailComposer(){
        //Get email receipent email address
        let email = window.prompt("Please enter the Email address you wish to send your backup to:", "example@gmail.com");
        //Read all backup data entries
        let fileEntries = new Promise((resolve,reject) => {
          window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,(fileSystem) => {
            let reader = fileSystem.createReader();
            reader.readEntries((entries) => {
                resolve(entries);
              },(err) => {
                console.log(err);
              }
            );
          },(err) => {
            console.log(err);
          });
        }).then((entries) => {
          //Push nativeURL path into array
          let entriesArray = [];
          for(let i in entries){
            entriesArray.push(entries[i].nativeURL)
          }
          //Cordova Email Plugin
          //If no backup is found, alert error instead of continuing with email plugin
          if(entriesArray.length>0){
            cordova.plugins.email.open({
              to:      email,
              cc:      '',
              bcc:     '',
              subject: 'Backup Data from CCManager Application',
              body:    'Here are all your backups!',
              attachments: entriesArray
            });
          } else {
            alert('No Backup Found');
          }
        });
      },
      //Notification title
      getNotifyStatsTitle(stats){
        if(stats){
          return 'Enabled';
        }else{
          return 'Disabled';
        }
      },
      //Notification trigger
      notifyTrigger(checked){
        if(checked){
          this.$store.commit('setNotifyStats',true);
          this.$notify({message:'Notification Enabled',type:'primary',duration:3000});
        }else{
          this.$store.commit('setNotifyStats',false);
          this.$notify({message:'Notification Disabled',type:'primary',duration:3000});
        }
        this.$store.dispatch("storeAllStateData");
      },

       //Get Backup List
      getBackupList(){
        //Initialize backup list
        this.backupList = [];

         //Read backup entries saved in device external data directory
        let fileEntries = new Promise((resolve,reject) => {
          window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,(fileSystem) => {
            let reader = fileSystem.createReader();
            reader.readEntries((entries) => {
                resolve(entries);
              },(err) => {
                console.log(err);
              }
            );
          },(err) => {
            console.log(err);
          });
        }).then((entries) => {
          let entryObj = {
            name:'',
            nativeUrl:''
          }
          for(let i in entries){
            this.backupList.push(entries[i].name);
          }
          console.log(this.backupList);
        });

        this.showBackup = true;
      },
      //Local Backup Import Function
      importThisLocalBackup(backup){
        //Create direct path to selected backup file
        let pathToFile = cordova.file.externalDataDirectory + backup;
        
        //Confirm import backup dialog
        this.$dialog.confirm({
          message:'Import this backup? ' + backup
        }).then(()=>{
          //Find backup file and read using FileReader to read, then pass result into resolve
          let localBackupRead = new Promise((resolve,reject) => {
            window.resolveLocalFileSystemURL(pathToFile,(fileSystem) => {

              fileSystem.file((file) => {
                  var reader = new FileReader();

                  reader.onloadend = function (e) {
                    console.log('Read ended');
                    resolve(reader.result);
                  };

                  reader.readAsText(file);
              },() => {
                console.log("Error: Missing file")
              });

            },(err)=>{
              console.log(err);
            });
          });
          //get reader results from resolve, convert data into JavaScript readable data and commit backup to Vuex and database
          localBackupRead.then((result)=>{
            //Decrypt Local Backup START
            let bytes  = CryptoJS.AES.decrypt(result, 'ccmamangerapplicationsecretkey');
            let originalData = bytes.toString(CryptoJS.enc.Utf8);
            //Decrypt END

            let importedData = JSON.parse(originalData);
            console.log(importedData)
            this.$store.commit('setAllStateData',importedData);
            this.$store.dispatch('storeAllStateData');
            this.$notify({
              message:'Data Imported',
              type:'primary',
              duration:4000,
            });
            this.showBackup=false;
          }); 
        }).catch(()=>{
          this.$dialog.close();
        });
      },
      //Delete Backup Function
      deleteBackupFile(backup){
        this.$dialog.confirm({
          message:'Are you sure to delete this backup? ' + backup
        }).then(()=>{
          //Find backup file and remove it
          let deletePromise = new Promise((resolve,reject) => {
            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,(fileSystem) => {
              fileSystem.getFile(backup, {create: false}, (fileEntry) => {
                fileEntry.remove((file) => {
                    console.log(fileEntry);
                    resolve('Successfully removed backup item')
                }, (error) => {
                    alert("error occurred: " + error.code);
                }, () => {
                    alert("file does not exist");
                });
              });
            });
          });
          //After backup file is removed, refresh backup manager list
          deletePromise.then((message)=>{
            console.log(message);
            this.getBackupList();
          });
        }).catch(()=>{
          this.$dialog.close();
        });
      },
      //PIN Title
      getPinStatTitle(stats){
        if(stats){
          return 'Pin Enabled';
        }else{
          return 'Pin Disabled';

        }
      },
      pinTrigger(checked){
        if(checked){
          if(this.getPinCode.length!=0){
            this.$store.commit('setPinStat',true);
            this.$store.dispatch('storeAllStateData');
            this.$notify({message:'Pin Enabled',type:'primary',duration:3000});
          }else if(this.getPinCode.length==0){
            this.showSetPin = true;
          }
        }else{
          this.showPinInput = true;
        }
      },
      changePinTrigger(){
        if(this.getPinCode.length==0){
          this.showSetPin = true;
        }else{
          this.showChangePin = true;
        }
      }
    },
    computed:{
      getStateData(){
        return this.$store.state;
      },
      getNotifyStats(){
        return this.$store.state.notifyStats;
      },
      getPinStat(){
        return this.$store.state.PINStat;
      },
      getPinCode(){
        return this.$store.state.PINCode;
      }
    },
    components:{
      'v-accgroup':AccGroups,
      'v-expcat':ExpCategory,
      'v-inccat':IncCategory,
      'v-rewardscat':RewardsCategory,
      'v-recurringtrans':RecurringTrans,
      'v-newpin':NewPin,
      'v-pininput':PinInput,
      'v-changepin':ChangePin,
    }
  }

</script>
<style scoped>
#settingmaindiv{
  background-color:#f6f6f6;
  margin-bottom:20%;
  padding-top:13%;
}
</style>
