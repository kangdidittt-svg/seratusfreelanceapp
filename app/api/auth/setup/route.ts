import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '../../../../lib/auth';
import clientPromise from '../../../../lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('freelance-tracker');
    const users = db.collection('users');

    // Check if any admin user already exists
    const existingAdmin = await users.findOne({ role: 'admin' });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin user already exists' },
        { status: 400 }
      );
    }

    // Create default admin user
    const adminUser = await createUser({
      username: 'admin',
      password: 'admin123',
      email: 'admin@freelance-tracker.com',
      role: 'admin'
    });

    return NextResponse.json(
      {
        message: 'Admin user created successfully',
        user: {
          id: adminUser._id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}