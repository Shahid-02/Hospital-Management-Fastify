import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log(api_key, "name");

const uploadOnCloudinary = async (filePath: string) => {
  try {
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // Uncomment if you want to remove the local file after uploading
    // fs.unlinkSync(filePath);

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Uncomment if you want to remove the local file after error
    // fs.unlinkSync(filePath);

    return null;
  }
};

export { uploadOnCloudinary };
