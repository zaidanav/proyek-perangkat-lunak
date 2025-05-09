import { prisma } from "../db/prisma/prisma.js";
import { body, validationResult } from "express-validator";
import jwt, { decode } from "jsonwebtoken";
import { upload } from "../middlewares/multerMiddleware.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// Add a new member
export const addMemberControllers = [
  upload,

  async (req, res) => {
    // Validasi data masuk
    await Promise.all([
      body("email").isEmail().withMessage("Format email tidak valid").run(req),
      body("phone_no")
        .optional()
        .isMobilePhone()
        .withMessage("Nomor telepon tidak valid")
        .run(req),
      body("role")
        .notEmpty()
        .withMessage("Role tidak boleh kosong")
        .isIn(["member", "trainer"])
        .withMessage("Role tidak valid")
        .run(req),
      body("name").notEmpty().withMessage("Nama tidak boleh kosong").run(req),
      body("username")
        .notEmpty()
        .withMessage("Username tidak boleh kosong")
        .run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, name, phone, role, email } = req.body;
    const img_file = req.file;
    try {
      // Cek jika email atau nomor hp sudah ada
      const existingEmail = await prisma.users.findUnique({
        where: { email },
      });

      if (existingEmail) {
        return res.status(409).json({ message: "Email sudah digunakan" });
      }

      if (phone) {
        const existingPhoneNo = await prisma.users.findUnique({
          where: { phone_no: phone },
        });

        if (existingPhoneNo) {
          return res
            .status(409)
            .json({ message: "Nomor telepon sudah digunakan" });
        }
      }

      if (!img_file) {
        return res.status(400).json({ message: "Image Wajib ada" });
      }

      const folder = role === "trainer" ? "trainers" : "members";

      // Upload image to Cloudinary
      let cloudinaryUrl = null;
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.v2.uploader
            .upload_stream(
              {
                folder: folder,
                transformation: [{ quality: "auto", fetch_format: "auto" }],
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(img_file.buffer);
        });

        cloudinaryUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return res.status(400).json({ message: "Gagal mengunggah gambar" });
      }

      // Buat user baru
      const result = await prisma.$transaction(async (prisma) => {
        // generate default password
        const uniqueId = uuidv4().substring(0, 6);

        // Password default: nama (lowercase, tanpa spasi) + 6 karakter acak
        const defaultPassword = `${name
          .toLowerCase()
          .replace(/\s+/g, "")}${uniqueId}`;

        // Hash password
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Buat user baru dengan password default
        const newUser = await prisma.users.create({
          data: {
            username: username,
            name: name,
            email: email,
            password: hashedPassword,
            avatar: cloudinaryUrl,
            role: role,
            phone_no: phone || null,
          },
        });
        return { defaultPassword };
      });

      // Member berhasil ditambahkan
      res.status(201).json({
        message: "Member berhasil ditambahkan",
        defaultPassword: result.defaultPassword,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat menambahkan member" });
    }
  },
];

// Get all members
export const getMemberControllers = async (req, res) => {
  try {
    // Ambil role dan userId dari token yang sudah diverifikasi
    const { role, userId } = req.user;

    // Jika role adalah trainer, ambil member yang dilatih oleh trainer tersebut
    if (role === "trainer") {
      const members = await prisma.trained_by.findMany({
        where: { trainer_id: parseInt(userId) },
        include: {
          users: true,
        },
      });
      return res.status(200).json(members);
    } else {
      const members = await prisma.users.findMany({
        orderBy: {
          name: "asc",
        },
      });
      return res.status(200).json(members);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil data member" });
  }
};

// Get member by id
export const getMemberByIdControllers = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });
    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil data member" });
  }
};

// Delete a member
export const deleteMemberControllers = async (req, res) => {
  const { id } = req.params;
  try {
    // Cek apakah member ada
    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Hapus Avatar dari Cloudinary
    const folder = user.role === "trainer" ? "trainers" : "members";
    const lastImgUrl = user.avatar;
    if (lastImgUrl && lastImgUrl.includes(process.env.CLOUDINARY_CLOUD_NAME)) {
      try {
        console.log("Deleting old image from Cloudinary:", lastImgUrl);
        const publicId = lastImgUrl.split("/").pop().split(".")[0];
        await cloudinary.v2.uploader.destroy(`${folder}/${publicId}`);
      } catch (deleteError) {
        console.error("Failed to delete old image:", deleteError);
      }
    }

    await prisma.users.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Member berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menghapus member" });
  }
};

export const updateMemberControllers = async (req, res) => {
  const { id } = req.params;
  const { name, phone_no } = req.body;

  try {
    // Cek jika nomor telepon sudah ada dan bukan milik member yang sedang diupdate
    if (phone_no) {
      const existingPhoneNo = await prisma.users.findUnique({
        where: { phone_no },
      });

      if (existingPhoneNo && existingPhoneNo.id !== parseInt(id)) {
        return res
          .status(409)
          .json({ message: "Nomor telepon sudah digunakan oleh member lain" });
      }
    }

    await prisma.users.update({
      where: { id: parseInt(id) },
      data: {
        name,
        phone_no,
      },
    });
    res.status(200).json({ message: "Member berhasil diupdate" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengupdate member" });
  }
};

export const getProfileControllers = async (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const role = decoded.role;

  // Cek apakah role adalah member, trainer, atau admin
  try {
    if (role === "trainer" || role === "admin" || role === "member") {
      const data = await prisma.users.findUnique({
        where: { id: decoded.userId },
      });
      res.status(200).json(data);
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil data member" });
  }
};

export const updateProfileControllers = async (req, res) => {
  // Validasi
  await Promise.all([
    body("phone_no")
      .optional()
      .isMobilePhone()
      .withMessage("Nomor telepon tidak valid")
      .run(req),
  ]);

  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const { username, name, phone_no } = req.body;
  const img_file = req.file;

  const role = decoded.role;
  try {
    if (role === "member" || role === "trainer" || role === "admin") {
      // Cek jika nomor telepon sudah ada dan bukan milik member yang sedang diupdate
      if (phone_no) {
        const existingPhoneNo = await prisma.users.findUnique({
          where: { phone_no },
        });

        if (existingPhoneNo && existingPhoneNo.id !== decoded.userId) {
          return res.status(409).json({
            message: "Nomor telepon sudah digunakan oleh member lain",
          });
        }
      }

      if (name?.length > 100) {
        return res
          .status(400)
          .json({ error: "Nama tidak boleh lebih dari 100 karakter" });
      }

      if (username?.length > 100) {
        return res
          .status(400)
          .json({ error: "Username tidak boleh lebih dari 100 karakter" });
      }

      if (phone_no?.length > 15) {
        return res
          .status(400)
          .json({ error: "Nomor telepon tidak boleh lebih dari 15 karakter" });
      }

      if (!name || !username) {
        return res.status(400).json({ message: "Request Tidak Valid" });
      }

      if (!img_file) {
        await prisma.users.update({
          where: { id: decoded.userId },
          data: {
            username: username,
            name: name,
            phone_no: phone_no === "" ? null : phone_no,
          },
        });
      } else {
        // Delete last image from Cloudinary
        const lastMemberData = await prisma.users.findFirst({
          where: { id: decoded.userId },
        });
        var folder;
        if (decoded.role === "trainer") {
          folder = "trainers";
        } else if (decoded.role === "admin") {
          folder = "admin";
        } else if (decoded.role === "member") {
          folder = "members";
        } else {
          return res.status(403).json({ message: "Forbidden" });
        }
        const lastImgUrl = lastMemberData.avatar;
        if (
          lastImgUrl &&
          lastImgUrl.includes(process.env.CLOUDINARY_CLOUD_NAME)
        ) {
          try {
            console.log("Deleting old image from Cloudinary:", lastImgUrl);
            const publicId = lastImgUrl.split("/").pop().split(".")[0];
            await cloudinary.v2.uploader.destroy(`${folder}/${publicId}`);
          } catch (deleteError) {
            console.error("Failed to delete old image:", deleteError);
          }
        }

        // Upload image to Cloudinary
        let cloudinaryUrl = null;
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader
              .upload_stream(
                {
                  folder: folder,
                  transformation: [{ quality: "auto", fetch_format: "auto" }],
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              )
              .end(img_file.buffer);
          });

          cloudinaryUrl = uploadResult.secure_url;
        } catch (uploadError) {
          console.error("Cloudinary Upload Error:", uploadError);
          return res.status(400).json({ message: "Gagal mengunggah gambar" });
        }

        await prisma.users.update({
          where: { id: decoded.userId },
          data: {
            username: username,
            name: name,
            avatar: cloudinaryUrl,
            phone_no: phone_no === "" ? null : phone_no,
          },
        });
      }
      res.status(200).json({ message: "Profile berhasil diupdate" });
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengupdate profile" });
  }
};

export const checkPhoneNumberController = async (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { phone_no } = req.body;

  try {
    const existingPhoneNo = await prisma.users.findUnique({
      where: { phone_no },
    });

    if (existingPhoneNo && existingPhoneNo.id !== decoded.userId) {
      return res.status(409).json({ isUsed: true });
    }

    res.status(200).json({ isUsed: false });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat memeriksa nomor telepon." });
  }
};

export const changePasswordController = async (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { oldPassword, newPassword } = req.body;

  try {
    // Cek apakah password lama sesuai
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password lama tidak sesuai" });
    }

    // Hash password baru
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password di database
    await prisma.users.update({
      where: { id: decoded.userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ message: "Password berhasil diubah" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengubah password" });
  }
};
