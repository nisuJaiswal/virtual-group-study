const mongoose=require("mongoose");

const groupDiscussionSchema=new mongoose.Schema({
    groupid:{
        type:String,
        required:true
    },
    discussion:Array
});

const GroupDiscussion = mongoose.model("groupDiscussion",groupDiscussionSchema);
module.exports=GroupDiscussion;