import { NextRequest, NextResponse } from 'next/server';

// Mock user database
const mockUsers: Record<string, any> = {
  'demo@example.com': {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'admin',
    password: 'demo123', // In real app, use bcrypt
  },
  'student@example.com': {
    id: '2',
    email: 'student@example.com',
    name: 'John Student',
    role: 'student',
    password: 'demo123',
  },
  'judge@example.com': {
    id: '3',
    email: 'judge@example.com',
    name: 'Jane Judge',
    role: 'judge',
    password: 'demo123',
  },
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = mockUsers[email];
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return user (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      { user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
