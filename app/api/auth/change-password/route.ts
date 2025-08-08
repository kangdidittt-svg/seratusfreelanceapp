import { NextRequest, NextResponse } from 'next/server';
import { changePassword } from '../../../../lib/auth';
import { verifyToken } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const success = await changePassword(decoded.userId, currentPassword, newPassword);
    
    if (success) {
      return NextResponse.json(
        { message: 'Password changed successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to change password' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Change password error:', error);
    
    if (error.message === 'User not found') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    if (error.message === 'Current password is incorrect') {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}