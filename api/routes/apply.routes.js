import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createApply, getapply } from '../controllers/apply.controller.js';

const router = express.Router();

// Route for creating a new application
router.post('/createApply',verifyToken, createApply);
router.get('/getapply', getapply);

export default router;
