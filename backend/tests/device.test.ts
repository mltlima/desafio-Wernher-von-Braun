import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import User from '../src/models/User';
import Device from '../src/models/Device';

let token: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);

  // Limpar coleções de usuários e dispositivos
  await User.deleteMany({});
  await Device.deleteMany({});

  // Registrar um novo usuário e obter o token JWT
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123'
    });

  token = res.body.token;
  console.log('Register Response:', res.body);
  console.log('Login Token:', token);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Device Endpoints', () => {
  it('should create a device', async () => {
    const res = await request(app)
      .post('/api/devices')
      .set('Authorization', `Bearer ${token}`)
      .send({
        identifier: 'device1',
        description: 'Device 1',
        manufacturer: 'Device Manufacturer',
        url: 'http://example.com/device1',
        commands: [
          {
            command: 'read',
            parameters: []
          }
        ]
      });
    console.log('Create Device Response:', res.body);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('identifier', 'device1');
  });

  it('should get all devices', async () => {
    const res = await request(app)
      .get('/api/devices')
      .set('Authorization', `Bearer ${token}`);
    console.log('Get All Devices Response:', res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a device by id', async () => {
    const device = await request(app)
      .post('/api/devices')
      .set('Authorization', `Bearer ${token}`)
      .send({
        identifier: 'device2',
        description: 'Device 2',
        manufacturer: 'Device Manufacturer',
        url: 'http://example.com/device2',
        commands: [
          {
            command: 'read',
            parameters: []
          }
        ]
      });

    const res = await request(app)
      .get(`/api/devices/${device.body._id}`)
      .set('Authorization', `Bearer ${token}`);
    console.log('Get Device by ID Response:', res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('identifier', 'device2');
  });

  it('should update a device by id', async () => {
    const device = await request(app)
      .post('/api/devices')
      .set('Authorization', `Bearer ${token}`)
      .send({
        identifier: 'device3',
        description: 'Device 3',
        manufacturer: 'Device Manufacturer',
        url: 'http://example.com/device3',
        commands: [
          {
            command: 'read',
            parameters: []
          }
        ]
      });

    const res = await request(app)
      .put(`/api/devices/${device.body._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Updated Device 3',
        manufacturer: 'Updated Manufacturer',
        url: 'http://example.com/updateddevice3'
      });
    console.log('Update Device Response:', res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('description', 'Updated Device 3');
  });

  it('should delete a device by id', async () => {
    const device = await request(app)
      .post('/api/devices')
      .set('Authorization', `Bearer ${token}`)
      .send({
        identifier: 'device4',
        description: 'Device 4',
        manufacturer: 'Device Manufacturer',
        url: 'http://example.com/device4',
        commands: [
          {
            command: 'read',
            parameters: []
          }
        ]
      });

    const res = await request(app)
      .delete(`/api/devices/${device.body._id}`)
      .set('Authorization', `Bearer ${token}`);
    console.log('Delete Device Response:', res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Device deleted');
  });

  it('should not create a device without auth token', async () => {
    const res = await request(app)
      .post('/api/devices')
      .send({
        identifier: 'device5',
        description: 'Device 5',
        manufacturer: 'Device Manufacturer',
        url: 'http://example.com/device5',
        commands: [
          {
            command: 'read',
            parameters: []
          }
        ]
      });
    console.log('Create Device without Token Response:', res.body);
    expect(res.statusCode).toEqual(401);
  });
});
