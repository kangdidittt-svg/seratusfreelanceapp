import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
      // For demo user, return project not found since they don't have real projects
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Validate ObjectId format
    if (!ObjectId.isValid(decoded.userId) || !ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db('freelance-trackers');
    const project = await db.collection('projects').findOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(decoded.userId)
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      // For demo user, return project not found since they don't have real projects
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Validate ObjectId format
    if (!ObjectId.isValid(decoded.userId) || !ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const body = await request.json();
    const updateData = { ...body };
    
    // Convert budget to number if provided
    if (updateData.budget) {
      updateData.budget = parseFloat(updateData.budget);
    }
    
    // Convert paid to number if provided
    if (updateData.paid) {
      updateData.paid = parseFloat(updateData.paid);
    }
    
    // Convert deadline to date if provided
    if (updateData.deadline) {
      updateData.deadline = new Date(updateData.deadline);
    }
    
    updateData.updatedAt = new Date();

    const mongoClient = await clientPromise;
    const db = mongoClient.db('freelance-trackers');
    const result = await db.collection('projects').updateOne(
      {
        _id: new ObjectId(params.id),
        userId: new ObjectId(decoded.userId)
      },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
      // For demo user, return project not found since they don't have real projects
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Validate ObjectId format
    if (!ObjectId.isValid(decoded.userId) || !ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db('freelance-trackers');
    const result = await db.collection('projects').deleteOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(decoded.userId)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}