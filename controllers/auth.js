import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import BadRequestError from '../errors/bad-request.js';
import bcrypt from 'bcrypt';
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all values');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('Email already exists');
  }
  //   hash password

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashedPassword });
  return res.status(StatusCodes.CREATED).json({ user });
};

export const login = async (req, res) => res.send('login user');
