<template>
  <div>
    <van-nav-bar left-text="Back" @click-left="back" left-arrow title="Contact Us" fixed/>
      <div style="padding-top:13%">
      <van-divider :style="{color:'#1989fa',borderColor:'#1989fa',padding:'0 16px'}">
        Hi! How can we help you?
      </van-divider>
      </div>
    <van-cell-group v-if="username==''||roomid==''" style="" title="Enter your name:">
       <van-field v-model="username" placeholder="Your Name" :error-message="usernameErr"/>
       <div style="padding:10px">
         <van-button type="primary" size="large" @click="nameSubmit">Submit</van-button>
       </div>
    </van-cell-group>
    <div v-if="username!=''&&roomid!=''">
      <div style="padding-bottom:40%">
        <div v-for="chat in chats" :key="chat.key" >
        <van-notice-bar wrapable  v-if="chat.user === username" :scrollable="false">
          {{chat.user}}: </br>
          {{chat.message}}
        </van-notice-bar>
        <van-notice-bar wrapable v-if="chat.user !== username" color="#1989fa" :scrollable="false">
          {{chat.user}}: </br>
          {{chat.message}}
        </van-notice-bar>
        </div>
      </div>
       <div style="position:fixed;width:100%;bottom:0px">
       <van-field v-model="data.message" placeholder="Enter your message"/>
       <div style="padding:10px">
         <van-button type="primary" size="large" @click="msgSubmit">Send</van-button>
       </div>
       </div>
    </div>
    
  </div>
</template>
<script>
  import firebase from '../Firebase.js'
  export default{
    data(){
      return{
        username:'',
        roomid:'',
        usernameErr:'',
        ref:firebase.database().ref('enquiries/'),
        data:{type:'',name:'',message:''},
        chats:[],
        errors:[],
      }
    },
    methods:{
      back(){
        this.$emit("closeContactUs");
      },
      nameSubmit(){
        if(this.username!=''){
          let newData = this.ref.push();
          newData.set({
            roomUser:this.username
          })
          this.roomid = newData.key;
          this.$store.commit("setContactName",this.username);
          this.$store.commit("setContactRoom",this.roomid);
          this.$store.dispatch("storeAllStateData");
        }else{
          usernameErr = "Please enter your name";
        }
      },
      msgSubmit(){
        let newData = firebase.database().ref('enquiries/'+this.roomid+'/chats').push();
        newData.set({
          type:'newmsg',
          user:this.username,
          message:this.data.message,
          sendDate: Date()
        });
        this.data.message = '';
        this.$forceUpdate();
      }
    },
    computed:{
      getContactName(){
        return this.$store.state.contactName;
      },
      getContactRoom(){
        return this.$store.state.contactRoom;
      }
    },
    mounted(){
      this.username = this.getContactName;
      this.roomid = this.getContactRoom; 
      firebase.database().ref('enquiries/'+this.roomid+'/chats').on('value',(snapshot)=>{
        this.chats = [];
        snapshot.forEach((doc)=>{
          let item = doc.val()
          item.key = doc.key;
          this.chats.push(item);
        })
      })
    },
  }
</script>
