import { sendResponse } from '@/lib/utils';
import SessionService from '@/services/session.service';

export async function GET() {
  try {
    const session = new SessionService();

    await session.deleteSession();

    return sendResponse({
      message: 'Session deleted successfully',
      status: true,
      statusCode: 200,
      httpCode: 200,
    });
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
