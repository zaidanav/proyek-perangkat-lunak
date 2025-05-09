import { jest } from '@jest/globals';

jest.spyOn(console, 'warn').mockImplementation(() => {});

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    events: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    liked_by: {
      create: jest.fn(),
      deleteMany: jest.fn(), 
      findMany: jest.fn()
    },
    $disconnect: jest.fn()
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

// Mock cloudinary
jest.mock('../config/cloudinary', () => ({
  v2: {
    uploader: {
      upload_stream: jest.fn().mockImplementation((options, callback) => ({
        end: (buffer) => callback(null, { secure_url: 'https://test-url.com/image.jpg' })
      })),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' })
    }
  }
}));

import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import { __setPrismaClient } from '../controllers/eventController'

describe('EventController', () => {
  let prismaInstance;
  
  beforeEach(() => {
    prismaInstance = new PrismaClient();
    __setPrismaClient(prismaInstance)
    jest.clearAllMocks();

    // override all events methods as mocks
    prismaInstance.events.findUnique = jest.fn();
    prismaInstance.events.findMany   = jest.fn();
    prismaInstance.events.create     = jest.fn();
    prismaInstance.events.update     = jest.fn();
    prismaInstance.events.delete     = jest.fn();
    prismaInstance.events.count      = jest.fn().mockResolvedValue(25);

    // default findMany returns two items
    prismaInstance.events.findMany.mockResolvedValue([
      {
        id: 1, title: 'Test Event 1', description: 'Description 1',
        images: 'https://test-url.com/image1.jpg',
        posted_at: new Date(), joinform: 'https://forms.example.com/1'
      },
      {
        id: 2, title: 'Test Event 2', description: 'Description 2',
        images: 'https://test-url.com/image2.jpg',
        posted_at: new Date(), joinform: 'https://forms.example.com/2'
      }
    ]);

    // override liked_by methods as mocks
    prismaInstance.liked_by.create     = jest.fn();
    prismaInstance.liked_by.deleteMany = jest.fn();
    prismaInstance.liked_by.findMany   = jest.fn();
  });

  // Test for GET /events (read events with pagination)
  describe('GET /events', () => {
    test('should return paginated events', async () => {
      const res = await request(app).get('/events?page=1&limit=10');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body).toHaveProperty('pagination');
      expect(res.body.pagination).toHaveProperty('currentPage', 1);
      expect(prismaInstance.events.findMany).toHaveBeenCalled();
    });
  });

  // Test for POST /events (create event)
  describe('POST /events', () => {
    test('should create a new event', async () => {
      prismaInstance.events.create.mockResolvedValue({
        id: 3,
        title: 'New Test Event',
        description: 'New Description',
        images: 'https://test-url.com/new-image.jpg',
        posted_at: new Date(),
        joinform: 'https://forms.example.com/new'
      });

      const res = await request(app)
        .post('/events')
        .field('title', 'New Test Event')
        .field('description', 'New Description')
        .field('joinform', 'https://forms.example.com/new')
        .attach('img_file', Buffer.from('test image'), 'test.jpg');
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('title', 'New Test Event');
      expect(prismaInstance.events.create).toHaveBeenCalled();
    });

    test('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post('/events')
        .field('description', 'Description without title')
        .attach('img_file', Buffer.from('test image'), 'test.jpg');
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  // Test for GET /eventDetails/:id
  describe('GET /eventDetails/:id', () => {
    test('should return event details by ID', async () => {
      prismaInstance.events.findUnique.mockResolvedValue({
        id: 1,
        title: 'Test Event 1',
        description: 'Description 1',
        images: 'https://test-url.com/image1.jpg',
        posted_at: new Date(),
        joinform: 'https://forms.example.com/1'
      });

      const res = await request(app).get('/eventDetails/1');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id', 1);
      expect(res.body.data).toHaveProperty('title', 'Test Event 1');
      expect(prismaInstance.events.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    test('should return 404 for non-existent event', async () => {
      prismaInstance.events.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/eventDetails/999');
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  // Test for PUT /events/:id (update event)
  describe('PUT /events/:id', () => {
    test('should update an event', async () => {
      prismaInstance.events.findUnique.mockResolvedValue({
        id: 1,
        title: 'Old Title',
        description: 'Old Description',
        images: 'https://test-url.com/old-image.jpg',
        joinform: 'https://forms.example.com/old'
      });
      
      prismaInstance.events.update.mockResolvedValue({
        id: 1,
        title: 'Updated Title',
        description: 'Updated Description',
        images: 'https://test-url.com/updated-image.jpg',
        joinform: 'https://forms.example.com/updated'
      });

      const res = await request(app)
        .put('/events/1')
        .field('title', 'Updated Title')
        .field('description', 'Updated Description')
        .field('joinform', 'https://forms.example.com/updated')
        .attach('img_file', Buffer.from('updated image'), 'updated.jpg');
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('title', 'Updated Title');
      expect(prismaInstance.events.update).toHaveBeenCalled();
    });

    test('should return 404 if event not found', async () => {
      prismaInstance.events.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .put('/events/999')
        .field('title', 'Updated Title')
        .field('description', 'Updated Description');
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  // Test for DELETE /events/:id
  describe('DELETE /events/:id', () => {
    test('should delete an event', async () => {
      prismaInstance.events.findUnique.mockResolvedValue({
        id: 1,
        title: 'Test Event',
        images: 'https://res.cloudinary.com/test-cloud/events/test.jpg'
      });
      
      prismaInstance.events.delete.mockResolvedValue({ id: 1 });

      const res = await request(app).delete('/events/1');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'event deleted successfully');
      expect(prismaInstance.events.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    test('should return 500 if deletion fails', async () => {
      prismaInstance.events.delete.mockRejectedValue(new Error('Database error'));

      const res = await request(app).delete('/events/1');
      
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('success', false);
    });
  });
  
  // Test for like/unlike event
  describe('Like/Unlike Events', () => {
    test('should like an event', async () => {
      prismaInstance.liked_by.create.mockResolvedValue({
        id: 1,
        e_id: 1,
        u_id: 1
      });

      const res = await request(app)
        .post('/likeEvent')
        .send({ event_id: 1, user_id: 1 });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Event liked successfully');
      expect(prismaInstance.liked_by.create).toHaveBeenCalledWith({
        data: {
          e_id: 1,
          u_id: 1
        }
      });
    });

    test('should unlike an event', async () => {
      prismaInstance.liked_by.deleteMany.mockResolvedValue({ count: 1 });

      const res = await request(app)
        .post('/unlikeEvent')
        .send({ event_id: 1, user_id: 1 });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Event unliked successfully');
      expect(prismaInstance.liked_by.deleteMany).toHaveBeenCalledWith({
        where: {
          e_id: 1,
          u_id: 1
        }
      });
    });
    
    test('should get liked events by user', async () => {
      prismaInstance.liked_by.findMany.mockResolvedValue([
        { id: 1, e_id: 1, u_id: 1 },
        { id: 2, e_id: 2, u_id: 1 }
      ]);

      const res = await request(app).get('/likedEvents/1');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(prismaInstance.liked_by.findMany).toHaveBeenCalledWith({
        where: { u_id: 1 }
      });
    });

    test('should return 404 if no liked events found', async () => {
      prismaInstance.liked_by.findMany.mockResolvedValue([]);

      const res = await request(app).get('/likedEvents/1');
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'No liked events found for this user');
    });
  });
});