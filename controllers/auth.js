import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import BadRequestError from '../errors/bad-request.js';
import createJWT from '../models/User.js';
import UnauthenticatedError from './../errors/unauthenticated.js';
import isPasswordCorrect from '../models/User.js';
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all values');
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email already exists');
    }

    const user = await User.create({ name, email, password });
    const token = user.createJWT();

    return res.status(StatusCodes.CREATED).json({
      user: {
        name: user.name,
      },
      token,
    });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide all values');
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError('Invalid Credentials');
    }
    const isPasswordValid = user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new UnauthenticatedError('Invalid Credentials');
    }

    const token = user.createJWT();
    return res
      .status(StatusCodes.OK)
      .json({ user: { name: user.name }, token });
  } catch (error) {}
};
