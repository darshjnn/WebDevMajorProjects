if (process.env.NODE_ENV != 'production') {
    await import('dotenv/config');
}

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Ensure environment variables are set
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
    throw new Error('Cloudinary environment variables are not set. Please check your .env file...');
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'hotelcatalogue_DEV',
        allowedFormats: ['jpg', 'jpeg', 'png'],
    },
});

// Export cloudinary instance for reuse
export { cloudinary };