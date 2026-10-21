import ImageKit from 'imagekit';
import dotenv from 'dotenv';
dotenv.config();

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || process.env.VITE_IMAGEKIT_PUBLIC_KEY || '';
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || '';
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || process.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/vahanrentals';

let imagekit = null;

if (publicKey && privateKey && urlEndpoint) {
  try {
    imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint
    });
    console.log(`🖼️ ImageKit initialized with endpoint: ${urlEndpoint}`);
  } catch (err) {
    console.warn('⚠️ ImageKit initialization warning:', err.message);
  }
} else {
  console.log('ℹ️ ImageKit credentials not configured in .env; upload endpoint ready for credentials.');
}

export { imagekit, publicKey, urlEndpoint };
export default imagekit;
