import express from 'express';
import { createAppointment, getAppointments, updateStatus } from '../controllers/appointmentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.use(verifyToken); 

router.post('/', createAppointment);
router.get('/', getAppointments);

router.patch('/:id/status', updateStatus);

export default router;