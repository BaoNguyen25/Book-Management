// require('dotenv').config('../../.env');
// const { google } = require('googleapis');

// const { DRIVE_ID, GOOGLE_KEY } = require('../config/config.ggDrive');
  

// const fs = require('fs');
// const { resolve } = require('path');

// const uploadImage = async (image, fileName) => {
//     try {
//         const auth = new google.auth.GoogleAuth({
//             keyFile: GOOGLE_KEY,
//             scopes: 'https://www.googleapis.com/auth/drive',
//         });

//         const driveService = google.drive({ version: 'v3', auth });

//         const fileMetadata = {
//             name: fileName,
//             parents: [DRIVE_ID]
//         };

//         const stream = fs.createReadStream(image.path);

//         console.log(stream);

//         const media = {
//             // MimeTypeArray: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
//             mimeType: image.mimetype,
//             body: stream,
//         };

//         const response = await driveService.files.create({
//             requestBody: fileMetadata,
//             media: media,
//             fields: 'id'
//         });

//         fs.unlinkSync(image);

//         const driveLink = 'https://drive.google.com/uc?export=view&id='

//         return await new Promise((resolve, reject) => {
//             resolve(driveLink + response.data.id);
//         });
//     } catch (err) {
//         console.log(err);
//         return null;
//     }
// };

// module.exports = {
//     uploadImage,
// };

const { error } = require('console');
const { storage } = require('../config/config.firebase');

const fs = require('fs');

const uploadImage = async (image, fileName) => {
    try {
        await storage.bucket().upload(image.path, {   
            destination: `images/${fileName}`,
            metadata: {
                contentType: image.mimetype,
            },
        });

        return await new Promise((resolve, reject) => {
            resolve(`https://firebasestorage.googleapis.com/v0/b/${storage.bucket().name}/o/images%2F
            ${fileName}?alt=media`);
        });
    } catch (error) {
        console.log(error);
        return null;
    }
};

const deleteImage = async (fileName) => {
    try {
        await storage.bucket().file(`images/${fileName}`).delete();
    } catch (error) {
        console.log(error);
        return null;
    }
};

const editImage = async (image, fileName) => {
    try {
        const file = storage.bucket().file(`images/${fileName}`);

        return await new Promise(async (resolve, reject) => {
            const imageContent = fs.readFileSync(image.path);
            
            await file.save(imageContent, {
                metadata: {
                    contentType: image.mimetype,
                },
            });

            resolve(`https://firebasestorage.googleapis.com/v0/b/${storage.bucket().name}/o/images%2F
            ${fileName}?alt=media`);
            
        });
    } catch (error) {
        console.log(error);
        return null;
    }
};


module.exports = {
    uploadImage,
    deleteImage,
    editImage,
};