import { Request, Response } from "express";

const MinioServices = require("./minio.service");

// Controller to handle file upload
const uploadFile = async (req: Request, res: Response) => {
  const file = req.file;

  try {
    const etag = await MinioServices.uploadFileToMinIO(
      process.env.MINIO_BUCKET,
      file
    );
    res.send(`File uploaded successfully to "codebucket". ETag: ${etag}`);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file to MinIO");
  }
};

// Controller to handle file download
const downloadFile = async (req: Request, res: Response) => {
  const { fileName } = req.params;

  try {
    // Check if the file exists in the bucket
    await MinioServices.checkFileExistsInMinIO(
      process.env.MINIO_BUCKET,
      fileName
    );
    console.log("File exists, proceeding with download");

    // If it exists, download the file
    const fileStream = await MinioServices.downloadFileFromMinIO(
      process.env.MINIO_BUCKET,
      fileName
    );
    // fileStream.pipe(res);
    let fileData = "";
    fileStream.on("data", (chunk) => {
      fileData += chunk.toString(); // Collect data chunk by chunk
    });

    fileStream.on("end", () => {
      console.log("File content:", fileData); // Log file content to the terminal
      res.send(fileData); // Also send the file content as a response
    });
  } catch (error) {
    console.error("Error:", error);
    if (error.code === "NoSuchKey") {
      res.status(404).send("File not found in MinIO");
    } else {
      res.status(500).send("Error downloading file from MinIO");
    }
  }
};

module.exports = {
  uploadFile,
  downloadFile,
};
