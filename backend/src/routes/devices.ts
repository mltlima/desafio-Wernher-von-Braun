import { Router } from 'express';
import { getDevices, addDevice, updateDevice, deleteDevice, getDeviceDetails } from '../controllers/devices';
import auth from '../middleware/auth';

const router = Router();

router.get('/', auth, getDevices);
router.post('/', auth, addDevice);
router.get('/:id', auth, getDeviceDetails);
router.put('/:id', auth, updateDevice);
router.delete('/:id', auth, deleteDevice);

export default router;
