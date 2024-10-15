import minioClient from "./minio.client";
const fs = require("fs");

// Function to upload file to MinIO
const uploadFileToMinIO = (bucketName: string, file: any) => {
  return new Promise((resolve, reject) => {
    minioClient.fPutObject(
      bucketName,
      file.originalname,
      file.path,
      (err: any, etag: any) => {
        if (err) return reject(err);

        // Optionally delete the local file after uploading to MinIO
        fs.unlink(file.path, (unlinkErr: any) => {
          if (unlinkErr) console.log("Error deleting local file:", unlinkErr);
        });

        resolve(etag);
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
