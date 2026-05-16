import { isTokenValid } from '../lib/utils.js';
import UnauthenticatedError from '../errors/unauthenticated.js';

export const protectedRoute = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication Invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = isTokenValid(token);
    req.user = {
      userId: decodedToken.userId,
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Invalid Token');
  }
};

export const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    throw new UnauthenticatedError('Authentication Invalid');
  }

  next();
};
