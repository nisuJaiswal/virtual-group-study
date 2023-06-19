const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const CLIENT_ID = "1084047056785-9jd8efi8ciffhsf5fev35gcdln3mapb1.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//049omNbf_zVZwCgYIARAAGAQSNwF-L9IrDO1Ay_rZt2jakNK8Jiy9434dhQPqUO66SH8UgHpuZV-9im3HKeegrbR0oVQPdpr4sBs";


let oauth2client = new google.auth.OAuth2(
    "1084047056785-9jd8efi8ciffhsf5fev35gcdln3mapb1.apps.googleusercontent.com",
    "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",
    "https://developers.google.com/oauthplayground"
);

oauth2client.setCredentials({ refresh_token: "1//049omNbf_zVZwCgYIARAAGAQSNwF-L9IrDO1Ay_rZt2jakNK8Jiy9434dhQPqUO66SH8UgHpuZV-9im3HKeegrbR0oVQPdpr4sBs" });

const drive = google.drive({
    version: "v3",
    auth: oauth2client
});

async function uploadFile(fileName,fileType) {
    try {
        const filePath = path.join(__dirname, "/uploadedFiles/"+fileName);
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: fileType
                // parents:["14dnTGL4_gBEmI0cwzz4IuPgMD2AVafZ_"]
            },
            media: {
                mimeType: fileType,
                body: fs.createReadStream(filePath)
            }
            
        });
        await createPublicLink(response.data.id);
        return {FileID:response.data.id};
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

async function createPublicLink(fid){
    try {
        await drive.permissions.create({
            fileId:fid,
            requestBody:{
                role:"reader",
                type:"anyone"
            }
        });

    } catch (error) {
        console.log(error);
    }
}

// createPublicLink();

module.exports={uploadFile,createPublicLink};