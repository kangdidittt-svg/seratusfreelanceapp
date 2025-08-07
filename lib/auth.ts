import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from './mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
  const db = client.db('freelance-tracker');
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
  const client = await clientPromise;
  const db = client.db('freelance-tracker');
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
  const db = client.db('freelance-tracker');
  const users = db.collection<User>('users');

  const user = await users.findOne({ _id: userId as any });
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