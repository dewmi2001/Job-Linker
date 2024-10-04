// routes/checkout.js

import { Router } from 'express';
const router = Router();
import { createOrder, processPayment } from '../controllers/checkoutController';

// Route for creating a new order
router.post('/create-order', createOrder);

// Route for processing payment
router.post('/process-payment', processPayment);

export default router;
