import { Router } from 'express';
import { getDevices, addDevice, updateDevice, deleteDevice, getDeviceDetails } from '../controllers/devices';

const router = Router();

router.get('/', getDevices);
router.post('/', addDevice);
router.get('/:id', getDeviceDetails);
router.put('/:id', updateDevice);
router.delete('/:id', deleteDevice);

export default router;
