const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongodbSession = require("connect-mongodb-session")(session);

require("dotenv").config();

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

app.use(require("./routes/adminRoutes"));

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}/login`)
})