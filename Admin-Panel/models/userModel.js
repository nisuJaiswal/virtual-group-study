const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    usermail:{
        type:String,
        required:true
    },
    recoverymail:{
        type:String,
        required:true
    },
    education:{
        type:String,
        default:"Not Selected!"
    },
    intrestedfields:Array,
    profilepic:{
        type:String,
        default:"Not Uploaded."  
    },
    profilepic_gid:{
        type:String,
        default:"Not Uploaded"
    },
    studybuddyid:Array,
    privacy:{
        type:String,
        default:"public"
    },
    signupdate:{
        type:Date,
        default:Date.now()
    },
    request:Array
});

const User = mongoose.model("user",userSchema);
module.exports=User;