import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMembers = async (req, res) => {
  try {
    const { search = "", sortBy = "created_at", order = "asc", page = "1", limit = "10", filterBy = "" } = req.query;
    // Ambil role dan userId dari token yang sudah diverifikasi
    const { role, userId } = req.user;

    // Field yang valid untuk sorting
    const validSortFields = ["created_at", "email", "phone_no", "last_activity", "name", "id"];
    const validOrderValues = ["asc", "desc"];

    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ message: "Invalid sortBy field" });
    }
    if (!validOrderValues.includes(order)) {
      return res.status(400).json({ message: "Invalid order value" });
    }

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 5;
    const offset = (pageNumber - 1) * limitNumber;

    // Membuat kondisi pencarian dan filter
    let whereCondition = {};

    // Filter berdasarkan role (via relasi many-to-many dengan users)
    if (filterBy) {
      whereCondition.role = filterBy;
    }
    
    // Pencarian berdasarkan name, email, atau phone_no
    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone_no: { contains: search, mode: "insensitive" } },
      ];
    }

    // Jika role adalah trainer, filter member yang dilatih oleh trainer tersebut
    if (role === "trainer") {
      // Kita perlu menambahkan filter untuk trainer
      const trainerFilter = {
        trained_by_trained_by_member_idTousers: {
          some: {
            trainer_id: parseInt(userId)
          }
        }
      };
    
      // Gabungkan dengan whereCondition yang sudah ada
      if (whereCondition.OR) {
        // Jika sudah ada OR condition (dari search), kita perlu mempertahankannya
        // dan menambahkan filter trainer pada level atas
        whereCondition = {
          AND: [
            { OR: whereCondition.OR },
            trainerFilter
          ]
        };
      } else {
        // Jika tidak ada OR condition, cukup gabungkan objek filter
        whereCondition = {
          ...whereCondition,
          ...trainerFilter
        };
      }
    }
    
    // Query untuk mendapatkan daftar members
    const members = await prisma.users.findMany({
      where: whereCondition,
      orderBy: { [sortBy]: order },
      skip: offset,
      take: limitNumber,
      include: {
        trained_by_trained_by_member_idTousers: {
          include: {
            users_trained_by_trainer_idTousers: true, // Include trainer data
          },
        },
        trained_by_trained_by_trainer_idTousers: {
          include: {
            users_trained_by_member_idTousers: true, // Include member data
          },
        },
      },
    });

    // Menghitung total members yang memenuhi kondisi
    const totalMembers = await prisma.users.count({
      where: whereCondition,
    });

    res.json({
      data: members,
      pagination: {
        total: totalMembers,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalMembers / limitNumber),
      },
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};