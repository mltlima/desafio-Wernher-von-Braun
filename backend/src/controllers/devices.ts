import { Request, Response } from 'express';
import Device from '../models/Device';

export const getDevices = async (req: Request, res: Response) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
};

export const addDevice = async (req: Request, res: Response) => {
  try {
    const device = new Device(req.body);
    await device.save();
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add device' });
  }
};

export const getDeviceDetails = async (req: Request, res: Response) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch device details' });
  }
};

export const updateDevice = async (req: Request, res: Response) => {
  try {
    const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update device' });
  }
};

export const deleteDevice = async (req: Request, res: Response) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json({ message: 'Device deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete device' });
  }
};
