import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from './mongodb';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Helper functions for demo password persistence
const DEMO_CONFIG_PATH = path.join(process.cwd(), 'demo-config.json');

function getDemoPassword(): string {
  try {
    const configData = fs.readFileSync(DEMO_CONFIG_PATH, 'utf8');
    const config = JSON.parse(configData);
    return config.demoPassword || 'demo123';
  } catch (error) {
    return 'demo123'; // fallback to default
  }
}

function setDemoPassword(newPassword: string): void {
  try {
    const config = { demoPassword: newPassword };
    fs.writeFileSync(DEMO_CONFIG_PATH, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Failed to save demo password:', error);
  }
}

export interface User {
  _id?: string;
  username: string;
  password: string;
  email?: string;
  role: 'admin' | 'user';
  createdAt?: Date;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function createUser(userData: Omit<User, '_id' | 'createdAt'>): Promise<User> {
  const client = await clientPromise;
  const db = client.db('freelance-tracker-new');
  const users = db.collection<User>('users');

  // Check if user already exists
  const existingUser = await users.findOne({ username: userData.username });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(userData.password);

  const newUser: Omit<User, '_id'> = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date()
  };

  const result = await users.insertOne(newUser);
  return { ...newUser, _id: result.insertedId.toString() };
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  // Check for demo account first
  if (username === 'demo' && password === getDemoPassword()) {
    return {
      _id: 'demo-user-123',
      username: 'demo',
      email: 'demo@example.com',
      role: 'user',
      password: '',
      createdAt: new Date()
    };
  }

  const client = await clientPromise;
  const db = client.db('freelance-tracker-new');
  const users = db.collection<User>('users');

  const user = await users.findOne({ username });
  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return null;
  }

  return {
    _id: user._id?.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    password: '', // Don't return password
    createdAt: user.createdAt
  };
}

export async function getUserById(userId: string): Promise<User | null> {
  const client = await clientPromise;
  const db = client.db('freelance-tracker-new');
  const users = db.collection<User>('users');

  const { ObjectId } = require('mongodb');
  const user = await users.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    return null;
  }

  return {
    _id: user._id?.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    password: '', // Don't return password
    createdAt: user.createdAt
  };
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  // Handle demo account - update persistent password
  if (userId === 'demo-user-123') {
    if (currentPassword !== getDemoPassword()) {
      throw new Error('Current password is incorrect');
    }
    // Update demo password in file
    setDemoPassword(newPassword);
    return true;
  }

  const client = await clientPromise;
  const db = client.db('freelance-tracker-new');
  const users = db.collection<User>('users');

  const { ObjectId } = require('mongodb');
  const user = await users.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const hashedNewPassword = await hashPassword(newPassword);

  // Update password in database
  const result = await users.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { password: hashedNewPassword } }
  );

  return result.modifiedCount > 0;
}