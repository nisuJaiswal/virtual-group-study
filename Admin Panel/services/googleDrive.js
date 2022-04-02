const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

CLIENT_ID = "1084047056785-ggbm42gcsdhfo6frqupapdu5npru2iv3.apps.googleusercontent.com";
CLIENT_SECRET = "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";
REDIRECT_URI = "https://developers.google.com/oauthplayground";
REFRESH_TOKEN = "1//04mnpzkgActQ-CgYIARAAGAQSNwF-L9IrOSRdEpCFUJANn_C1O2cVV3fK6erLohHJ2nc340iY0CN6ZEo2DbPjoQgFSAxc1J4JtLk";

const oauth2client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: "v3",
    auth: oauth2client
});


async function uploadFile(fileName, fileType) {
    try {
        const filePath = path.join(__dirname, "/uploadedFiles/" + fileName);
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: fileType
            },
            media: {
                mimeType: fileType,
                body: fs.createReadStream(filePath)
            }
        });
        await createPublicLink(response.data.id);
        return { FileID: response.data.id };
    } catch (error) {
        console.log(error);
    }
}
// uploadFile();

async function deleteFile() {
    try {
        const response = await drive.files.delete({
            fileId: "1khj1GbDfv51VZCMekTa9oTHedzRIHKf6"
        });
        console.log(response.status);
    } catch (error) {
        console.log(err);
    }
}


// deleteFile();

async function createPublicLink(fid) {
    try {
        await drive.permissions.create({
            fileId: fid,
            requestBody: {
                role: "reader",
                type: "anyone"
            }
        });

    } catch (error) {
        console.log(error);
    }
}

// createPublicLink();

module.exports = { uploadFile, createPublicLink };