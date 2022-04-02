const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// var path = require("path");
require("dotenv").config();

const mongoose = require("mongoose");


//     -----Import Models-----
const User = require("./models/userModel");
const Material = require("./models/materialModel");
const Group = require("./models/groupModel");
const Feedback = require("./models/feedbackModel");
const GroupDiscussion = require("./models/groupDiscussionModel");
const Chat = require("./models/chatModel");

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongodbSession = require("connect-mongodb-session")(session);


app.use(cookieParser());

const sessData = new mongodbSession({
    uri: process.env.MONGO_URL,
    collection: "session"
});

app.use(session({
    secret: "Virtual Study Group",
    resave: false,
    saveUninitialized: false,
    store: sessData
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(require("./routes/userRoutes"));

io.on("connection", (socket) => {
    console.log("Connected");

    socket.on("disconnect", () => {
        console.log("Disconnected");
    })

    // For Group Discussion
    let grpId;
    let userIdSender;
    let userImageUrl;
    let senderFirstName;
    let senderLastname;

    socket.on("sendMsg", async (data) => {
        if (data.title != "" & data.desc != "") {
            const obj = {
                senderId:userIdSender,
                senderImage:userImageUrl,
                firstname:senderFirstName,
                lastname:senderLastname,
                title:data.title,
                description:data.desc,
                datetime:Date.now()
            }
            console.log(obj)
            await GroupDiscussion.updateOne({groupid:grpId},{$push:{discussion:obj}});
            io.sockets.in(grpId).emit("sendMsgToAll", { msg: data, userId: userIdSender ,userImage:userImageUrl,userFirstname:senderFirstName,userLastname:senderLastname});
        }
    })

    
    socket.on("joinedGroupChat", async (data) => {
        grpId = data.grpChatId;
        userIdSender = data.userSenderId;
        const senderInfo = await User.findOne({ _id: data.userSenderId }, "profilepic firstname lastname");
        userImageUrl=senderInfo.profilepic;
        senderFirstName=senderInfo.firstname;
        senderLastname=senderInfo.lastname;
        socket.join(data.grpChatId);
    })


    // For One To One Chat

    let senderUser;
    let receiverUser;

    socket.on("setSenderUser",(data)=>{
        senderUser=data.idOfSender;
        // console.log(senderUser);
    })

    socket.on("setReceiverUser",async (data)=>{
        receiverUser=data.receiverId;   
        // console.log(receiverUser);

        const chatContent = await Chat.findOne({$and:[ {$or: [{ user_1:senderUser}, { user_2: senderUser }]},{$or: [{ user_1: receiverUser }, { user_2: receiverUser }]}]});
        // console.log(chatContent);

        
        io.sockets.emit("showRecentChatToUser"+senderUser,{receiver:receiverUser,sender:senderUser,contentOfChat:chatContent});
    })

    socket.on("sendMsgToUser",async (data)=>{
        const obj={
            sender:senderUser,
            receiver:receiverUser,
            content:data.msg,
            datetime:Date.now()
        };
        await Chat.updateOne({$and:[ {$or: [{ user_1:senderUser}, { user_2: senderUser }]},{$or: [{ user_1: receiverUser }, { user_2: receiverUser }]}]},{$push:{chat:obj}});

        io.sockets.emit("showMsg",{receiver:receiverUser,sender:senderUser,msg:data.msg});
    })
})

server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}/login`);
});