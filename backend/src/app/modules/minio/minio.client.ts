const Minio = require("minio");

// Initialize the MinIO client
const minioClient = new Minio.Client({
  endPoint: "localhost", // Your MinIO server endpoint
  port: 9000, // Your MinIO server port (9000 for default)
  useSSL: false, // true if SSL is enabled, false otherwise
  accessKey: process.env.MINIO_ACCESS_KEY, // Your MinIO access key
  secretKey: process.env.MINIO_SECRET_KEY, // Your MinIO secret key
});

module.exports = minioClient;
