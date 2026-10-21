import express from 'express';
import { imagekit, publicKey, urlEndpoint } from '../config/imagekit.js';

const router = express.Router();

/**
 * GET /api/upload/auth
 * Generate ImageKit client-side authentication parameters
 */
router.get('/auth', (req, res) => {
  try {
    if (!imagekit) {
      return res.status(503).json({
        success: false,
        error: 'ImageKit is not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in .env'
      });
    }

    const authParams = imagekit.getAuthenticationParameters();
    res.json({
      success: true,
      data: {
        ...authParams,
        publicKey,
        urlEndpoint
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/upload/image
 * Server-side image upload to ImageKit
 * Accepts: { file: base64/dataURI/URL, fileName: string, folder: string }
 */
router.post('/image', async (req, res, next) => {
  try {
    const { file, fileName, folder = '/vahan-rentals' } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'File content (base64 or image URL) is required for upload'
      });
    }

    const cleanFileName = fileName || `vehicle_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;

    if (!imagekit) {
      // If ImageKit is not yet configured in .env, return direct data or informative error
      console.warn('⚠️ ImageKit upload requested but credentials are not configured in .env');
      return res.json({
        success: true,
        message: 'ImageKit credentials not configured; using input payload',
        data: {
          url: file.startsWith('data:') ? file : file,
          name: cleanFileName,
          fileId: `local-${Date.now()}`
        }
      });
    }

    const uploadResponse = await imagekit.upload({
      file, // Supports base64 string, Data URI, or remote HTTP URL
      fileName: cleanFileName,
      folder,
      useUniqueFileName: true
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully to ImageKit CDN',
      data: {
        url: uploadResponse.url,
        thumbnailUrl: uploadResponse.thumbnailUrl || uploadResponse.url,
        fileId: uploadResponse.fileId,
        filePath: uploadResponse.filePath,
        name: uploadResponse.name,
        size: uploadResponse.size,
        height: uploadResponse.height,
        width: uploadResponse.width
      }
    });
  } catch (error) {
    console.error('ImageKit upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload image to ImageKit'
    });
  }
});

export default router;
