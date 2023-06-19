const mongoose=require("mongoose");

const chatSchema=new mongoose.Schema({
    user_1:String,
    user_2:String,
    chat:Array
});

const Chat = mongoose.model("chat",chatSchema);
module.exports=Chat;