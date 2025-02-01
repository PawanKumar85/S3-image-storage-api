
# AWS S3 Image Upload API

This is an API built using **Node.js** and **Express** that allows users to upload, download, update, and delete images stored in **AWS S3**. It also integrates with **MongoDB** to store image URLs and manage metadata.

## Features

- **Image Upload**: Upload images to AWS S3 and save their URLs to MongoDB.
- **Image Retrieval**: Fetch images and metadata from MongoDB.
- **Image Update**: Replace an existing image by deleting the old one from S3 and uploading a new one.
- **Image Deletion**: Delete images from both S3 and MongoDB.
- **Image Download**: Download images directly from S3.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Cloud Storage**: AWS S3
- **File Upload**: Multer (for handling file uploads)
- **Environment Variables**: dotenv
- **Docker**: Docker to provide run time environment 

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/PawanKumar85/S3-image-storage-api.git
cd S3-image-storage-api
```

### 2. Install Dependencies

Make sure you have **Node.js** and **npm** installed. Then, run:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and add the following:

```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name
MONGODB_URL=your_mongodb_connection_string (optional in case of docker-compose)
PORT=5000
NAME=s3-image-upload
```

### 4. Start the Server

Run the server with the following command:

```bash
npm run start
```

The server will be running on `http://localhost:5000` (or any port defined in your `.env` file).

## API Endpoints

### 1. **Upload Image**

- **Endpoint**: `POST /api/images/upload`
- **Description**: Upload an image to AWS S3 and store the URL in MongoDB.
- **Request**:
  - `multipart/form-data` with a field named `image` (file).
- **Response**:
  - `201 Created` with image details on success.
  - `400 Bad Request` if no file is uploaded.
  - `500 Internal Server Error` on server issues.

### 2. **Get All Images**

- **Endpoint**: `GET /api/images`
- **Description**: Retrieve all images from MongoDB.
- **Response**:
  - `200 OK` with an array of image objects.
  - `500 Internal Server Error` on server issues.

### 3. **Get Image by ID**

- **Endpoint**: `GET /api/images/:id`
- **Description**: Retrieve a specific image by its ID from MongoDB.
- **Response**:
  - `200 OK` with image details.
  - `404 Not Found` if the image does not exist.
  - `500 Internal Server Error` on server issues.

### 4. **Update Image**

- **Endpoint**: `PUT /api/images/:id`
- **Description**: Update an existing image by deleting the old image from S3 and uploading a new one.
- **Request**:
  - `multipart/form-data` with a field named `image` (file).
- **Response**:
  - `200 OK` with updated image details.
  - `404 Not Found` if the image does not exist.
  - `400 Bad Request` if no file is uploaded.
  - `500 Internal Server Error` on server issues.

### 5. **Delete Image**

- **Endpoint**: `DELETE /api/images/:id`
- **Description**: Delete an image from both S3 and MongoDB.
- **Response**:
  - `200 OK` on successful deletion.
  - `404 Not Found` if the image does not exist.
  - `500 Internal Server Error` on server issues.

### 6. **Download Image**

- **Endpoint**: `GET /api/images/:id/download`
- **Description**: Download an image directly from S3.
- **Response**:
  - `200 OK` with the image file.
  - `404 Not Found` if the image does not exist or the S3 key is incorrect.
  - `500 Internal Server Error` on server issues.

## AWS S3 Setup

1. **Create an S3 Bucket**: 
   - Go to the AWS S3 Console and create a new S3 bucket.
   - Make sure the bucket is in the correct region and is set up for public or private access based on your needs.
   - Copy the **Bucket Name** and **Region** for the `.env` file configuration.

2. **Set Permissions**:
   - Ensure that the AWS IAM user has the correct permissions to interact with S3 (e.g., `s3:PutObject`, `s3:GetObject`, and `s3:DeleteObject`).

## MongoDB Setup

- You will need a MongoDB instance (either locally or via a service like MongoDB Atlas).
- Ensure the MongoDB connection string is correct in the `.env` file.

## Code Explanation

### 1. **Image Model (`models/image.model.js`)**

The `Image` schema defines the structure of image data in MongoDB. It contains two fields:

- `imageUrl`: A string that holds the URL of the uploaded image on S3.
- `uploadedAt`: A date field that stores when the image was uploaded (defaults to the current date).

### 2. **File Upload Handling (`utils/multerConfig.js`)**

Multer is configured to handle in-memory storage for file uploads. This allows the files to be directly uploaded to S3 without saving them to the server.

### 3. **S3 Client Configuration (`utils/s3Client.js`)**

The AWS SDK is configured to use credentials and region details stored in environment variables to interact with S3.

### 4. **Image Upload (`controllers/upload.controller.js`)**

- `createImage`: Handles image upload to S3 and saving the image URL to MongoDB.
- `getAllImages`: Retrieves all images stored in MongoDB.
- `getImageById`: Fetches a specific image by its ID.
- `updateImage`: Deletes the old image from S3, uploads a new one, and updates the MongoDB entry.
- `deleteImage`: Deletes the image from both S3 and MongoDB.
- `downloadImage`: Streams the image from S3 to the client for download.

### 5. **Express Router (`routes/upload.routes.js`)**

Defines the routes for handling image-related requests: upload, fetch, update, delete, and download.

## Conclusion

This API provides full CRUD (Create, Read, Update, Delete) functionality for images, integrating **AWS S3** for cloud storage and **MongoDB** for metadata storage.

---

Feel free to contribute or modify the API to fit your needs. If you encounter any issues, feel free to open an issue on GitHub.
