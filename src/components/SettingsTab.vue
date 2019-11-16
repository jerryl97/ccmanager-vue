<template>
  <div id="settingmaindiv">
    <!--Top Navbar-->
    <van-nav-bar fixed>
      <template slot="title">
        <van-icon color="#333333" name="setting-o"/>&nbsp
        <strong>{{title}}</strong>
      </template>
    </van-nav-bar>

    <van-grid clickable column-num="3">
      <van-grid-item icon="credit-pay" text="Accounts" @click="accountsShow=true"/>
      <van-grid-item icon="bars" text="Transactions" @click="transactionsShow=true"/>
      <van-grid-item icon="point-gift-o" text="Promotions" @click="promotionsShow=true"/>
      <van-grid-item icon="notes-o" text="Budget" @click="budgetShow=true"/>
      <van-grid-item icon="points" text="Data"i @click="dataShow=true"/>
      <van-grid-item icon="comment-o" text="Notification" @click="notificationShow=true"/>
      <van-grid-item icon="warn-o" text="Security" @click="securityShow=true"/>
      <van-grid-item icon="newspaper-o" text="Guide"  @click="showGuide()"/>
      <van-grid-item icon="records" text="Feedback" @click="showFeedback()"/>
      <van-grid-item icon="phone-o" text="Contact Us" @click="contactUs()"/>
    </van-grid>

    <van-action-sheet v-model="accountsShow" :actions="accountsActions" description="Accounts" @select="onAccountsSelect"/>

    <van-action-sheet v-model="transactionsShow" :actions="transactionsActions" description="Transactions" @select="onTransactionsSelect"/>

    <van-action-sheet v-model="promotionsShow" :actions="promotionsActions" description="Promotions" @select="onPromotionsSelect"/>

    <van-action-sheet v-model="budgetShow" description="Budget">
      <van-switch-cell v-model="getBudgetStat" :title="getBudgetStatTitle(getBudgetStat)" @change="budgetTrigger"/>
        <van-cell clickable :title="'Monthly Budget: $ '+getBudgetAmount" @click="setBudgetPop=true"/>
    </van-action-sheet>

    <input type="file" ref="importinput" style="display:none" accept="text/plain" @change="readBackupFile($event)"/>
    <van-action-sheet v-model="dataShow" :actions="dataActions" description="Data" @select="onDataSelect"/>

    <van-action-sheet v-model="notificationShow" description="Notification">
      <van-switch-cell v-model="getNotifyStats" :title="getNotifyStatsTitle(getNotifyStats)" @change="notifyTrigger"/>
    </van-action-sheet>

    <van-action-sheet v-model="securityShow" description="Security">
      <van-switch-cell v-model="getPinStat" :title="getPinStatTitle(getPinStat)" @change="pinTrigger"/>
      <van-cell title="Change Pincode" @click="changePinTrigger" is-link/>
    </van-action-sheet>


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

    <!--Budget Pop-->
    <van-popup v-model="setBudgetPop" position="top">
       <van-field :value="budgetValue" readonly clickable @touchstart.native.stop="showNumbKeyboard=true" label="Amount: "/>
       <van-button type="default" @click="setBudgetPop=false">Cancel</van-button>
       <van-button type="primary" @click="saveBudgetAmount">Save</van-button>
       <van-number-keyboard v-model="budgetValue" :show="showNumbKeyboard" extra-key="." close-button-text="Close" @blur="showNumbKeyboard = false"/>
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
        showManageExpCat:false,
        showManageIncCat:false,
        showManageRewards:false,
        showRecurringTrans:false,
        notifytitle:'Enabled',
        showSetPin:false,
        fromSetting:true,
        showPinInput:false,
        showChangePin:false,

        //Accounts
        accountsShow:false,
        accountsActions:[
          {name:'Manage Accounts Groups'}
        ],
        showManageAccGroups:false,

        //Transactions
        transactionsShow:false,
        transactionsActions:[
          {name:'Manage Expense Categories'},
          {name:'Manage Income Categories'},
          {name:'Manage Recurring Transactions'},
        ],

        //Promotions
        promotionsShow:false,
        promotionsActions:[
          {name:'Manage Rewards Categories'},
        ],
        
        //Budget
        budgetValue:'',
        budgetShow:false,
        setBudgetPop:false,
        showNumbKeyboard:false,

        //Data
        dataShow:false,
        dataActions:[
          {name:'Backup Data'},
          {name:'Local Backup Manager'},
          {name:'Import Data From Google Drive'},
          {name:'Send Backup To Email'},
          {name:'Reset to Default'},
        ],

        //Notification
        notificationShow:false,

        //Security
        securityShow:false,

        //Backup list and popup init
        showBackup:false,
        backupList:[]
      }
    },
    methods:{
      showGuide(){
        var ref = cordova.InAppBrowser.open('https://github.com/jerryl97/ccmanager-vue/wiki/User-Manual','_system','location=yes');
      },
      showFeedback(){
        var ref = cordova.InAppBrowser.open('https://forms.gle/TBRfbhW6KRT9m9R78','_system','location=yes');
      },
      onAccountsSelect(item,index){
        this.accountsShow = false;
        switch(index){
          case 0:
            this.showManageAccGroups = true;
            break;
        }
      },
      //Close Manage Account Groups
      closeManageAccGroups(){
        this.showManageAccGroups = false;
      },
      onTransactionsSelect(item,index){
        this.transactionsShow = false;
        switch(index){
          case 0:
            this.showManageExpCat = true;
            break;
          case 1:
            this.showManageIncCat = true;
            break;
          case 2:
            this.showRecurringTrans = true;
            break;
        }
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
      onPromotionsSelect(item,index){
        this.promotionsShow = false;
        switch(index){
          case 0:
            this.showManageRewards = true;
            break;
        }
      },
      //Close Manage Rewards Categories
      closeManageRewardsCat(){
        this.showManageRewards=false;
      },
      onDataSelect(item,index){
        this.dataShow = false;
        switch(index){
          case 0:
            this.backupAllData();
            break;
          case 1:
            this.getBackupList();
            break;
          case 2:
            this.$refs.importinput.click();
            break;
          case 3:
            this.emailComposer();
            break;
          case 4:
            this.resetAllData();
            break;
        }
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
          cordova.plugins.notification.local.cancelAll(function() {}, this);
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
      //Budget title
      getBudgetStatTitle(stats){
        if(stats){
          return 'Enabled';
        }else{
          return 'Disabled';
        }
      },
      saveBudgetAmount(){
        let result = 0;
        if(this.budgetValue == '')
          result = 0;
        else
          result = parseFloat(this.budgetValue);
        this.$store.commit('setBudgetAmount',result);
        this.$store.dispatch('storeAllStateData');
        this.setBudgetPop = false;
      },
      //Budget trigger
      budgetTrigger(checked){
        if(checked){
          this.$store.commit('setBudgetState',true);
          this.$notify({message:'Budget Enabled',type:'primary',duration:3000});
        }else{
          this.$store.commit('setBudgetState',false);
          this.$notify({message:'Budget Disabled',type:'primary',duration:3000});
        }
        this.$store.dispatch("storeAllStateData");
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
      },
      contactUs(){
        cordova.plugins.email.open({
          to:      'benevolenceapp@gmail.com',
          cc:      '',
          bcc:     '',
          subject: 'Contact Us from Credit Card Smart Manager App',
          body:    ''
        });
      },
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
      },
      getBudgetStat(){
        return this.$store.state.budgetStat;
      },
      getBudgetAmount(){
        return this.$store.state.budgetAmount;
      }
    },
    mounted(){
      this.budgetValue = this.getBudgetAmount.toString();
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
  padding-top:13%;
  height:100%;
  position:absolute;
}
</style>
