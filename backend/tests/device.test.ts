import request from 'supertest';
import app from '../src/server';
import mongoose from 'mongoose';

let token: string;
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
  
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      });
    token = res.body.token;
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
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
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('identifier', 'device1');
  });

  it('should get all devices', async () => {
    const res = await request(app)
      .get('/api/devices')
      .set('Authorization', `Bearer ${token}`);
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
        url: 'http://example.com/updateddevice3',
        commands: [
          {
            command: 'read',
            parameters: []
          }
        ]
      });
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
    expect(res.statusCode).toEqual(401);
  });
});
