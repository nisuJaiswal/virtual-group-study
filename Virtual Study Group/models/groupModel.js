const mongoose=require("mongoose");

const groupSchema = new mongoose.Schema({

    grouppic:{
        type:String,
        default:"Not Uploaded"
    },
    grouppic_gid:{
        type:String,
        default:"Not Uploaded"
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    materialid:Array,
    grpadmin:String,
    memberid:Array,
    privacy:{
        type:String,
        default:"public"
    },
    request:Array,
    datetime:{
        type:Date,
        default:Date.now()
    }
});

const Group = mongoose.model("group",groupSchema);
module.exports=Group;