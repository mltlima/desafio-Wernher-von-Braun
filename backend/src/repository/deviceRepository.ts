import Device, { IDevice } from '../models/Device';

class DeviceRepository {
  async create(deviceData: IDevice) {
    const device = new Device(deviceData);
    await device.save();
    return device;
  }

  async findAll() {
    return Device.find();
  }

  async findById(id: string) {
    return Device.findById(id);
  }

  async updateById(id: string, updateData: Partial<IDevice>) {
    return Device.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id: string) {
    return Device.findByIdAndDelete(id);
  }
}

export default new DeviceRepository();
