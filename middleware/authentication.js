import { isTokenValid } from '../lib/utils.js';
import UnauthenticatedError from '../errors/unauthenticated.js';

export const protectedRoute = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthenticatedError('Authentication Invalid');
    }

    const token = authHeader.split(' ')[1];

    const decodedToken = isTokenValid(token);
    if (!decodedToken) {
      throw new UnauthenticatedError('Token Invalid');
    }
    // alternative code
    // const user= await User.findById(decodedToken.userId).select('-password');
    // req.user=user;
    req.user = {
      userId: decodedToken.userId,
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
};

export const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    throw new UnauthenticatedError('Authentication Invalid');
  }

  next();
};
