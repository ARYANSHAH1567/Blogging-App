const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

/**
 * @description Configures Cloudinary with the necessary API credentials.
 * The `cloud_name`, `api_key`, and `api_secret` are required to authenticate with Cloudinary's services.
 * These credentials are stored in environment variables for security.
 */
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

/**
 * @description Configures the Cloudinary storage engine for Multer.
 * This setup enables Multer to store uploaded files directly on Cloudinary instead of the local filesystem.
 * The `folder` parameter specifies the Cloudinary folder where images will be stored,
 * and `allowedformats` limits the file types to images of specific formats (png, jpg, jpeg).
 * 
 * @type {CloudinaryStorage}
 */
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'BloggingApp_DEV', // Folder in Cloudinary where images will be stored
        allowedformats: ["png", "jpg", "jpeg"], // Allowed image formats
    },
});

module.exports = {
    cloudinary, // Exporting the cloudinary instance for use elsewhere in the app
    storage,    // Exporting the configured storage engine for Multer
};
