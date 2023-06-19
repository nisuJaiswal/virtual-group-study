const express = require("express");
const router = express.Router();
const multer = require("multer");

const control = require("../controllers/adminControl");


//     -----Middleware-----

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    }
    else {
        res.redirect("/login");
    }
}

//     -----Middleware-----

const alreadyAuth = (req, res, next) => {
    if (req.session.isAuth) {
        res.redirect("/dashboard");
    }
    else {
        next();
    }
}


//     -----Log In GET-----

router.get("/login", alreadyAuth, control.renderLogin);


//     -----Log In POST-----

router.post("/login", control.postLogin);


//    -----Log Out GET-----

router.get("/logout", isAuth, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.clearCookie("connect.sid");
            res.redirect("/login");
        }
    });
});


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


//     -----Dashboard GET-----

router.get("/dashboard", isAuth, control.renderDashboard);


//     -----Admin - User GET-----

router.get("/admin-user", isAuth, control.renderAdminUser);


//     -----Admin - User Info Edit GET-----

router.get("/admin-user/:uId/edit-user-detail", isAuth, control.renderEditUserInfo);


//     -----Admin - User Info Edit GET-----

router.post("/admin-user/:uId/update-changes-user-profile", upload.single("updateUserImage"), control.postSaveChangesUserProfile);


//     -----Admin - User Search GET-----

router.get("/admin-user-search", isAuth, control.renderAdminUserSearch);


//     -----Admin - User Details GET-----

router.get("/admin-user/:uId/detail", isAuth, control.renderAdminUserDetail);


//     -----Admin - Add User GET-----

router.get("/admin-add-new-user", isAuth, control.renderAddUser);


//     -----Admin - Add User POST-----

router.post("/admin-store-new-user-data", upload.single("userPic"), control.postAddNewUserDetail);


//     -----Admin - Group GET-----

router.get("/admin-group", isAuth, control.renderAdminGroup);


//     -----Admin - Group Search GET-----

router.get("/admin-group-search", isAuth, control.renderAdminGroupSearch);


//     -----Admin - Group Detail GET-----

router.get("/admin-group/:gId/detail", isAuth, control.renderAdminGroupDetail);


//     -----Admin - Mail Feedback GET-----

router.get("/admin-feedback-mail", isAuth, control.renderAdminMail);


//     -----Admin - Mail Feedback Detail GET-----

router.get("/admin-feedback-mail/:uId/feedback-detail", isAuth, control.renderFeedbackDetail);


//     -----Admin - Verifyer GET-----

router.get("/admin-verify", isAuth, control.renderAdminVerify);


//     -----Admin - Verifyer Accept POST-----

router.post("/admin-verify-accept/:mId/material-approved", control.postApprovedMaterial);


//     -----Admin - Verifyer Reject POST-----

router.post("/admin-verify-reject/:mId/material-rejected", control.postRejectedMaterial);


module.exports = router;