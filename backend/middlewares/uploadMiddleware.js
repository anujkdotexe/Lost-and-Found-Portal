const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'fallback',
    api_key: process.env.CLOUDINARY_API_KEY || 'fallback',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'fallback'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lostandfound',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const upload = multer({ storage });

module.exports = upload;
