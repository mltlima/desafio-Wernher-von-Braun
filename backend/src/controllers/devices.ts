import { Request, Response } from 'express';
import DeviceService from '../services/deviceService';
import Joi from 'joi';

const deviceSchema = Joi.object({
  identifier: Joi.string().required(),
  description: Joi.string().required(),
  manufacturer: Joi.string().required(),
  url: Joi.string().uri().required(),
  commands: Joi.array().items(Joi.object({
    command: Joi.string().required(),
    parameters: Joi.array().items(Joi.string()).required()
  })).required()
});

export const getDevices = async (req: Request, res: Response) => {
  try {
    const devices = await DeviceService.getAllDevices();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
};

export const addDevice = async (req: Request, res: Response) => {
  const { error } = deviceSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const device = await DeviceService.createDevice(req.body);
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add device' });
  }
};

export const getDeviceDetails = async (req: Request, res: Response) => {
    try {
    const device = await DeviceService.getDeviceById(req.params.id);
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json(device);
    } catch (err) {
    res.status(500).json({ error: 'Failed to fetch device details' });
    }
};

export const updateDevice = async (req: Request, res: Response) => {
const { error } = deviceSchema.validate(req.body);
if (error) return res.status(400).json({ error: error.details[0].message });

try {
  const device = await DeviceService.updateDevice(req.params.id, req.body);
  if (!device) return res.status(404).json({ error: 'Device not found' });
  res.json(device);
} catch (err) {
  res.status(500).json({ error: 'Failed to update device' });
}
};

export const deleteDevice = async (req: Request, res: Response) => {
try {
  const device = await DeviceService.deleteDevice(req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });
  res.json({ message: 'Device deleted' });
} catch (err) {
  res.status(500).json({ error: 'Failed to delete device' });
}
};
