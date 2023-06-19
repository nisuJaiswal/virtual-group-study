const md5 = require("md5");
const mongoose = require("mongoose");

//     -----Import Models-----
const User = require("../models/userModel");
const Material = require("../models/materialModel");
const Group = require("../models/groupModel");
const Feedback = require("../models/feedbackModel");
const GroupDiscussion = require("../models/groupDiscussionModel");
const Chat = require("../models/chatModel");


const vsgMail = require("../services/mail");
const GoogleDrive = require("../services/googleDrive");
require("dotenv").config();


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


//     -----Global Variable-----
const defaultPhotoId = "1cCgfEePGGjsiWOPVW-HhZwkNO3LmHMYY";
const defaultGroupPicId = "1VdqKa_eNk4i2VGLH6O231G9tRGkbScLG";

//     -----Log In POST-----

exports.postLogin = (req, res) => {

    User.findOne({ $or: [{ username: req.body.username }, { usermail: req.body.username }], password: md5(req.body.password) }, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            if (data) {
                console.log(data);
                req.session.isAuth = true;
                res.cookie("userId", data._id);
                res.cookie("image", data.profilepic);
                res.redirect("/home");
            }
            else {
                res.render("login", { visible: "visible" });
            }
        }
    });
};


//     -----Sign Up POST-----

exports.postSignup = (req, res) => {

    User.find({ $or: [{ username: req.body.userName }, { usermail: req.body.email }] }, (err, data) => {
        if (data.length > 0) {
            res.render("signup", {
                firstName: req.body.firstName,
                userName: req.body.userName,
                recoveryMail: req.body.recoveryMail,
                lastName: req.body.lastName,
                email: req.body.email,
                visible: "visibility:visible;"
            });
        }
        else {
            User.insertMany({
                firstname: req.body.firstName,
                lastname: req.body.lastName,
                username: req.body.userName,
                password: md5(req.body.password),
                usermail: req.body.email,
                recoverymail: req.body.recoveryMail
            }, (err, data) => {
                if (err) {
                    console.log(err);
                }
                else {
                    req.session.isAuth = true;
                    console.log(data);
                    res.cookie("userId", data[0]._id);
                    res.redirect("/newUserForm");
                }
            });
        }
    });
};


//     -----Recovery Account POST-----

let otp;
let timerOTP;
exports.recoveryAccAuth = async (req, res) => {
    if (req.body.getOTP == "getOTP") {
        vsgMail.mailSend(req.body.emailID);
        otp = vsgMail.otp;
        // otp = Math.floor(1000 + Math.random() * 9000);
        console.log(otp);
        timerOTP = Date.now();
        res.render("recoveryAccountAuth", { userMail: req.body.emailID, submitEnable: "true", passEnable: "true" });
    }
    else if (req.body.submitOTP == "validate") {
        if ((Date.now()) <= (timerOTP + 180000)) {
            if (otp == req.body.readOTP) {
                User.find({ recoverymail: req.body.emailID }, (err, data) => {
                    if (data.length > 0) {
                        otp = md5(req.body.readOTP);
                        res.render("recoveryAccountGetInfo", { userData: data });
                    }
                    else {
                        otp = md5(req.body.readOTP);
                        res.render("recoveryAccountGetInfo", { notFound: "true" });
                    }
                });
            }
            else {
                res.render("recoveryAccountAuth", { userMail: req.body.emailID, visible: "visibility:visible;", passEnable: "true", submitEnable: "true" });
            }
        }
        else {
            res.redirect("/recoveryAccountAuth");
        }
    }
    else {
        res.redirect("/recoveryAccountAuth");
    }
};


//     -----Reset Password POST-----

let passOTP;
exports.resetPassAuth = (req, res) => {
    if (req.body.OTPget == "OTPget") {
        User.find({ usermail: req.body.userEmail }, (err, data) => {
            if (data.length > 0) {
                passOTP = Math.floor(1000 + Math.random() * 9000);
                console.log(passOTP);
                res.render("resetPasswordAuth", { mail: req.body.userEmail, passEnable: "true", submitEnable: "true" });
            }
            else {
                res.render("resetPasswordAuth", { visible: "visibility:visible;", getOtpEnable: "true" });
            }
        });
    }
    else if (req.body.Submit == "Validate") {
        if (req.body.otp == passOTP) {
            res.cookie("userMail", req.body.userEmail);
            res.render("setNewPassword");
        }
        else {
            res.render("resetPasswordAuth", { msg: "OTP does not match", mail: req.body.userEmail, passEnable: "true", submitEnable: "true" });
        }
    }
};


//     -----Set New Password POST-----

exports.setNewPassword = (req, res) => {
    if (req.body.newPassword == req.body.repeatNewPassword) {
        User.updateOne({ usermail: req.cookies.userMail }, { password: md5(req.body.newPassword) }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.clearCookie("userMail");
                res.redirect("/login");
            }
        });
    }
    else {
        res.render("setNewPassword", { visible: "visibility:visible;" });
    }
};


//     -----Main Pages-----

//     -----New User Form Data POST-----

exports.storeNewUserData = async (req, res) => {
    if (typeof req.file != "undefined") {
        const fileInfo = req.file;
        console.log(req.file);
        const fileData = await GoogleDrive.uploadFile(fileInfo.filename, fileInfo.mimetype);
        const webProfileLink = "https://drive.google.com/uc?export=view&id=" + fileData.FileID;
        User.updateOne({ _id: req.cookies.userId }, { intrestedfields: req.body.interestedFields, education: req.body.education, profilepic: webProfileLink, profilepic_gid: fileData.FileID }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.cookie("image", webProfileLink);
                res.redirect("/home");
            }
        });
    }
    else {
        const webProfileLink = "https://drive.google.com/uc?export=view&id=" + defaultPhotoId;
        User.updateOne({ _id: req.cookies.userId }, { intrestedfields: req.body.interestedFields, education: req.body.education, profilepic: webProfileLink, profilepic_gid: defaultPhotoId }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.cookie("image", webProfileLink);
                res.redirect("/home");
            }
        });
    }
};


//     -----Home GET-----

exports.renderHome = (req, res) => {
    User.findOne({ _id: req.cookies.userId }, "studybuddyid profilepic", (err, data) => {
        if (err) {
            console.log(err);
        }
        else {

            // console.log(data);
            User.find({ _id: { $in: data.studybuddyid } }, "profilepic firstname lastname", (err, data1) => {
                if (err) {
                    console.log(err);
                }
                else {
                    // console.log(data1);
                    // let mData = [];
                    // data1.forEach(Data => {
                    //     mData.push(Data._id);
                    // });
                    // console.log(mData);
                    // console.log(data1.length);
                    Material.find({ userid: { $in: data.studybuddyid } }, "title description material userid datetime like tags like_userid", { sort: { datetime: -1 } }, (err, data2) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            // console.log(data2);
                            let matData = [];
                            for (let x = 0; x < data2.length; x++) {
                                for (let y = 0; y < data1.length; y++) {
                                    if (data2[x].userid == data1[y]._id) {
                                        if (data2[x].like_userid.includes(req.cookies.userId)) {
                                            const obj = {
                                                _id: data2[x]._id,
                                                userID: data1[y]._id,
                                                firstname: data1[y].firstname,
                                                lastname: data1[y].lastname,
                                                profilepic: data1[y].profilepic,
                                                title: data2[x].title,
                                                description: data2[x].description,
                                                material: data2[x].material,
                                                like: data2[x].like,
                                                userLiked: "fa-thumbs-up",
                                                tags: data2[x].tags
                                            }
                                            matData.push(obj);
                                        }
                                        else {
                                            const obj = {
                                                _id: data2[x]._id,
                                                userID: data1[y]._id,
                                                firstname: data1[y].firstname,
                                                lastname: data1[y].lastname,
                                                profilepic: data1[y].profilepic,
                                                title: data2[x].title,
                                                description: data2[x].description,
                                                material: data2[x].material,
                                                like: data2[x].like,
                                                userLiked: "fa-thumbs-o-up",
                                                tags: data2[x].tags
                                            }
                                            matData.push(obj);
                                        }
                                    }
                                }
                            }
                            // console.log(matData);
                            res.render("index", { userData: matData, proPic: req.cookies.image });
                        }
                    })
                }
            })
        }
    });
};


//     -----Upload GET-----

exports.renderUpload = (req, res) => {
    res.render("upload", { proPic: req.cookies.image });
};


//     -----Upload POST-----

exports.postUpload = async (req, res) => {
    const fileInfo = req.file;
    console.log(fileInfo);
    const fileData = await GoogleDrive.uploadFile(fileInfo.filename, fileInfo.mimetype);

    const webFileLink = "https://drive.google.com/file/d/" + fileData.FileID + "/preview";

    const tagString = req.body.materialTags;
    const tagsArr = tagString.split(',');
    await Material.insertMany({
        userid: req.cookies.userId,
        title: req.body.materialTitle,
        description: req.body.materialDesc,
        tags: tagsArr,
        material: webFileLink,
        material_gid: fileData.FileID
    });
    res.redirect("/home");
};


//     -----Edit Material GET-----

exports.renderEditMaterial = async (req, res) => {
    const matInfo = await Material.findById(req.params.mId);
    // console.log(matInfo);

    if(matInfo.userid == req.cookies.userId)
    {
        res.render("editMaterial", { proPic: req.cookies.image, material: matInfo });
    }
    else
    {
        res.redirect("/home");
    }
}


//     -----Edit Material POST-----

exports.postEditMaterial = async (req, res) => {
    if (typeof req.file != "undefined") {
        const fileInfo = req.file;
        console.log(req.file);
        const fileData = await GoogleDrive.uploadFile(fileInfo.filename, fileInfo.mimetype);
        const webPreviewLink = "https://drive.google.com/file/d/" + fileData.FileID + "/preview";
        let tagsArr = req.body.tagString.split(",");
        Material.updateOne({ _id: req.params.mId }, {
            title: req.body.matTitle,
            description: req.body.matDesc,
            material: webPreviewLink,
            material_gid: fileData.FileID,
            tags: tagsArr
        }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/user-profile");
            }
        });
    }
    else {
        let tagsArr = req.body.tagString.split(",");
        Material.updateOne({ _id: req.params.mId }, {
            title: req.body.matTitle,
            description: req.body.matDesc,
            tags: tagsArr
        }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/user-profile");
            }
        });

    }
}

//     -----Like Material POST-----

exports.postMaterialLike = async (req, res) => {
    const matInfo = await Material.findById(req.params.matId, "like like_userid");
    matInfo.like += 1;
    matInfo.like_userid.push(req.cookies.userId);
    // console.log(matInfo);
    Material.updateOne({ _id: req.params.matId }, { like: matInfo.like, like_userid: matInfo.like_userid }, (err, data) => {
        if (err) {
            console.log(err);
        }
    });
}


//     -----Unlike Material POST-----

exports.postMaterialUnlike = async (req, res) => {
    const matInfo = await Material.findById(req.params.matId, "like like_userid");
    matInfo.like -= 1;
    var likeIdArray = [];
    matInfo.like_userid.forEach((likeid) => {
        if (req.cookies.userId != likeid) {
            likeIdArray.push(likeid);
        }
    })
    // console.log(matInfo);
    Material.updateOne({ _id: req.params.matId }, { like: matInfo.like, like_userid: likeIdArray }, (err, data) => {
        if (err) {
            console.log(err);
        }
    });
}


//     -----Create Group GET-----

exports.renderCreateGroup = (req, res) => {
    res.render("createGroup", { proPic: req.cookies.image });
}


//     -----Create Group POST-----

exports.postCreateGroup = async (req, res) => {
    if (typeof req.file != "undefined") {
        const fileInfo = req.file;
        const fileData = await GoogleDrive.uploadFile(fileInfo.filename, fileInfo.mimetype);
        const webProfileLink = "https://drive.google.com/uc?export=view&id=" + fileData.FileID;
        Group.insertMany({
            grouppic: webProfileLink,
            grouppic_gid: fileData.FileID,
            title: req.body.grpTitle,
            description: req.body.grpDesc,
            grpadmin: req.cookies.userId,
            privacy: req.body.privacy,
            memberid: req.cookies.userId
        }, async (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                await GroupDiscussion.insertMany({ groupid: data[0]._id });
                res.redirect("/group-myGroups");
            }
        })
    }
    else {
        const webProfileLink = "https://drive.google.com/uc?export=view&id=" + defaultGroupPicId;
        Group.insertMany({
            grouppic: webProfileLink,
            grouppic_gid: defaultGroupPicId,
            title: req.body.grpTitle,
            description: req.body.grpDesc,
            grpadmin: req.cookies.userId,
            privacy: req.body.privacy,
            memberid: req.cookies.userId
        }, async (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                await GroupDiscussion.insertMany({ groupid: data[0]._id });
                res.redirect("/group-myGroups");
            }
        })
    }
}


//     -----Group - Edit Group GET-----

exports.renderEditGroup = async (req, res) => {
    const grpDetail = await Group.findById(req.params.gId);
    if(grpDetail.grpadmin == req.cookies.userId)
    {
        res.render("editGroup", { proPic: req.cookies.image, group: grpDetail });
    }
    else
    {
        res.redirect("/group-myGroups");
    }
}


//     -----Group - Edit Group POST-----

exports.postEditGroup = async (req, res) => {
    if (typeof req.file != "undefined") {
        const fileInfo = req.file;
        console.log(req.file);
        const fileData = await GoogleDrive.uploadFile(fileInfo.filename, fileInfo.mimetype);
        const webProfileLink = "https://drive.google.com/uc?export=view&id=" + fileData.FileID;
        Group.updateOne({ _id: req.params.gId }, {
            grouppic: webProfileLink,
            grouppic_gid: fileData.FileID,
            title: req.body.grpTitle,
            description: req.body.grpDesc,
            privacy: req.body.privacy
        }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/group/" + req.params.gId + "/detail");
            }
        });
    }
    else {
        Group.updateOne({ _id: req.params.gId }, {
            title: req.body.grpTitle,
            description: req.body.grpDesc,
            privacy: req.body.privacy
        }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/group/" + req.params.gId + "/detail");
            }
        });
    }

}


//     -----Group - My Groups GET-----

exports.renderMyGroups = async (req, res) => {
    const myGrps = await Group.find({ memberid: req.cookies.userId }, null, { sort: { datetime: -1 } });
    // let myGrp = [];
    // myGrps.forEach((grp) => {
    //     if (grp.memberid.includes(req.cookies.userId)) {
    //         myGrp.push(grp);
    //     }
    //     else {
    //         // console.log(grp);
    //         return;
    //     }
    // })
    res.render("myGroup", { proPic: req.cookies.image, myGroup: myGrps });
}


//     -----Group - Discussion GET-----

exports.renderGrpDiscussion = async (req, res) => {
    const grpInfo = await Group.findOne({ _id: req.params.gID });
    const discussionInfo = await GroupDiscussion.findOne({ groupid: req.params.gID }, null, { sort: { datetime: 1 } });
    // console.log(discussionInfo.datetime.sort());
    if(grpInfo.memberid.includes(req.cookies.userId))
    {
        res.render("groupDiscussion", { proPic: req.cookies.image, group: grpInfo, sendUserID: req.cookies.userId, discussion: discussionInfo.discussion });
    }
    else
    {
        res.redirect("/group-myGroups");
    }
}


//     -----Group - Discover Groups GET-----

exports.renderDiscoverGroups = async (req, res) => {
    const grps = await Group.find({}, null, { sort: { datetime: -1 } });
    let grp = [];
    grps.forEach((group) => {
        if (group.grpadmin != req.cookies.userId) {
            if (group.memberid.includes(req.cookies.userId)) {
                // console.log(group);
                return;
            }
            else {
                if (group.request.includes(req.cookies.userId)) {
                    group.joinRequest = "true";
                    grp.push(group);
                }
                else {
                    group.joinRequest = "false";
                    grp.push(group);
                }
            }
        }
    })
    // console.log(grp);
    console.log(grp)
    res.render("discoverGroup", { proPic: req.cookies.image, groupInfo: grp, logInUserId: req.cookies.userId });
}


//     -----Group - Details GET-----

exports.renderGroupInfo = async (req, res) => {
    const grpDetail = await Group.findById(req.params.gId);
    const adminDetail = await User.findById(grpDetail.grpadmin, "firstname lastname profilepic");
    const grpMemberInfo = await User.find({ _id: { $in: grpDetail.memberid } }, "firstname lastname profilepic");
    let participants = [];
    grpMemberInfo.forEach((part) => {
        if (part._id != grpDetail.grpadmin) {
            participants.push(part);
        }
    })
    res.render("groupInfo", { proPic: req.cookies.image, group: grpDetail, admin: adminDetail, participants: participants, uId: req.cookies.userId });
}


//     -----Group - Admin Delete User POST-----

exports.postDeleteUserAdmin = async (req, res) => {
    // console.log(req.params.uId + "User")
    // console.log(req.params.gId + "Group")

    await Group.updateOne({ _id: req.params.gId }, { $pull: { memberid: req.params.uId } });
}


//     -----Group - Join Group POST-----

exports.postJoinGroup = async (req, res) => {
    const groupData = await Group.find({ _id: req.params.groupId }, "memberid");
    groupData[0].memberid.push(req.cookies.userId);
    Group.updateOne({ _id: req.params.groupId }, { memberid: groupData[0].memberid }, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/group-discoverGroup");
        }
    })
    // console.log(groupData);
}


//     -----Group - Join Group Request POST-----

exports.postJoinGroupRequest = async (req, res) => {
    const groupData = await Group.find({ _id: req.params.groupId }, "request");
    groupData[0].request.push(req.cookies.userId);
    Group.updateOne({ _id: req.params.groupId }, { request: groupData[0].request }, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/group-discoverGroup");
        }
    })
    // console.log(groupData);
}


//     -----User Profile GET-----

exports.renderProfile = async (req, res) => {
    const userData = await User.findById(req.cookies.userId);
    let fields = "";
    for (let i = 0; i < userData.intrestedfields.length; i++) {
        if (i == userData.intrestedfields.length - 1) {
            fields += userData.intrestedfields[i];
        }
        else {
            fields += userData.intrestedfields[i] + ", ";
        }
    }
    // console.log(fields);
    // console.log(userData);
    const matData = await Material.find({ userid: userData._id }, null, { sort: { datetime: -1 } });
    let userMatData = [];
    matData.forEach((matInfo) => {
        if (matInfo.like_userid.includes(req.cookies.userId)) {
            const obj = {
                _id: matInfo._id,
                title: matInfo.title,
                description: matInfo.description,
                material: matInfo.material,
                like: matInfo.like,
                tags: matInfo.tags,
                likeClass: "fa-thumbs-up"
            }
            userMatData.push(obj);
        }
        else {
            const obj = {
                _id: matInfo._id,
                title: matInfo.title,
                description: matInfo.description,
                material: matInfo.material,
                like: matInfo.like,
                tags: matInfo.tags,
                likeClass: "fa-thumbs-o-up"
            }
            userMatData.push(obj);
        }
    })
    res.render("profile", { proPic: req.cookies.image, user: userData, uploadedPosts: userMatData, uFields: fields });

};


//     -----User Profile Edit GET-----

exports.renderEditProfile = async (req, res) => {
    const userInfo = await User.findById(req.cookies.userId);
    // console.log(userInfo);
    res.render("editProfile", { proPic: req.cookies.image, user: userInfo });
}


//     -----Update User Profile-----

exports.postEditProfile = async (req, res) => {
    // console.log(req.file);
    if (typeof req.file != "undefined") {
        const fileInfo = req.file;
        // console.log(req.file);
        const fileData = await GoogleDrive.uploadFile(fileInfo.filename, fileInfo.mimetype);
        const webProfileLink = "https://drive.google.com/uc?export=view&id=" + fileData.FileID;
        res.cookie("image", webProfileLink);
        User.updateOne({ _id: req.cookies.userId }, { firstname: req.body.firstname, lastname: req.body.lastname, intrestedfields: req.body.interestedFields, education: req.body.education, profilepic: webProfileLink, profilepic_gid: fileData.FileID }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/user-profile");
            }
        });
    }
    else {
        User.updateOne({ _id: req.cookies.userId }, { firstname: req.body.firstname, lastname: req.body.lastname, intrestedfields: req.body.interestedFields, education: req.body.education }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/user-profile");
            }
        });
    }
}


//     -----User Setting GET-----

exports.renderSetting = async (req, res) => {
    const userPrivacy = await User.findOne({ _id: req.cookies.userId }, "privacy");
    // console.log(userPrivacy);
    res.render("settings", { proPic: req.cookies.image, privacy: userPrivacy });
}


//     -----User Setting POST-----

exports.postChangeSetting = (req, res) => {
    User.updateOne({ _id: req.cookies.userId }, { privacy: req.body.privacy }, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/home");
        }
    });
}


//     -----User Notification GET-----

exports.renderNotification = async (req, res) => {
    let reqInfo = [];
    Group.find({ grpadmin: req.cookies.userId }, "title request", (err, data1) => {
        if (err) {
            console.log(err);
        }
        else {
            data1.forEach((grp) => {
                grp.request.forEach((req) => {
                    User.findOne({ _id: req }, "firstname lastname profilepic", (err, data2) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            const reqGrpInfo = {
                                userid: data2._id,
                                grpid: grp._id,
                                firstname: data2.firstname,
                                lastname: data2.lastname,
                                profilepic: data2.profilepic,
                                group: grp.title
                            };
                            reqInfo.push(reqGrpInfo);
                        }
                    })
                })
            })
        }
    })
    let userReq = [];
    const uReq = await User.findOne({ _id: req.cookies.userId }, "request");
    // console.log(uReq);
    const allUser = await User.find({ _id: { $in: uReq.request } }, "firstname lastname profilepic");
    // console.log(allUser);

    setTimeout(() => {
        console.log(reqInfo)
        res.render("notification", { proPic: req.cookies.image, grpReqInfo: reqInfo, userInfo: allUser });
    }, 1000);
}


//     -----Accept Group Request POST-----

exports.postAcceptGroupRequest = async (req, res) => {
    console.log("Accept")
    const grpInfo = await Group.findOne({ _id: req.params.gid }, "request memberid");
    console.log(grpInfo);
    let reqArr = [];
    grpInfo.request.forEach((rq) => {
        if (rq != req.params.uid) {
            reqArr.push(rq);
        }
    })
    grpInfo.memberid.push(req.params.uid);
    const reqUpdate = await Group.updateOne({ _id: req.params.gid }, { request: reqArr, memberid: grpInfo.memberid });
    console.log(reqUpdate);

}


//     -----Reject Group Request POST-----

exports.postRejectGroupRequest = async (req, res) => {
    console.log("Reject")
    const grpInfo = await Group.findOne({ _id: req.params.gid }, "request");
    let reqArr = [];
    grpInfo.request.forEach((rq) => {
        if (rq != req.params.uid) {
            reqArr.push(rq);
        }
    })
    const reqUpdate = await Group.updateOne({ _id: req.params.gid }, { request: reqArr });
    console.log(reqUpdate);
}


//     -----Another User Profile GET-----

exports.renderAnotherUserProfile = async (req, res) => {
    const userData = await User.findById(req.params.uId);
    // console.log(userData);
    let fields = "";
    for (let i = 0; i < userData.intrestedfields.length; i++) {
        if (i == userData.intrestedfields.length - 1) {
            fields += userData.intrestedfields[i];
        }
        else {
            fields += userData.intrestedfields[i] + ", ";
        }
    }
    const matData = await Material.find({ userid: userData._id }, null, { sort: { datetime: -1 } })
    let userMatData = [];
    if (userData.privacy != "private") {
        matData.forEach((matInfo) => {
            if (matInfo.like_userid.includes(req.cookies.userId)) {
                const obj = {
                    _id: matInfo._id,
                    title: matInfo.title,
                    description: matInfo.description,
                    material: matInfo.material,
                    like: matInfo.like,
                    tags: matInfo.tags,
                    likeClass: "fa-thumbs-up"
                }
                userMatData.push(obj);
                // matInfo.likeClass = "fa-thumbs-up";
            }
            else {
                const obj = {
                    _id: matInfo._id,
                    title: matInfo.title,
                    description: matInfo.description,
                    material: matInfo.material,
                    like: matInfo.like,
                    tags: matInfo.tags,
                    likeClass: "fa-thumbs-o-up"
                }
                userMatData.push(obj);
                // matInfo.likeClass = "fa-thumbs-o-up";
            }
        })
    }
    else {
        if (userData.studybuddyid.includes(req.cookies.userId)) {
            matData.forEach((matInfo) => {
                if (matInfo.like_userid.includes(req.cookies.userId)) {
                    const obj = {
                        _id: matInfo._id,
                        title: matInfo.title,
                        description: matInfo.description,
                        material: matInfo.material,
                        like: matInfo.like,
                        tags: matInfo.tags,
                        likeClass: "fa-thumbs-up"
                    }
                    userMatData.push(obj);
                    // matInfo.likeClass = "fa-thumbs-up";
                }
                else {
                    const obj = {
                        _id: matInfo._id,
                        title: matInfo.title,
                        description: matInfo.description,
                        material: matInfo.material,
                        like: matInfo.like,
                        tags: matInfo.tags,
                        likeClass: "fa-thumbs-o-up"
                    }
                    userMatData.push(obj);
                    // matInfo.likeClass = "fa-thumbs-o-up";
                }
            })
        }
    }
    res.render("userProfile", { proPic: req.cookies.image, user: userData, uploadedPosts: userMatData, uFields: fields });

}


//     -----Search GET-----

exports.renderSearch = async (req, res) => {
    console.log(req.body.searchBar);
    const userInfo = await User.find({ $or: [{ firstname: req.body.searchBar }, { lastname: req.body.searchBar }] });
    // console.log(userInfo);
    const myFrd = await User.findOne({ _id: req.cookies.userId }, "studybuddyid request");
    console.log(myFrd);
    let userArr = [];
    userInfo.forEach((user) => {
        if (user._id != req.cookies.userId) {
            if (myFrd.studybuddyid.includes(user._id)) {
                const obj = {
                    userid: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    profilepic: user.profilepic,
                    frd: "fa-check-circle"
                }
                userArr.push(obj);
            }
            else if (user.request.includes(req.cookies.userId)) {
                const obj = {
                    userid: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    profilepic: user.profilepic,
                    frd: "fa-check-circle"
                }
                userArr.push(obj);
            }
            else if (myFrd.request.includes(user._id)) {
                const obj = {
                    userid: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    profilepic: user.profilepic,
                    frd: "fa-check-circle"
                }
                userArr.push(obj);
            }
            else {
                const obj = {
                    userid: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    profilepic: user.profilepic,
                    frd: "fa-user-plus"
                }
                userArr.push(obj);
            }
        }
    })
    console.log(userArr);
    res.render("searchUser", { proPic: req.cookies.image, userInfo: userArr, search: req.body.searchBar });
}


//     -----Send Friend Request POST-----

exports.postFrdRequest = async (req, res) => {
    const userReq = await User.findOne({ _id: req.params.uid }, "request");
    userReq.request.push(req.cookies.userId);
    console.log(userReq);
    const updateRes = await User.updateOne({ _id: req.params.uid }, { request: userReq.request });
}


//     -----Accept Friend Request POST-----

exports.postAcceptFrdRequest = async (req, res) => {
    const meInfo = await User.findOne({ _id: req.cookies.userId }, "studybuddyid request");
    const frdInfo = await User.findOne({ _id: req.params.uid }, "studybuddyid");
    let myReq = [];
    meInfo.request.forEach((rq) => {
        if (rq != req.params.uid) {
            myReq.push(rq);
        }
    })
    meInfo.studybuddyid.push(req.params.uid);
    frdInfo.studybuddyid.push(req.cookies.userId);
    const updateMe = await User.updateOne({ _id: req.cookies.userId }, { studybuddyid: meInfo.studybuddyid, request: myReq });
    const updateFrd = await User.updateOne({ _id: req.params.uid }, { studybuddyid: frdInfo.studybuddyid });
    await Chat.insertMany({user_1:req.cookies.userId,user_2:req.params.uid});
}


//     -----Reject Friend Request POST-----

exports.postRejectFrdRequest = async (req, res) => {
    const meInfo = await User.findOne({ _id: req.cookies.userId }, "request");
    let myReq = [];
    meInfo.request.forEach((rq) => {
        if (rq != req.params.uid) {
            myReq.push(rq);
        }
    })
    const updateMe = await User.updateOne({ _id: req.cookies.userId }, { request: myReq });
}

//     -----Chat GET-----

exports.renderChat = async (req, res) => {
    const user = await User.findOne({ _id: req.cookies.userId }, "studybuddyid");
    const userDetails = await User.find({ _id: { $in: user.studybuddyid } }, "firstname lastname profilepic");
    // console.log(userDetails);
    res.render("chat", { proPic: req.cookies.image ,frdDetail : userDetails,userID:req.cookies.userId});
}


//     -----Help GET-----

exports.renderHelp = async (req, res) => {
    res.render("help", { proPic: req.cookies.image });
};


//     -----Help Details GET-----

exports.renderHelpDetail = (req, res) => {
    res.render("helpDetail", { proPic: req.cookies.image })
}


//     -----Contact Us GET-----

exports.renderContactUs = (req, res) => {
    res.render("contactUs", { proPic: req.cookies.image });
};


//     -----About Us GET-----

exports.renderAboutUs = (req, res) => {
    res.render("aboutUs", { proPic: req.cookies.image });
};


//     -----Feedback GET-----

exports.renderFeedback = (req, res) => {
    res.render("feedback", { proPic: req.cookies.image });
};


//     -----Feedback POST-----

exports.postFeedback = (req, res) => {
    let cate;
    if (req.body.catagory == "other") {
        cate = req.body.otherCatagory;
    }
    else {
        cate = req.body.catagory;
    }
    Feedback.insertMany({
        userId: req.cookies.userId,
        category: cate,
        content: req.body.feedback,
        rating: req.body.rate
    }, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/home");
        }
    });
};
