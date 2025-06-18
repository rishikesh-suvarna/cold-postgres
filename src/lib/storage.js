import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } from '../config/index.js';

export const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToStorage = async (bucketName, key, body) => {
  try {
    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      StorageClass: 'GLACIER',
    });
    await s3.send(uploadCommand);
    console.log(`File uploaded successfully to ${bucketName}/${key}`);
  } catch (error) {
    console.error(`Error uploading file to S3: ${error.message}`);
  }
};

export default s3;
