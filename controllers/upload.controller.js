import Image from "../models/image.model.js";
import uploadToS3 from "../utils/s3Upload.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../utils/s3Client.js";
import deleteFromS3 from "../utils/s3Delete.js";

// 🟢 Create Image
export const createImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Upload to S3
    const imageUrl = await uploadToS3(req.file);
    if (!imageUrl) {
      return res.status(500).json({ message: "Failed to upload image to S3" });
    }

    // Save URL to MongoDB
    const newImage = new Image({ imageUrl });
    const savedImage = await newImage.save();

    return res.status(201).json({
      message: "Image uploaded successfully",
      image: savedImage,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 🔵 Get All Images
export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find();
    return res.status(200).json({
      message: "Images fetched successfully",
      total: images.length,
      images,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 🔵 Get Single Image by ID
export const getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    return res.status(200).json(image);
  } catch (error) {
    console.error("Error fetching image:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 🔴 Update Image (Delete old one, upload new one)
export const updateImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete old image from S3
    const isDeleted = await deleteFromS3(image.imageUrl);
    if (!isDeleted) {
      return res
        .status(500)
        .json({ message: "Failed to delete old image from S3" });
    }

    // Upload new image to S3
    const newImageUrl = await uploadToS3(req.file);
    if (!newImageUrl) {
      return res.status(500).json({ message: "Failed to upload new image" });
    }

    // Update in MongoDB
    image.imageUrl = newImageUrl;
    await image.save();

    return res
      .status(200)
      .json({ message: "Image updated successfully", image });
  } catch (error) {
    console.error("Error updating image:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 🟠 Delete Image (from S3 and MongoDB)
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete from S3
    const isDeleted = await deleteFromS3(image.imageUrl);
    if (!isDeleted) {
      return res
        .status(500)
        .json({ message: "Failed to delete image from S3" });
    }

    // Delete from MongoDB
    await Image.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 🟡 Download Image (from S3)
export const downloadImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Extract and decode the S3 key
    const url = new URL(image.imageUrl);
    const s3Key = decodeURIComponent(url.pathname.substring(1)); // Decode the key

    console.log("Decoded S3 Key:", s3Key); // Log the S3 key for debugging

    // Prepare the command to get the object from S3
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
    });

    const data = await s3.send(command);

    // Set the response headers for the file download
    res.setHeader("Content-Type", data.ContentType);
    res.setHeader("Content-Disposition", `attachment; filename="${s3Key}"`);

    // Pipe the data from S3 directly to the response
    data.Body.pipe(res);
  } catch (error) {
    console.error("Error downloading image:", error);
    return res.status(500).json({ message: "Error downloading image" });
  }
};