import minioClient from "./minio.client";
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

// Function to upload file to MinIO
const uploadFileToMinIO = (bucketName: string, file: any) => {
  return new Promise((resolve, reject) => {
    // generating random unique id and renaming the file
    const uniqueId = crypto.randomUUID();
    const newFileName = `${uniqueId}-${file.originalname}`;
    const newFilePath = path.join(path.dirname(file.path), newFileName);
    fs.renameSync(file.path, newFilePath);
    minioClient.fPutObject(
      bucketName,
      newFileName,
      newFilePath,
      (err: any, etag: any) => {
        console.error("Error uploading file to MinIO:", err);
        if (err) return reject(err);

        // Optionally delete the local file after uploading to MinIO
        fs.unlink(file.path, (unlinkErr: any) => {
          if (unlinkErr) console.log("Error deleting local file:", unlinkErr);
        });

        resolve(newFileName);
      }
    );
  });
};

const checkFileExistsInMinIO = (bucketName: string, fileName: string) => {
  return new Promise((resolve, reject) => {
    minioClient.statObject(bucketName, fileName, (err, stat) => {
      if (err) return reject(err);
      resolve(stat);
    });
  });
};

const downloadFileFromMinIO = (bucketName: string, fileName: string) => {
  return new Promise((resolve, reject) => {
    minioClient.getObject(bucketName, fileName, (err, stream) => {
      if (err) return reject(err);
      resolve(stream);
    });
  });
};

module.exports = {
  uploadFileToMinIO,
  checkFileExistsInMinIO,
  downloadFileFromMinIO,
};
