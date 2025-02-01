import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "./s3Client.js";

const deleteFromS3 = async (imageUrl) => {
  try {
    if (!imageUrl) {
      console.error("No image URL provided for deletion.");
      return false;
    }

    // Extract S3 Key from image URL
    const url = new URL(imageUrl);
    const s3Key = url.pathname.substring(1); // Remove the leading "/"

    // Prepare and send the delete request
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
    });

    await s3.send(command);
    console.log(`Image deleted from S3: ${s3Key}`);
    return true;
  } catch (error) {
    console.error("Error deleting image from S3:", error);
    return false;
  }
};

export default deleteFromS3;
