import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';
import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.userId });

    return res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

export const getJob = async (req, res) => {
  const {
    params: { id: jobId },
  } = req;
  const {
    user: { userId },
  } = req;
  try {
    const job = await Job.findById({
      _id: jobId,
      createdBy: userId,
    });
    if (!job) {
      throw new NotFoundError(`No job with id ${jobId}`);
    }
    return res.status(StatusCodes.OK).json({ job });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};
export const createJob = async (req, res) => {
  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError('Please provide all values');
  }
  req.body.createdBy = req.user.userId;

  try {
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

export const updateJob = async (req, res) => {
  const {
    params: { id: jobId },
  } = req;
  const {
    user: { userId },
  } = req;
  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError('Please provide all values');
  }

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      { _id: jobId, createdBy: userId },
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedJob) {
      throw new NotFoundError(`No job with id ${jobId}`);
    }
    return res.status(StatusCodes.OK).json({ job: updatedJob });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

export const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
  } = req;
  const {
    user: { userId },
  } = req;
  try {
    const job = await Job.findByIdAndDelete({
      _id: jobId,
      createdBy: userId,
    });
    if (!job) {
      throw new NotFoundError(`No job with id ${jobId}`);
    }
    return res.status(StatusCodes.OK).json({ job });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};
