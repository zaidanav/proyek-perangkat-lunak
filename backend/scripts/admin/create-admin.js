import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Inisialisasi dotenv dan Prisma
dotenv.config();
const prisma = new PrismaClient();

// Dapatkan direktori saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ADMIN_FLAG_FILE = path.join(__dirname, '.admin_created');

// Buat interface untuk input user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fungsi untuk memvalidasi email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Fungsi untuk memvalidasi password
function isValidPassword(password) {
  // Minimal 8 karakter, setidaknya 1 huruf besar, 1 huruf kecil, dan 1 angka
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

// Fungsi untuk menanyakan input user dengan Promise
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Fungsi untuk memeriksa apakah sudah ada akun admin
async function adminExists() {
  // Cek database
  const adminCount = await prisma.users.count({
    where: {
      role: 'admin'
    }
  });
  
  // Cek file penanda
  const flagFileExists = fs.existsSync(ADMIN_FLAG_FILE);
  
  return adminCount > 0 || flagFileExists;
}

// Fungsi utama untuk membuat akun admin secara interaktif
async function createStrictSingleAdmin() {
  try {
    console.log('\n===== PEMBUATAN AKUN ADMIN =====\n');
    
    // Cek apakah sudah ada akun admin
    const hasAdmin = await adminExists();
    if (hasAdmin) {
      console.log('PERINGATAN: Akun admin sudah ada dalam sistem.');
      console.log('Hanya diperbolehkan satu akun admin.');
      console.log('Pembuatan akun admin baru ditolak untuk alasan keamanan.');
      rl.close();
      return;
    }
    
    // Input data admin
    const username = await askQuestion('Username (\'admin\' saja cukup): ');
    
    let email;
    do {
      email = await askQuestion('Email: ');
      if (!isValidEmail(email)) {
        console.log('Email tidak valid. Silakan coba lagi.');
      }
    } while (!isValidEmail(email));
    
    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      console.log('Email sudah digunakan. Silakan gunakan email lain.');
      rl.close();
      return;
    }
    
    let password;
    do {
      password = await askQuestion('Password (min. 8 karakter, harus mengandung huruf besar, huruf kecil, dan angka): ');
      if (!isValidPassword(password)) {
        console.log('Password tidak memenuhi persyaratan. Silakan coba lagi.');
      }
    } while (!isValidPassword(password));
    
    const confirmPassword = await askQuestion('Konfirmasi Password: ');
    if (password !== confirmPassword) {
      console.log('Konfirmasi password tidak cocok. Proses pembuatan akun dibatalkan.');
      rl.close();
      return;
    }
    
    const name = await askQuestion('Nama (\'admin\' saja cukup): ');
    
    // Tanyakan konfirmasi
    console.log('\n=== DATA AKUN ADMIN ===');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Nama:', name);
    
    const confirmation = await askQuestion('\nBuat akun admin dengan data di atas? (y/n): ');
    
    if (confirmation.toLowerCase() !== 'y') {
      console.log('Pembuatan akun dibatalkan.');
      rl.close();
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Buat user admin
    const user = await prisma.users.create({
      data: {
        email,
        username,
        role: 'admin',
        password: hashedPassword,
        name,
        avatar: 'https://res.cloudinary.com/duemu25rz/image/upload/v1745574129/admin_qem1yh.jpg',
        provider: null,
        provider_id: null
      }
    });
    
    console.log('\nAkun admin berhasil dibuat!');
    console.log('ID:', user.id);
    console.log('Username:', user.username);
    console.log('Email:', user.email);
    
    // Buat file penanda bahwa admin sudah dibuat
    const date = new Date().toISOString();
    fs.writeFileSync(ADMIN_FLAG_FILE, `Admin created on ${date}`);
    
    console.log('\nINFORMASI PENTING:');
    console.log('Akun admin telah dibuat pada:', date);
    console.log('Script ini tidak akan mengizinkan pembuatan akun admin lain.');
    console.log('Jika Anda perlu mengatur ulang, hapus file .admin_created di direktori ini.');
    
  } catch (error) {
    console.error('Error saat membuat akun admin:', error);
  } finally {
    // Tutup koneksi Prisma dan readline
    rl.close();
    await prisma.$disconnect();
  }
}

// Jalankan fungsi
createStrictSingleAdmin();

// Tangani penutupan readline
rl.on('close', () => {
  console.log('\nProses pembuatan akun admin selesai.');
  process.exit(0);
});