import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import fetch from 'node-fetch';
import { body, validationResult } from 'express-validator';
import cloudinary from 'cloudinary'; 

dotenv.config();
const prisma = new PrismaClient();

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Registrasi User
export const register = async (req, res) => {
  await Promise.all([
    body("email").isEmail().withMessage("Format email tidak valid").run(req),
  ]);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
      const { role, username, email, password, name } = req.body;
      const img_file = req.file;

      // Validate input fields
      if (!role || !username || !email || !password || !img_file) {
          return res.status(400).json({ error: 'All fields are required' });
      }

      if (password.length < 8) {
          return res.status(400).json({ error: 'Password must be at least 8 characters long' });
      }

      // Check if the email is already in use
      const existingUser = await prisma.users.findUnique({ where: { email } });
      if (existingUser) {
          return res.status(400).json({ error: 'Email is already in use' });
      }

      // Upload image to Cloudinary
      let cloudinaryUrl = null;
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.v2.uploader.upload_stream(
            { 
              folder: 'members', 
              transformation: [
                { quality: "auto", fetch_format: "auto" }
              ]
            }, 
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(img_file.buffer);
        });

        cloudinaryUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError);
        return res.status(400).json({ message: "Gagal mengunggah gambar" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      let user;
      
      const result = await prisma.$transaction(async (prisma) => {
          // Create user record first
          user = await prisma.users.create({
            data: {
              email,
              username,
              role, // misalnya diambil dari req.body
              password: hashedPassword,
              name: name,
              avatar: cloudinaryUrl, // dari hasil upload
              provider: null,       // karena bukan Google
              provider_id: null     // karena bukan Google
            }
          });

          // if (role === 'member') {
          //     // Create member record
          //     const member = await prisma.members.create({
          //         data: {
          //             id_u: user.id, // menghubungkan record member ke record user yang sudah ada
          //             stat1: 50,   
          //             stat2: 50,
          //             stat3: 50,
          //             stat4: 50,
          //             stat5: 50
          //         }
          //     });

          //     return { user, member };
          // }

          return { user };
      });

      res.status(201).json({ 
          message: 'User registered successfully', 
          user: result.user,
          member: result.member || null
      });
  } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'An internal server error occurred' });
  }
};

// Login User dengan httpOnly Cookie
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if email exists
        const user = await prisma.users.findUnique({ where: { email } });
        
        if (!user) {
            return res.status(404).json({ 
                error: 'Account not found. Please register first.' 
            });
        }
        
        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: 'The email or password you entered is incorrect.' 
            });
        }

        // Generate token with user ID and role
        const token = jwt.sign(
            { 
                userId: user.id, 
                role: user.role 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            // sameSite: 'strict',
            sameSite: 'none', // Kalo beda misal fe vercel be railway
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Return success message
        res.json({ 
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'An error occurred. Please try again.' 
        });
    }
};

// Logout User
export const logout = (req, res) => {
  res.clearCookie('token', { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none' // Kalo beda misal fe vercel be railway
});
res.json({ message: 'Logout successful' });
};

// Update this method in your authController.js file
export const getProfile = async (req, res) => {
  try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: 'Unauthorized' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get the user with full details
      const user = await prisma.users.findUnique({ 
          where: { id: decoded.userId } 
      });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Include avatar in the response
      res.json({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          provider: user.provider,
          created_at: user.created_at
      });
  } catch (error) {
      console.error('Error getting profile:', error);
      res.status(403).json({ error: 'Invalid token' });
  }
};

// Google Login
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      console.log('Google login payload:', payload);
      // Find if user already exists
      let user = await prisma.users.findUnique({ where: { email } });

      let isNewUser = false;
      let member = null;

      if (!user) {
        console.log('Creating new user from Google sign-in:', email);
        // Create a new user with Google data
        isNewUser = true;
        user = await prisma.users.create({
          data: {
            email,
            username: email.split('@')[0], // gunakan email prefix untuk username (misal)
            role: 'member',
            provider: 'google',
            provider_id: googleId,
            avatar: picture,
            password: null,
            name: name
          }
        });
        
        // // For new members, create an entry in the members table
        // if (user.role === 'member') {
        //   member = await prisma.members.create({
        //     data: {
        //       id_u: user.id,
        //       stat1: 50, // Default values
        //       stat2: 50,
        //       stat3: 50,
        //       stat4: 50,
        //       stat5: 50
        //     }
        //   });
        // }
      } else {
        // Update existing user's Google information if needed
        if (user.provider !== 'google' || user.provider_id !== googleId) {
          user = await prisma.users.update({
            where: { id: user.id },
            data: {
              provider: 'google',
              provider_id: googleId,
              avatar: picture || user.avatar
            }
          });
        }
        
        // Check if the user is a member but doesn't have a member record
        // if (user.role === 'member') {
        //   // Check if user already has a member record
        //   const existingMemberRelation = await prisma.members.findFirst({
        //     where: { id_u: user.id }
        //   });
          
        //   if (!existingMemberRelation) {
        //     // Create missing member record
        //     member = await prisma.members.create({
        //       data: {
        //         id: user.id, // menghubungkan record member ke record user yang sudah ada
        //         stat1: 50,
        //         stat2: 50,
        //         stat3: 50,
        //         stat4: 50,
        //         stat5: 50
        //       }
        //     });
        //   }
        // }
      }
      
      return { user, isNewUser, member };
    });

    // Generate JWT token
    const authToken = jwt.sign(
      { userId: result.user.id, role: result.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set HTTP-only cookie
    res.cookie('token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // sameSite: 'strict',
      sameSite: 'none', // Kalo beda misal fe vercel be railway
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: result.isNewUser ? 'Account created and login successful' : 'Login successful',
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
};
  

export const googleCallback = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }
    
    // Exchange code for tokens
    const redirectUri = `${process.env.FRONTEND_URL}/auth/google/callback`;
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Google token exchange error:', errorData);
      return res.status(400).json({ error: 'Failed to exchange authorization code for tokens' });
    }
    
    const tokens = await tokenResponse.json();
    console.log('Received tokens from Google');
    
    let payload;
    if (!tokens.id_token) {
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: { 'Authorization': `Bearer ${tokens.access_token}` }
      });
      
      if (!userInfoResponse.ok) {
        return res.status(400).json({ error: 'Failed to fetch user information from Google' });
      }
      
      payload = await userInfoResponse.json();
      // Adjust property names if needed (ex: payload.id instead of payload.sub)
      payload.sub = payload.id;
    } else {
      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      payload = ticket.getPayload();
    }
    
    if (!payload.email) {
      return res.status(400).json({ error: 'Email is required from Google account' });
    }
    
    // Destructure payload here so variabelnya tersedia untuk block transaction
    const { email, name, picture, sub: googleId } = payload;
    const userName = name ? name : ""
    
    const result = await prisma.$transaction(async (prisma) => {
      // Find if user already exists
      let user = await prisma.users.findUnique({ where: { email } });
      let isNewUser = false;
      let member = null;
      
      if (!user) {
        isNewUser = true;
        user = await prisma.users.create({
          data: {
            email,
            username: email.split('@')[0],
            role: 'member',
            provider: 'google',
            provider_id: googleId,
            avatar: picture,
            password: null,
            name: name ? name : ""
          }
        });
        
        console.log('Created new user from Google sign-in:', user.id);
        
        // if (user.role === 'member') {
        //   member = await prisma.members.create({
        //     data: {
        //       id_u: user.id, 
        //       stat1: 50,
        //       stat2: 50,
        //       stat3: 50,
        //       stat4: 50,
        //       stat5: 50
        //     }
        //   });
          
        //   console.log('Created member record and linked to user:', member.id);
        // }
      } else {
        if (user.provider !== 'google' || user.provider_id !== googleId) {
          user = await prisma.users.update({
            where: { id: user.id },
            data: {
              provider: 'google',
              provider_id: googleId,
              avatar: picture || user.avatar
            }
          });
          console.log('Updated existing user with Google information:', user.id);
        } else {
          console.log('Found existing Google user with email:', email);
        }
        
        if (user.role === 'member') {
          const existingMemberRelation = await prisma.users.findFirst({
            where: { id: user.id }
          });
          
          // if (!existingMemberRelation) {
          //   member = await prisma.members.create({
          //     data: {
          //       id_u: user.id, // menghubungkan record member ke record user yang sudah ada
          //       stat1: 50,
          //       stat2: 50,
          //       stat3: 50,
          //       stat4: 50,
          //       stat5: 50
          //     }
          //   });
              
          //   console.log('Created missing member record for existing user:', member.id);
          // }
        }
      }
      
      return { user, isNewUser, member };
    });
    
    const authToken = jwt.sign(
      { userId: result.user.id, role: result.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.cookie('token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // sameSite: 'strict',
      sameSite: 'none', // Kalo beda misal fe vercel be railway
      maxAge: 24 * 60 * 60 * 1000
    });
    
    return res.json({
      message: result.isNewUser ? 'Account created and login successful' : 'Google authentication successful',
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role,
        avatar: result.user.avatar || picture
      }
    });
  } catch (error) {
    console.error('Google callback error:', error);
    res.status(500).json({ error: 'An unexpected error occurred during Google authentication' });
  }
};