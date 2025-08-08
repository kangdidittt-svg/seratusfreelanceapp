import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { verifyToken } from '../../../lib/auth'
import { ObjectId } from 'mongodb'

// Default categories
const DEFAULT_CATEGORIES = [
  'Web Development',
  'Mobile App',
  'UI/UX Design',
  'Branding',
  'Marketing',
  'Consulting',
  'Other'
]

// GET - Fetch user categories
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
    const db = mongoClient.db('freelance-trackers')
    
    // Handle demo user (doesn't have valid ObjectId)
    if (decoded.userId === 'demo-user-123') {
      return NextResponse.json({ categories: DEFAULT_CATEGORIES })
    }
    
    // Validate ObjectId format
    if (!ObjectId.isValid(decoded.userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }
    
    // Get user's custom categories or return default ones
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) })
    const categories = user?.categories || DEFAULT_CATEGORIES
    
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Add new category
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    const { category } = await request.json()
    
    if (!category || !category.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const mongoClient = await clientPromise
    const db = mongoClient.db('freelance-trackers')
    
    // Handle demo user (doesn't have valid ObjectId)
    if (decoded.userId === 'demo-user-123') {
      // For demo user, just return default categories without saving
      const currentCategories = DEFAULT_CATEGORIES
      
      // Check if category already exists
      if (currentCategories.includes(category.trim())) {
        return NextResponse.json({ error: 'Category already exists' }, { status: 400 })
      }
      
      // Return updated categories for demo (not saved to DB)
      const updatedCategories = [...currentCategories, category.trim()]
      return NextResponse.json({ categories: updatedCategories })
    }
    
    // Validate ObjectId format
    if (!ObjectId.isValid(decoded.userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }
    
    // Get current categories
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) })
    const currentCategories = user?.categories || DEFAULT_CATEGORIES
    
    // Check if category already exists
    if (currentCategories.includes(category.trim())) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 })
    }
    
    // Add new category
    const updatedCategories = [...currentCategories, category.trim()]
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { categories: updatedCategories } },
      { upsert: true }
    )
    
    return NextResponse.json({ categories: updatedCategories })
  } catch (error) {
    console.error('Error adding category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update category
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
    const { oldCategory, newCategory } = await request.json()
    
    if (!oldCategory || !newCategory || !newCategory.trim()) {
      return NextResponse.json({ error: 'Both old and new category names are required' }, { status: 400 })
    }

    const mongoClient = await clientPromise
    const db = mongoClient.db('freelance-trackers')
    
    // Handle demo user (doesn't have valid ObjectId)
    if (decoded.userId === 'demo-user-123') {
      // For demo user, just return default categories without saving
      const currentCategories = DEFAULT_CATEGORIES
      
      // Check if old category exists
      const categoryIndex = currentCategories.indexOf(oldCategory)
      if (categoryIndex === -1) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
      
      // Check if new category already exists
      if (currentCategories.includes(newCategory.trim()) && oldCategory !== newCategory.trim()) {
        return NextResponse.json({ error: 'New category name already exists' }, { status: 400 })
      }
      
      // Return updated categories for demo (not saved to DB)
      const updatedCategories = [...currentCategories]
      updatedCategories[categoryIndex] = newCategory.trim()
      return NextResponse.json({ categories: updatedCategories })
    }
    
    // Validate ObjectId format
    if (!ObjectId.isValid(decoded.userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }
    
    // Get current categories
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) })
    const currentCategories = user?.categories || DEFAULT_CATEGORIES
    
    // Check if old category exists
    const categoryIndex = currentCategories.indexOf(oldCategory)
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    // Check if new category already exists
    if (currentCategories.includes(newCategory.trim()) && oldCategory !== newCategory.trim()) {
      return NextResponse.json({ error: 'New category name already exists' }, { status: 400 })
    }
    
    // Update category
    const updatedCategories = [...currentCategories]
    updatedCategories[categoryIndex] = newCategory.trim()
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { categories: updatedCategories } }
    )
    
    // Update all projects with the old category to use the new category
    await db.collection('projects').updateMany(
      { userId: new ObjectId(decoded.userId), category: oldCategory },
      { $set: { category: newCategory.trim() } }
    )
    
    return NextResponse.json({ categories: updatedCategories })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    const { category } = await request.json()
    
    if (!category) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const mongoClient = await clientPromise
    const db = mongoClient.db('freelance-trackers')
    
    // Handle demo user (doesn't have valid ObjectId)
    if (decoded.userId === 'demo-user-123') {
      // For demo user, just return default categories without saving
      const currentCategories = DEFAULT_CATEGORIES
      
      // Check if category exists
      if (!currentCategories.includes(category)) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
      
      // Return updated categories for demo (not saved to DB)
      const updatedCategories = currentCategories.filter((cat: string) => cat !== category)
      return NextResponse.json({ categories: updatedCategories })
    }
    
    // Validate ObjectId format
    if (!ObjectId.isValid(decoded.userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }
    
    // Get current categories
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) })
    const currentCategories = user?.categories || DEFAULT_CATEGORIES
    
    // Check if category exists
    if (!currentCategories.includes(category)) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    // Remove category
    const updatedCategories = currentCategories.filter((cat: string) => cat !== category)
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { categories: updatedCategories } }
    )
    
    // Update all projects with this category to 'Other'
    await db.collection('projects').updateMany(
      { userId: new ObjectId(decoded.userId), category: category },
      { $set: { category: 'Other' } }
    )
    
    return NextResponse.json({ categories: updatedCategories })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}