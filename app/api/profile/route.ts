import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { verifyToken } from '../../../lib/auth'
import { ObjectId } from 'mongodb'

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const mongoClient = await clientPromise
    const db = mongoClient.db('freelance-tracker-new')
    
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } } // Exclude password from response
    )
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Return user profile with default values if fields don't exist
    const profile = {
      name: user.name || user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      bio: user.bio || '',
      hourlyRate: user.hourlyRate || '0',
      currency: user.currency || 'USD',
      timezone: user.timezone || 'America/New_York'
    }
    
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const profileData = await request.json()
    
    // Validate required fields
    if (!profileData.name || !profileData.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profileData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate hourly rate
    const hourlyRate = parseFloat(profileData.hourlyRate)
    if (isNaN(hourlyRate) || hourlyRate < 0) {
      return NextResponse.json(
        { error: 'Invalid hourly rate' },
        { status: 400 }
      )
    }

    const mongoClient = await clientPromise
    const db = mongoClient.db('freelance-tracker-new')
    
    // Update user profile
    const updateData = {
      name: profileData.name.trim(),
      email: profileData.email.trim().toLowerCase(),
      phone: profileData.phone?.trim() || '',
      location: profileData.location?.trim() || '',
      bio: profileData.bio?.trim() || '',
      hourlyRate: profileData.hourlyRate,
      currency: profileData.currency || 'USD',
      timezone: profileData.timezone || 'America/New_York',
      updatedAt: new Date()
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      profile: updateData
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}