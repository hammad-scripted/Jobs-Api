import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';
import Job from '../models/Job.js';

// ? GET ALL JOBS
export const getAllJobs = async (req, res) => {
  const jobs = await Job.find({
    createdBy: req.user.userId,
  });

  res.status(StatusCodes.OK).json({
    jobs,
    count: jobs.length,
  });
};

// ? GET SINGLE JOB
export const getJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({
    job,
  });
};

// ? CREATE JOB
export const createJob = async (req, res) => {
  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError('Please provide all values');
  }

  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({
    job,
  });
};

// ? UPDATE JOB
export const updateJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;

  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError('Please provide all values');
  }

  const updatedJob = await Job.findOneAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedJob) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({
    job: updatedJob,
  });
};

// ? DELETE JOB
export const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;

  const job = await Job.findOneAndDelete({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({
    msg: 'Job deleted successfully',
  });
};
