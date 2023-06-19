const mongoose=require("mongoose");

const adminSchema=new mongoose.Schema({
    emailId:String,
    username:String,
    password:String,
    firstname:String,
    lastname:String,
    dob:{
        type:Date,
        default:Date.now()
    }
});

const Admin = mongoose.model("admin",adminSchema);
module.exports=Admin;