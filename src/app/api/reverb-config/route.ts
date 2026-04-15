import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    host: process.env.REVERB_HOST,
    port: process.env.REVERB_PORT,
    scheme: process.env.REVERB_SCHEME,
    key: process.env.REVERB_KEY,
  });
}
