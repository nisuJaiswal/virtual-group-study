const mongoose=require("mongoose");

const feedbackSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    category:{
        type:String,
        require:true
    },
    content:{
        type:String,
        require:true
    },
    rating:{
        type:Number,
        default:0
    }
});

const Feedback = mongoose.model("feedback",feedbackSchema);
module.exports=Feedback;