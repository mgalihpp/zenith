import { sendResponse } from '@/lib/utils';
import SessionService from '@/services/session.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = new SessionService();

    await session.deleteSession();

    return NextResponse.redirect(new URL('/login', req.url));
  } catch (error) {
    console.error(error);
    return sendResponse({
      message: 'Internal server error',
      status: false,
      statusCode: 500,
      httpCode: 500,
    });
  }
}
