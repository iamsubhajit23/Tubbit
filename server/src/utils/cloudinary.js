import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_KEY_SECRET,
});

const uploadOnCloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;

    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
      secure: true,
    });
    // console.log(
    //   "File succesfully uploaded on Cloudinary with this Link: ",
    //   response.url
    // );
    fs.unlinkSync(localfilepath);
    return response;
  } catch (error) {
    fs.unlinkSync(localfilepath);
    return null;
  }
};

const deleteFromCloudinary = async (public_id, resource_type) => {
  try {
    if (!public_id) {
      console.log("No public_id provided for deletion");
    }
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type || "image",
    });
    console.log(`Delete ${resource_type} from cloudinary:`, result);
    return result;
  } catch (error) {
    console.error(`Error deleting ${resource_type} from Cloudinary:`, error.message);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
