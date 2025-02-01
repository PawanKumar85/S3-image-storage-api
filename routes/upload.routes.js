import { Router } from "express";
import upload from "../utils/multerConfig.js";
import {
  createImage,
  deleteImage,
  getAllImages,
  getImageById,
  updateImage,
  downloadImage,
} from "../controllers/upload.controller.js";

const router = Router();

router.post("/upload", upload.single("image"), createImage);
router.get("/", getAllImages);
router.get("/:id", getImageById);
router.put("/:id", upload.single("image"), updateImage);
router.delete("/:id", deleteImage);
router.get("/:id/download", downloadImage);

export default router;
