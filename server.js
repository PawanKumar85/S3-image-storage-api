import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import uploadRoutes from "./routes/upload.routes.js";

dotenv.config();
const app = express();
app.use(express.json());

connectDB();

app.use("/api/images", uploadRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (_, res) => {
  return res.status(200).json({ message: "API is running..." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
