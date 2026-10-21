import { auth, isInitialized } from '../config/firebase.js';
import { queryOne } from '../config/db.js';

/**
 * Middleware to verify Firebase ID Token from Authorization header
 */
export async function verifyAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing or malformed Authorization header'
      });
    }

    const token = authHeader.split('Bearer ')[1].trim();

    if (!isInitialized || !auth) {
      return res.status(503).json({
        success: false,
        error: 'Authentication service unavailable: Firebase Admin is not initialized'
      });
    }

    // Verify genuine Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    
    // Fetch DB profile to attach role
    const profile = await queryOne('SELECT * FROM profiles WHERE id = ?', [decodedToken.uid]);
    req.userProfile = profile || null;
    req.userRole = profile?.role || 'user';
    return next();
  } catch (error) {
    console.error('❌ Token Verification Failed:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired Firebase authentication token'
    });
  }
}

/**
 * Optional Auth middleware - continues if token is present or omitted
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  return verifyAuth(req, res, next);
}

/**
 * Role-Based Access Control Guard
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Login required' });
    }

    const currentRole = req.userRole || req.userProfile?.role || 'user';
    if (!allowedRoles.includes(currentRole)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Requires one of [${allowedRoles.join(', ')}] permissions`
      });
    }

    next();
  };
}
