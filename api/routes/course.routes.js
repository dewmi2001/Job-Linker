import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getcourse, deletecourse, updatecourse } from '../controllers/course.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getcourse', verifyToken, getcourse); // Update route here
router.delete('/deletecourse/:courseId/:userId', verifyToken, deletecourse); // Fix method here
router.put('/updatecourse/:courseId/:userId', verifyToken, updatecourse); // Fix method here

export default router;

