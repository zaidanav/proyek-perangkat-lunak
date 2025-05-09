import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    users: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    trained_by: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn()
    },
    $disconnect: jest.fn()
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('test-token'),
  verify: jest.fn()
}));

// Mock cloudinary
jest.mock('../config/cloudinary', () => ({
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

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123')
}));

describe('MemberController', () => {
  let prismaInstance;
  
  beforeEach(() => {
    // Get mock instance
    prismaInstance = new PrismaClient();
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Default JWT verify for admin
    jwt.verify.mockReturnValue({ userId: 1, role: 'admin' });
  });

  // Test for GET /members
  describe('GET /members', () => {
    test('should return paginated members for admin', async () => {
      // Mock counting total members
      prismaInstance.users.count.mockResolvedValue(25);
      
      // Mock finding members
      prismaInstance.users.findMany.mockResolvedValue([
        {
          id: 1,
          email: 'member1@example.com',
          username: 'member1',
          name: 'Member One',
          role: 'member',
          avatar: 'https://test-url.com/avatar1.jpg'
        },
        {
          id: 2,
          email: 'member2@example.com',
          username: 'member2',
          name: 'Member Two',
          role: 'member',
          avatar: 'https://test-url.com/avatar2.jpg'
        }
      ]);
      
      const res = await request(app)
        .get('/members?page=1&limit=10')
        .set('Cookie', ['token=admin-token']);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body).toHaveProperty('pagination');
      expect(prismaInstance.users.findMany).toHaveBeenCalled();
    });

    test('should filter members by role', async () => {
      // Mock counting filtered members
      prismaInstance.users.count.mockResolvedValue(15);
      
      // Mock finding filtered members
      prismaInstance.users.findMany.mockResolvedValue([
        {
          id: 3,
          email: 'trainer1@example.com',
          username: 'trainer1',
          name: 'Trainer One',
          role: 'trainer',
          avatar: 'https://test-url.com/avatar3.jpg'
        }
      ]);
      
      const res = await request(app)
        .get('/members?page=1&limit=10&filterBy=trainer')
        .set('Cookie', ['token=admin-token']);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0]).toHaveProperty('role', 'trainer');
      expect(prismaInstance.users.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            role: 'trainer'
          })
        })
      );
    });

    test('should handle search query', async () => {
      // Mock finding searched members
      prismaInstance.users.findMany.mockResolvedValue([
        {
          id: 1,
          email: 'john@example.com',
          username: 'john',
          name: 'John Doe',
          role: 'member'
        }
      ]);
      
      const res = await request(app)
        .get('/members?search=john')
        .set('Cookie', ['token=admin-token']);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0]).toHaveProperty('name', 'John Doe');
      expect(prismaInstance.users.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { name: { contains: 'john', mode: 'insensitive' } }
            ])
          })
        })
      );
    });

    test('should return 401 if not authenticated', async () => {
      const res = await request(app).get('/members');
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Unauthorized');
    });
  });

  // Test for POST /add-member
  describe('POST /add-member', () => {
    test('should add a new member successfully', async () => {
      // Email not yet used
      prismaInstance.users.findUnique
        .mockResolvedValueOnce(null) // for email check
        .mockResolvedValueOnce(null); // for phone check
      
      // Successfully create user
      prismaInstance.users.create.mockResolvedValue({
        id: 5,
        email: 'newmember@example.com',
        username: 'newmember',
        name: 'New Member',
        role: 'member',
        avatar: 'https://test-url.com/avatar5.jpg'
      });
      
      const res = await request(app)
        .post('/add-member')
        .set('Cookie', ['token=admin-token'])
        .field('email', 'newmember@example.com')
        .field('username', 'newmember')
        .field('name', 'New Member')
        .field('role', 'member')
        .field('phone', '081234567890')
        .attach('img_file', Buffer.from('test image'), 'test.jpg');
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Member berhasil ditambahkan');
      expect(res.body).toHaveProperty('defaultPassword');
      expect(prismaInstance.users.create).toHaveBeenCalled();
    });

    test('should return 409 if email already exists', async () => {
      // Email already used
      prismaInstance.users.findUnique.mockResolvedValue({
        id: 1,
        email: 'existing@example.com'
      });
      
      const res = await request(app)
        .post('/add-member')
        .set('Cookie', ['token=admin-token'])
        .field('email', 'existing@example.com')
        .field('username', 'newmember')
        .field('name', 'New Member')
        .field('role', 'member')
        .field('phone', '081234567890')
        .attach('img_file', Buffer.from('test image'), 'test.jpg');
      
      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message', 'Email sudah digunakan');
      expect(prismaInstance.users.create).not.toHaveBeenCalled();
    });

    test('should return 400 if no image is provided', async () => {
      prismaInstance.users.findUnique.mockResolvedValue(null);
      
      const res = await request(app)
        .post('/add-member')
        .set('Cookie', ['token=admin-token'])
        .field('email', 'newmember@example.com')
        .field('username', 'newmember')
        .field('name', 'New Member')
        .field('role', 'member')
        .field('phone', '081234567890');
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Image Wajib ada');
    });

    test('should return 403 if not admin', async () => {
      // Override JWT verify for this test
      jwt.verify.mockReturnValue({ userId: 2, role: 'member' });
      
      const res = await request(app)
        .post('/add-member')
        .set('Cookie', ['token=member-token'])
        .field('email', 'newmember@example.com')
        .field('username', 'newmember')
        .field('name', 'New Member')
        .field('role', 'member')
        .attach('img_file', Buffer.from('test image'), 'test.jpg');
      
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error', 'Forbidden: Insufficient permissions');
    });
  });

  // Test for GET /get-member/:id
  describe('GET /get-member/:id', () => {
    test('should return member by ID', async () => {
      prismaInstance.users.findUnique.mockResolvedValue({
        id: 1,
        email: 'member@example.com',
        username: 'member',
        name: 'Member Name',
        role: 'member',
        avatar: 'https://test-url.com/avatar.jpg'
      });
      
      const res = await request(app).get('/get-member/1');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('email', 'member@example.com');
      expect(prismaInstance.users.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    test('should return 404 if member not found', async () => {
      prismaInstance.users.findUnique.mockResolvedValue(null);
      
      const res = await request(app).get('/get-member/999');
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'User tidak ditemukan');
    });
  });

  // Test for DELETE /delete-member/:id
  describe('DELETE /delete-member/:id', () => {
    test('should delete member successfully', async () => {
      // Mock finding user
      prismaInstance.users.findUnique.mockResolvedValue({
        id: 3,
        email: 'delete@example.com',
        username: 'delete',
        role: 'member',
        avatar: 'https://res.cloudinary.com/test-cloud/members/image.jpg'
      });
      
      // Mock deleting user
      prismaInstance.users.delete.mockResolvedValue({ id: 3 });
      
      const res = await request(app)
        .delete('/delete-member/3')
        .set('Cookie', ['token=admin-token']);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Member berhasil dihapus');
      expect(prismaInstance.users.delete).toHaveBeenCalledWith({
        where: { id: 3 }
      });
    });

    test('should return 404 if member not found', async () => {
      prismaInstance.users.findUnique.mockResolvedValue(null);
      
      const res = await request(app)
        .delete('/delete-member/999')
        .set('Cookie', ['token=admin-token']);
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'User tidak ditemukan');
      expect(prismaInstance.users.delete).not.toHaveBeenCalled();
    });

    test('should return 403 if not admin', async () => {
      // Override JWT verify for this test
      jwt.verify.mockReturnValue({ userId: 2, role: 'member' });
      
      const res = await request(app)
        .delete('/delete-member/3')
        .set('Cookie', ['token=member-token']);
      
      expect(res.status).toBe(403);
      expect(prismaInstance.users.delete).not.toHaveBeenCalled();
    });
  });

  // Test for PUT /update-member/:id
  describe('PUT /update-member/:id', () => {
    test('should update member successfully', async () => {
      // Mock checking for existing phone number
      prismaInstance.users.findUnique.mockResolvedValue(null);
      
      // Mock update
      prismaInstance.users.update.mockResolvedValue({
        id: 2,
        name: 'Updated Name',
        phone_no: '087654321098'
      });
      
      const res = await request(app)
        .put('/update-member/2')
        .set('Cookie', ['token=admin-token'])
        .send({
          name: 'Updated Name',
          phone_no: '087654321098'
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Member berhasil diupdate');
      expect(prismaInstance.users.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: {
          name: 'Updated Name',
          phone_no: '087654321098'
        }
      });
    });

    test('should return 409 if phone number is already used', async () => {
      // Mock finding existing phone number
      prismaInstance.users.findUnique.mockResolvedValue({
        id: 3, // Different ID than the one being updated
        phone_no: '087654321098'
      });
      
      const res = await request(app)
        .put('/update-member/2')
        .set('Cookie', ['token=admin-token'])
        .send({
          name: 'Updated Name',
          phone_no: '087654321098'
        });
      
      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message', 'Nomor telepon sudah digunakan oleh member lain');
      expect(prismaInstance.users.update).not.toHaveBeenCalled();
    });
  });

  // Test for GET /profile
  describe('GET /profile', () => {
    test('should return authenticated user profile', async () => {
      // Mock JWT verify
      jwt.verify.mockReturnValue({ userId: 2, role: 'member' });
      
      // Mock finding user
      prismaInstance.users.findUnique.mockResolvedValue({
        id: 2,
        email: 'member@example.com',
        username: 'member',
        name: 'Member Name',
        role: 'member',
        avatar: 'https://test-url.com/avatar.jpg',
        phone_no: '081234567890'
      });
      
      const res = await request(app)
        .get('/profile')
        .set('Cookie', ['token=member-token']);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 2);
      expect(res.body).toHaveProperty('email', 'member@example.com');
      expect(prismaInstance.users.findUnique).toHaveBeenCalledWith({
        where: { id: 2 }
      });
    });

    test('should return 401 if not authenticated', async () => {
      const res = await request(app).get('/profile');
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Unauthorized');
    });
  });

  // Test for PUT /update-profile
  describe('PUT /update-profile', () => {
    test('should update user profile with new image', async () => {
      // Mock JWT verify
      jwt.verify.mockReturnValue({ userId: 2, role: 'member' });
      
      // Mock finding current user for old image check
      prismaInstance.users.findFirst.mockResolvedValue({
        id: 2,
        avatar: 'https://res.cloudinary.com/test-cloud/members/old-image.jpg'
      });
      
      // Mock update
      prismaInstance.users.update.mockResolvedValue({
        id: 2,
        username: 'updatedusername',
        name: 'Updated User',
        avatar: 'https://test-url.com/new-avatar.jpg',
        phone_no: '089876543210'
      });
      
      const res = await request(app)
        .put('/update-profile')
        .set('Cookie', ['token=member-token'])
        .field('username', 'updatedusername')
        .field('name', 'Updated User')
        .field('phone_no', '089876543210')
        .attach('img_file', Buffer.from('new image'), 'new-avatar.jpg');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Profile berhasil diupdate');
      expect(prismaInstance.users.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: expect.objectContaining({
          username: 'updatedusername',
          name: 'Updated User',
          avatar: expect.any(String),
          phone_no: '089876543210'
        })
      });
    });

    test('should update profile without image', async () => {
      // Mock JWT verify
      jwt.verify.mockReturnValue({ userId: 2, role: 'member' });
      
      // Mock update
      prismaInstance.users.update.mockResolvedValue({
        id: 2,
        username: 'updatedusername',
        name: 'Updated User',
        phone_no: '089876543210'
      });
      
      const res = await request(app)
        .put('/update-profile')
        .set('Cookie', ['token=member-token'])
        .send({
          username: 'updatedusername',
          name: 'Updated User',
          phone_no: '089876543210'
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Profile berhasil diupdate');
      expect(prismaInstance.users.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: {
          username: 'updatedusername',
          name: 'Updated User',
          phone_no: '089876543210'
        }
      });
    });

    test('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .put('/update-profile')
        .send({
          username: 'updatedusername',
          name: 'Updated User'
        });
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Unauthorized');
    });
  });

  // Test for POST /check-phone
  describe('POST /check-phone', () => {
    test('should return isUsed=true if phone number is already used by another user', async () => {
      // Mock JWT verify
      jwt.verify.mockReturnValue({ userId: 2, role: 'member' });
      
      // Mock finding phone number used by another user
      prismaInstance.users.findUnique.mockResolvedValue({
        id: 3, // Different ID than the logged in user
        phone_no: '081234567890'
      });
      
      const res = await request(app)
        .post('/check-phone')
        .set('Cookie', ['token=member-token'])
        .send({ phone_no: '081234567890' });
      
      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('isUsed', true);
    });

    test('should return isUsed=false if phone number is not used', async () => {
      // Mock JWT verify
      jwt.verify.mockReturnValue({ userId: 2, role: 'member' });
      
      // Mock no user found with this phone number
      prismaInstance.users.findUnique.mockResolvedValue(null);
      
      const res = await request(app)
        .post('/check-phone')
        .set('Cookie', ['token=member-token'])
        .send({ phone_no: '081234567890' });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('isUsed', false);
    });

    test('should return isUsed=false if phone number is used by the same user', async () => {
      // Mock JWT verify
      jwt.verify.mockReturnValue({ userId: 2, role: 'member' });
      
      // Mock finding phone number used by the same user
      prismaInstance.users.findUnique.mockResolvedValue({
        id: 2, // Same ID as the logged in user
        phone_no: '081234567890'
      });
      
      const res = await request(app)
        .post('/check-phone')
        .set('Cookie', ['token=member-token'])
        .send({ phone_no: '081234567890' });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('isUsed', false);
    });
  });
});