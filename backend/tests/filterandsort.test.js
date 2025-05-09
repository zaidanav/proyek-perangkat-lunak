import { jest } from '@jest/globals';
import { getMembers as filterAndSortController } from '../controllers/filterAndSortController';
import { prisma } from '../db/prisma/prisma';
prisma.users.findMany = jest.fn();
prisma.users.count    = jest.fn();

describe('filterAndSortController', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      query: {},            // sesuaikan query params (search, filterBy, sortBy, order, page, limit)
      user: { role: 'admin', userId: 1 }
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  test('should return paginated members with default params', async () => {
    // arrange
    const fakeMembers = [{ id: 1, name: 'Foo' }];
    prisma.users.findMany.mockResolvedValue(fakeMembers);
    prisma.users.count.mockResolvedValue(1);

    // act
    await filterAndSortController(req, res);

    // assert
    expect(prisma.users.findMany).toHaveBeenCalled();
    expect(prisma.users.count).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      data: fakeMembers,
      pagination: expect.objectContaining({
        total: 1,
        page: 1,
        limit: expect.any(Number),
        totalPages: 1
      })
    }));
  });

  test('should handle errors and respond 500', async () => {
    // arrange
    prisma.users.findMany.mockRejectedValue(new Error('boom'));

    // act
    await filterAndSortController(req, res);

    // assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});