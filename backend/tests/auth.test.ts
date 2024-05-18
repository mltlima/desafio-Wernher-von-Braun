import request from 'supertest';
import app from '../src/server';
import mongoose from 'mongoose';

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });

describe('Auth Endpoints', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login a user with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should not login a user with non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(404);
  });
});
