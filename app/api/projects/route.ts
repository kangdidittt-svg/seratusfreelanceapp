import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { verifyToken } from '../../../lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Handle demo user (doesn't have valid ObjectId)
    if (decoded.userId === 'demo-user-123') {
      // Return empty projects array for demo user
      return NextResponse.json({ projects: [] });
    }
    
    // Validate ObjectId format
    if (!ObjectId.isValid(decoded.userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db('freelance-tracker-new');
    const projects = await db.collection('projects')
      .find({ userId: new ObjectId(decoded.userId) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, client, description, category, budget, deadline, priority, status } = body;

    // Validation
    if (!title || !client || !category || !budget || !deadline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle demo user (doesn't have valid ObjectId)
    if (decoded.userId === 'demo-user-123') {
      // For demo user, just return success without saving to DB
      return NextResponse.json({
        message: 'Project created successfully (demo mode)',
        projectId: 'demo-project-' + Date.now()
      }, { status: 201 });
    }
    
    // Validate ObjectId format
    if (!ObjectId.isValid(decoded.userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db('freelance-tracker-new');
    
    const project = {
      title,
      client,
      description: description || '',
      category,
      budget: parseFloat(budget),
      deadline: new Date(deadline),
      priority: priority || 'Medium',
      status: status || 'Pending',
      progress: 0,
      paid: 0,
      userId: new ObjectId(decoded.userId),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('projects').insertOne(project);
    
    return NextResponse.json({
      message: 'Project created successfully',
      projectId: result.insertedId
    }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}