import express from 'express';

const router = express.Router();
import {
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
  createJob,
} from '../controllers/jobs.js';

router.get('/', getAllJobs);
router.post('/', createJob);
router.get('/:id', getJob);
router.put('/', updateJob);
router.delete('/:id', deleteJob);

export default router;
