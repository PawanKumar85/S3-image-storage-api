import { Upload } from "@aws-sdk/lib-storage";
import s3 from "./s3Client.js";

const uploadToS3 = async (file) => {
  try {
    const imageKey = `Raw-images/${Date.now()}-${file.originalname}`;

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: imageKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    });

    const uploadResult = await upload.done();
    return uploadResult.Location; // Return S3 URL
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    return null;
  }
};

export default uploadToS3;
