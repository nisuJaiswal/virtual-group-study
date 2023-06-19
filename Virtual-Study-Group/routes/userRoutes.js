const express = require("express");
const router = express.Router();
const multer = require("multer");
const control = require("../controllers/userControl");

//     -----Middleware-----

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        if (typeof req.cookies.userId != "undefined") {
            next();
        }
        else {
            res.redirect("/login");
        }
    }
    else {
        res.redirect("/login");
    }
}


//     -----Middleware-----

const alreadyAuth = (req, res, next) => {
    if (req.session.isAuth) {
        res.redirect("/home");
    }
    else {
        next();
    }
}


//    -----Log in GET-----

router.get("/login", alreadyAuth, (req, res) => {
    res.render("login", { visible: "hidden" });
});


//    -----Log in POST-----

router.post("/login", control.postLogin);


//    -----Sign Up GET-----

router.get("/signup", alreadyAuth, (req, res) => {
    res.render("signup");
});


//    -----Sign Up POST-----

router.post("/signup", control.postSignup);


//    -----Recovery Account GET-----

router.get("/recoveryAccountAuth", alreadyAuth, (req, res) => {
    res.render("recoveryAccountAuth",{getOtpEnable:"true"});
});


//    -----Recovery Account POST-----

router.post("/recoveryAccAuth", control.recoveryAccAuth);


//    -----Reset Password GET-----

router.get("/resetPasswordAuth",  (req, res) => {
    res.render("resetPasswordAuth",{getOtpEnable:"true"});
});


//    -----Reset Password POST-----

router.post("/resetPassAuth", control.resetPassAuth);


//    -----Set New Password POST-----

router.post("/setNewPassword", control.setNewPassword);


//    -----Log Out GET-----

router.get("/logout", isAuth, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.clearCookie("userId");
            res.clearCookie("image");
            res.clearCookie("connect.sid");
            res.redirect("/login");
        }
    });
});


//    -----Main Pages-----

//    -----Home GET-----

router.get("/home", isAuth, control.renderHome);


//    -----Upload Logic Code-----

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./services/uploadedFiles");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "---" + file.originalname);
    }
});

const upload = multer({ storage: fileStorage });


//    -----Upload GET-----

router.get("/upload", isAuth, control.renderUpload);


//     -----Upload POST-----

router.post("/upload/material",upload.single("uploadMaterial"),control.postUpload);


//     -----Edit Material GET-----

router.get("/user/:mId/editMaterial",isAuth,control.renderEditMaterial);


//     -----Edit Material POST-----

router.post("/user/:mId/editMaterial",upload.single("materialTags"),control.postEditMaterial);


//     -----Like Material POST-----

router.post("/post/:matId/like", control.postMaterialLike);


//     -----Unlike Material POST-----

router.post("/post/:matId/unlike", control.postMaterialUnlike);


//     ------Create Group GET-----

router.get("/createGroup", control.renderCreateGroup);


//     ------Create Group POST-----

router.post("/group/createGroup", upload.single("groupProfilePic"), control.postCreateGroup);


//     -----Group - Edit Group GET-----

router.get("/group/:gId/editGroup",isAuth,control.renderEditGroup);


//     -----Group - Edit Group POST-----

router.post("/group/:gId/editGroup",upload.single("changeGroupImage"),control.postEditGroup);


//     -----Group - My Groups GET-----

router.get("/group-myGroups", isAuth, control.renderMyGroups);


//     -----Group - Discussion GET-----

router.get("/group/:gID/discussion",isAuth,control.renderGrpDiscussion);


//     -----Group - Discover Groups GET-----

router.get("/group-discoverGroup", isAuth, control.renderDiscoverGroups);


//     -----Group - Details GET-----

router.get("/group/:gId/detail",isAuth,control.renderGroupInfo);


//     -----Group - Admin Delete User POST-----

router.post("/group-admin/:uId/:gId/delete-from-group",control.postDeleteUserAdmin);


//     -----Group - Join Group POST-----

router.post("/join/:groupId/group", control.postJoinGroup);


//     -----Group - Join Group Request POST-----

router.post("/send/:groupId/groupRequest", control.postJoinGroupRequest);


//     -----User Profile GET-----

router.get("/user-profile", isAuth, control.renderProfile);


//     -----User Profile Edit GET-----

router.get("/user-profile-edit",isAuth, control.renderEditProfile);


//     -----Update User Profile POST-----

router.post("/update-user-profile" , upload.single("editPhoto") ,control.postEditProfile);


//     ------User Setting GET-----

router.get("/user-settings",isAuth,control.renderSetting);


//     -----User Setting POST-----

router.post("/user-settings",control.postChangeSetting);


//     -----User Notification GET-----

router.get("/user-notification-request",isAuth,control.renderNotification);


//     -----Accept Group Request POST-----

router.post("/accept/:uid/:gid/groupRequest",control.postAcceptGroupRequest);


//     -----Reject Group Request POST-----

router.post("/reject/:uid/:gid/groupRequest",control.postRejectGroupRequest);


//     -----Another User Profile GET-----

router.get("/user/:uId/profile",isAuth,control.renderAnotherUserProfile);


//     -----Search GET----

router.post("/user-search",isAuth,control.renderSearch);


//     -----Send Friend Request POST-----

router.post("/studyBuddy/:uid/request",control.postFrdRequest);


//     -----Accept Friend Request POST-----

router.post("/accept/:uid/friendRequest",control.postAcceptFrdRequest)


//     -----Reject Friend Request POST-----

router.post("/reject/:uid/friendRequest",control.postRejectFrdRequest)


//     -----Chat GET-----

router.get("/chat",isAuth,control.renderChat);


//     -----Help GET-----

router.get("/help", isAuth, control.renderHelp);


//     -----Help Details GET-----

router.get("/help-details", isAuth, control.renderHelpDetail);


//    -----Contact Us GET-----

router.get("/contactUs", isAuth, control.renderContactUs);


//    -----About Us GET-----

router.get("/aboutUs", isAuth, control.renderAboutUs);


//    -----New User Form Data GET-----

router.get("/newUserForm", isAuth, (req, res) => {
    res.render("newUserForm");
});


//    -----New User Form Data POST-----

router.post("/storeNewUserData/newUserForm", upload.single("uploadProfilePic"), control.storeNewUserData);


//    -----Feedback GET-----

router.get("/feedback", isAuth, control.renderFeedback);


//    -----Feedback POST-----

router.post("/feedback", control.postFeedback);

module.exports = router;