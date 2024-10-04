import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getjobs, deletejobs, updatejob } from '../controllers/job.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getjobs', verifyToken, getjobs); // Update route here
router.delete('/deletejobs/:jobId/:userId', verifyToken, deletejobs); // Fix method here
router.put('/updatejob/:jobId/:userId', verifyToken, updatejob); // Fix method here

export default router;

