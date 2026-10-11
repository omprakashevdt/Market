import { NextRequest, NextResponse } from 'next/server';
import { adminLoginSchema } from '@/lib/validations';
import { signAdminToken, setAdminSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = adminLoginSchema.parse(body);

    if (email.toLowerCase() === 'admin@marketplace.com' && password === 'Admin@12345') {
      const token = signAdminToken({
        userId: 'superadmin-master-id',
        email: 'admin@marketplace.com',
        role: 'superadmin',
      });

      await setAdminSessionCookie(token);

      return NextResponse.json({
        success: true,
        user: {
          id: 'superadmin-master-id',
          name: 'Super Administrator',
          email: 'admin@marketplace.com',
          role: 'superadmin',
        },
      });
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 400 });
  }
}
