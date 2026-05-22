import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source.js';


 // REGISTER USER (PATIENT / DOCTOR SAFE)
export const register = async (req, res) => {
  const { username, password, name, role } = req.body;

  try {
    if (!username || !password || !name) {
      return res.status(400).json({
        message: "Username, password, and name are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const cleanUsername = username.trim().toLowerCase();

    // Only allow safe roles (no admin self-registration)
    const allowedRoles = ["PATIENT", "DOCTOR"];

    const finalRole = allowedRoles.includes(role?.toUpperCase())
      ? role.toUpperCase()
      : "PATIENT";

    // Check if user exists
    const userCheck = await AppDataSource.query(
      'SELECT id FROM users WHERE username = $1',
      [cleanUsername]
    );

    const existingUser = userCheck?.rows || userCheck;

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const insertResult = await AppDataSource.query(
      `
      INSERT INTO users (username, password_hash, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, name, role
      `,
      [cleanUsername, passwordHash, name, finalRole]
    );

    const createdUser = insertResult?.rows?.[0] || insertResult[0];

    return res.status(201).json({
      message: "User registered successfully",
      user: createdUser
    });

  } catch (err) {
    console.error("Register Error:", err);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

/**
 * LOGIN USER (SAFE ROLE-AWARE AUTH)
 */
export const login = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    const cleanUsername = username.trim().toLowerCase();

    const userResult = await AppDataSource.query(
      'SELECT * FROM users WHERE username = $1',
      [cleanUsername]
    );

    const rows = userResult?.rows || userResult;

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // ROLE CHECK (ONLY IF ROLE IS PROVIDED)
    if (role) {
      const selectedRole = role.toUpperCase();

      if (user.role !== selectedRole) {
        return res.status(403).json({
          message: "Access denied for selected role"
        });
      }
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login Error:", err);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};