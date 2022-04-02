const md5 = require("md5");
const mongoose = require("mongoose");

//     -----Import Models-----
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const Material = require("../models/materialModel");
const Group = require("../models/groupModel");
const Feedback = require("../models/feedbackModel");


const GoogleDrive = require("../services/googleDrive");


//     -----Global Variables-----
const defaultPhotoId = "1cCgfEePGGjsiWOPVW-HhZwkNO3LmHMYY";

//     -----Databse Connection-----
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


//     -----Log In GET-----

exports.renderLogin = (req, res) => {
    res.render("login");
}


//     -----Log In POST----

exports.postLogin = (req, res) => {
    Admin.findOne({ $or: [{ username: req.body.userName }, { emailId: req.body.userName }], password: md5(req.body.pass) }, (err, data) => {
        if (data) {
            req.session.isAuth = true;
            res.redirect("/dashboard");
        }
        else {
            res.redirect("/login");
        }
    })
}


//     -----Dashboard GET-----

exports.renderDashboard = async (req, res) => {
    const user = await User.find({}, null, { sort: { signupdate: -1 } });
    const material = await Material.find({});
    const group = await Group.find({});
    let newUserCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    user.forEach((u) => {
        let month = u.signupdate.toString().split(" ");
        // console.log(u.signupdate);
        // console.log(month[1] + " " + month[3]);
        switch (month[1] + " " + month[3]) {
            case "Jan 2022":
                newUserCount[0] += 1;
                break;
            case "Feb 2022":
                newUserCount[1] += 1;
                break;
            case "Mar 2022":
                newUserCount[2] += 1;
                break;
            case "Apr 2022":
                newUserCount[3] += 1;
                break;
            case "May 2022":
                newUserCount[4] += 1;
                break;
            case "Jun 2022":
                newUserCount[5] += 1;
                break;
            case "Jul 2022":
                newUserCount[6] += 1;
                break;
            case "Aug 2022":
                newUserCount[7] += 1;
                break;
            case "Sep 2022":
                newUserCount[8] += 1;
                break;
            case "Oct 2022":
                newUserCount[9] += 1;
                break;
            case "Nov 2022":
                newUserCount[10] += 1;
                break;
            case "Dec 2022":
                newUserCount[11] += 1;
                break;
            default:
                break;
        }
    })
    const materialInfo = await Material.find({}, null, { sort: { datetime: -1 } });
    // console.log(materialInfo);
    let userIdArr = [];
    materialInfo.forEach((mat) => {
        // console.log(mat.datetime);
        if (userIdArr.includes(mat.userid)) {
            return;
        }
        else {
            userIdArr.push(mat.userid);
        }
    })
    const userInfo = await User.find({ _id: { $in: userIdArr } }, "profilepic firstname lastname")
    // console.log(userIdArr);
    // console.log(userInfo);
    // console.log(newUserCount);
    res.render("Dashboard", { userCount: user.length, materialCount: material.length, groupCount: group.length, newUserChart: newUserCount, user: userInfo });
}


//     -----Admin - User GET-----

exports.renderAdminUser = async (req, res) => {
    const allUserInfo = await User.find({}, "profilepic firstname lastname");
    // console.log(allUserInfo);
    res.render("adminUser", { user: allUserInfo });
}


//     -----Admin - User Info Edit GET-----

exports.renderEditUserInfo = async (req, res) => {
    // res.send(req.params.uId)
    const userInfo = await User.findById(req.params.uId);
    res.render("adminEditUser", { user: userInfo });
}


//     -----Admin - User Info Edit POST-----

exports.postSaveChangesUserProfile = async (req, res) => {
    if (typeof req.file != "undefined") {

        const fileInfo = req.file;
        console.log(req.file);
        const fileData = await GoogleDrive.uploadFile(fileInfo.filename, fileInfo.mimetype);
        const webProfileLink = "https://drive.google.com/uc?export=view&id=" + fileData.FileID;

        User.updateOne({ _id: req.params.uId }, { firstname: req.body.firstname, lastname: req.body.lastname, intrestedfields: req.body.interestedFields, education: req.body.education, profilepic: webProfileLink, profilepic_gid: fileData.FileID, username: req.body.username, usermail: req.body.email, recoverymail: req.body.rmail }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/admin-user/" + req.params.uId + "/detail");
            }
        });

    }
    else {
        // res.send(req.params.uId);
        User.updateOne({ _id: req.params.uId }, { firstname: req.body.firstname, lastname: req.body.lastname, intrestedfields: req.body.interestedFields, education: req.body.education, username: req.body.username, usermail: req.body.email, recoverymail: req.body.rmail }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/admin-user/" + req.params.uId + "/detail");
            }
        });

    }
}


//     -----Admin - Add User GET-----

exports.renderAddUser = (req, res) => {
    res.render("adminAddUser");
}


//     -----Admin - Add User POST-----

exports.postAddNewUserDetail = async (req, res) => {
    if (typeof req.file != "undefined") {
        const fileInfo = req.file;
        console.log(req.file);
        const fileData = await GoogleDrive.uploadFile(fileInfo.filename, fileInfo.mimetype);
        const webProfileLink = "https://drive.google.com/uc?export=view&id=" + fileData.FileID;
        User.insertMany({ firstname: req.body.firstName, lastname: req.body.lastName, username: req.body.username, password: md5(req.body.password), usermail: req.body.mail, recoverymail: req.body.rMail, intrestedfields: req.body.interestedFields, education: req.body.education, profilepic: webProfileLink, profilepic_gid: fileData.FileID }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/admin-user");
            }
        });
    }
    else
    {
        const webProfileLink = "https://drive.google.com/uc?export=view&id=" + defaultPhotoId;
        User.insertMany({ firstname: req.body.firstName, lastname: req.body.lastName, username: req.body.username, password: md5(req.body.password), usermail: req.body.mail, recoverymail: req.body.rMail, intrestedfields: req.body.interestedFields, education: req.body.education, profilepic: webProfileLink, profilepic_gid: defaultPhotoId }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/admin-user");
            }
        });
    }
}


//     -----Admin - User Search GET-----

exports.renderAdminUserSearch = async (req, res) => {
    console.log(req.query.q);
    const searchUserInfo = await User.find({ $or: [{ username: req.query.q }, { usermail: req.query.q }, { firstname: req.query.q }, { lastname: req.query.q }, { recoverymail: req.query.q }] });
    res.render("adminUser", { user: searchUserInfo });
}


//     -----Admin - User Detail GET-----

exports.renderAdminUserDetail = async (req, res) => {
    const userInfo = await User.findOne({ _id: req.params.uId });
    // console.log(userInfo)
    let fields = "";
    for (let i = 0; i < userInfo.intrestedfields.length; i++) {
        if (i == userInfo.intrestedfields.length - 1) {
            fields += userInfo.intrestedfields[i];
        }
        else {
            fields += userInfo.intrestedfields[i] + ",  ";
        }
    }
    // console.log(fields);
    res.render("adminUserInfo", { user: userInfo, userField: fields });
}


//     -----Admin - Group GET-----

exports.renderAdminGroup = async (req, res) => {
    const allGroup = await Group.find({}, "grouppic title memberid");
    // console.log(allGroup);
    res.render("adminGroup", { group: allGroup });
}


//     -----Admin - Group Search GET-----

exports.renderAdminGroupSearch = async (req, res) => {
    console.log(req.query.q);
    const searchGroupInfo = await Group.find({ $or: [{ title: req.query.q }, { description: req.query.q }] });
    res.render("adminGroup", { group: searchGroupInfo });
}


//     -----Admin - Group Detail GET-----

exports.renderAdminGroupDetail = async (req, res) => {
    const grpDetail = await Group.findById(req.params.gId);
    const adminDetail = await User.findById(grpDetail.grpadmin, "firstname lastname profilepic");
    const grpMemberInfo = await User.find({ _id: { $in: grpDetail.memberid } }, "firstname lastname profilepic");
    let participants = [];
    grpMemberInfo.forEach((part) => {
        if (part._id != grpDetail.grpadmin) {
            participants.push(part);
        }
    })
    // console.log(grpDetail)
    // console.log(adminDetail)
    // console.log(participants)
    res.render("adminGroupDetails", { group: grpDetail, admin: adminDetail, participants: participants })
}


//     -----Admin - Mail GET-----

exports.renderAdminMail = async (req, res) => {
    const feedbackInfo = await Feedback.find({});
    // console.log(feedbackInfo);
    let userIdArr = [];
    feedbackInfo.forEach((element) => {
        if (userIdArr.includes(element.userId)) {
            return;
        }
        else {
            userIdArr.push(element.userId);
        }
    })
    const searchUserFeedbackInfo = await User.find({ _id: { $in: userIdArr } }, "profilepic firstname lastname");
    // console.log(searchUserFeedbackInfo)
    // console.log(userIdArr)
    res.render("adminMail", { user: searchUserFeedbackInfo });
}


//     -----Admin - Mail Feedback Detail GET-----

exports.renderFeedbackDetail = async (req, res) => {
    const userInfo = await User.findOne({ _id: req.params.uId }, "profilepic firstname lastname");
    // console.log(userInfo)
    const feedbackInfo = await Feedback.find({ userId: req.params.uId });
    // console.log(feedbackInfo)

    res.render("adminInnerMail", { user: userInfo, feedback: feedbackInfo });
}


//     -----Admin - Verifyer GET-----

exports.renderAdminVerify = async (req, res) => {
    const materialInfo = await Material.find({ verify: "pending" });
    // console.log(materialInfo);

    const userInfo = await User.find({});
    let verifyPendingMat = [];

    materialInfo.forEach((material) => {
        userInfo.forEach((user) => {
            if (material.userid == user._id) {
                const obj = {
                    userId: user._id,
                    matId: material._id,
                    profilepic: user.profilepic,
                    fname: user.firstname,
                    lname: user.lastname,
                    title: material.title,
                    desc: material.description,
                    material: material.material,
                    tags: material.tags
                }
                verifyPendingMat.push(obj);
            }
        })
    })
    // console.log(verifyPendingMat);
    res.render("adminVerifyer", { verifyInfo: verifyPendingMat });
}

//     -----Admin - Verifyer Accept POST-----

exports.postApprovedMaterial = async (req, res) => {
    // console.log("Approved")
    // console.log(req.params.mId)
    await Material.updateOne({ _id: req.params.mId }, { verify: "approved" });
}


//     -----Admin - Verifyer Reject POST-----

exports.postRejectedMaterial = async (req, res) => {
    // console.log("Reject")
    // console.log(req.params.mId)
    await Material.findByIdAndDelete(req.params.mId);
}