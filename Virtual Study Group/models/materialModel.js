const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: Array,
    material: {
        type: String,
        required: true
    },
    material_gid: {
        type: String,
        required: true
    },
    like: {
        type: Number,
        default: 0
    },
    like_userid: Array,
    datetime: {
        type: Date,
        default: Date.now()
    },
    verify: {
        type: String,
        default: "pending"
    }
});

const Material = mongoose.model("material", materialSchema);
module.exports = Material;