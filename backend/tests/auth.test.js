import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    users: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    },
    $transaction: jest.fn(cb => Promise.resolve(cb())),
    $disconnect: jest.fn()
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
  compare: jest.fn()
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('test-token'),
  verify: jest.fn()
}));

// Mock cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn().mockImplementation((options, callback) => ({
        end: (buffer) => callback(null, { secure_url: 'https://test-url.com/avatar.jpg' })
      })),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' })
    }
  }
}));

describe('AuthController', () => {
  let prismaInstance;
  
  beforeEach(() => {
    // Get mock instance
    prismaInstance = new PrismaClient();
    
    // Reset mocks
    jest.clearAllMocks();
  });

  // Test for register endpoint
  describe('POST /auth/register', () => {
    test('should register a new user successfully', async () => {
      // No existing user with this email
      prismaInstance.users.findUnique.mockResolvedValue(null);
      
      // Successfully create user
      prismaInstance.users.create.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        role: 'member',
        avatar: 'https://test-url.com/avatar.jpg'
      });
      
      const res = await request(app)
        .post('/auth/register')
        .field('email', 'test@example.com')
        .field('username', 'testuser')
        .field('name', 'Test User')
        .field('password', 'Password123')
        .field('role', 'member')
        .attach('img_file', Buffer.from('test image'), 'test.jpg');
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
      expect(res.body).toHaveProperty('user');
      expect(prismaInstance.users.create).toHaveBeenCalled();
    });

    test('should return 400 if email is already registered', async () => {
      // Existing user with this email
      prismaInstance.users.findUnique.mockResolvedValue({
        id: 1,
        email: 'existing@example.com'
      });
      
      const res = await request(app)
        .post('/auth/register')
        .field('email', 'existing@example.com')
        .field('username', 'testuser')
        .field('name', 'Test User')
        .field('password', 'Password123')
        .field('role', 'member')
        .attach('img_file', Buffer.from('test image'), 'test.jpg');
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
      expect(prismaInstance.users.create).not.toHaveBeenCalled();
    });

    test('should return 400 if validation fails', async () => {
      const res = await request(app)
        .post('/auth/register')
        .field('email', 'invalid-email')
        .field('username', 'testuser')
        .field('name', 'Test User')
        .field('password', 'pw')
        .field('role', 'member')
        .attach('img_file', Buffer.from('test image'), 'test.jpg');
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  // Test for login endpoint
  describe('POST /auth/login', () => {
    test('should login successfully with correct credentials', async () => {
      // Mock user found by email
      prismaInstance.users.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword123',
        username: 'testuser',
        name: 'Test User',
        role: 'member'
      });
      
      // Mock password comparison to succeed
      bcrypt.compare.mockResolvedValue(true);
      
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123'
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
      expect(jwt.sign).toHaveBeenCalled();
      // Check for httpOnly cookie
      expect(res.headers['set-cookie'][0]).toContain('token=');
    });

    test('should return 401 for invalid password', async () => {
      // Mock user found by email
      prismaInstance.users.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword123'
      });
      
      // Mock password comparison to fail
      bcrypt.compare.mockResolvedValue(false);
      
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });

    test('should return 401 for non-existent user', async () => {
      // Mock user not found
      prismaInstance.users.findUnique.mockResolvedValue(null);
      
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123'
        });
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });
  });

  // Test for profile endpoint
  describe('GET /auth/profile', () => {
    test('should return user profile when authenticated', async () => {
      // Mock JWT verify to return a valid user
      jwt.verify.mockReturnValue({ userId: 1, role: 'member' });
      
      // Mock finding user in database
      prismaInstance.users.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        role: 'member',
        avatar: 'https://test-url.com/avatar.jpg'
      });
      
      const res = await request(app)
        .get('/auth/profile')
        .set('Cookie', ['token=test-token']);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('email', 'test@example.com');
      expect(jwt.verify).toHaveBeenCalled();
    });

    test('should return 401 when not authenticated', async () => {
      const res = await request(app).get('/auth/profile');
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Unauthorized');
    });

    test('should return 401 when token is invalid', async () => {
      // Mock JWT verify to throw an error
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      const res = await request(app)
        .get('/auth/profile')
        .set('Cookie', ['token=invalid-token']);
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Unauthorized');
    });
  });

  // Test for logout endpoint
  describe('POST /auth/logout', () => {
    test('should logout successfully and clear cookie', async () => {
      const res = await request(app).post('/auth/logout');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Logout successful');
      
      // Check that cookie is cleared
      expect(res.headers['set-cookie'][0]).toContain('token=;');
      expect(res.headers['set-cookie'][0]).toContain('HttpOnly');
      expect(res.headers['set-cookie'][0]).toContain('Max-Age=0');
    });
  });
});