import DeviceRepository from '../repository/deviceRepository';
import { IDevice } from '../models/Device';

class DeviceService {
  async createDevice(deviceData: IDevice) {
    return DeviceRepository.create(deviceData);
  }

  async getAllDevices() {
    return DeviceRepository.findAll();
  }

  async getDeviceById(id: string) {
    return DeviceRepository.findById(id);
  }

  async updateDevice(id: string, updateData: Partial<IDevice>) {
    return DeviceRepository.updateById(id, updateData);
  }

  async deleteDevice(id: string) {
    return DeviceRepository.deleteById(id);
  }
}

export default new DeviceService();
