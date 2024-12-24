'use server';

import { SessionPayload } from '@/types/auth';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { db } from './prisma';

const secretKey = '2';
const encodedKey = new TextEncoder().encode(secretKey);

class SessionService {
  async createSession(userId: string) {
    const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await this.encrypt({ userId, expireAt });
    const cookiesStore = await cookies();

    await db.session.create({
      data: {
        userId,
        expireAt,
      },
    });

    cookiesStore.set('session', session, {
      httpOnly: true,
      secure: true,
      expires: expireAt,
    });
  }

  async deleteSession() {
    const cookiesStore = await cookies();
    cookiesStore.delete('session');
  }

  async encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(encodedKey);
  }

  async decrypt(session: string | undefined = '') {
    try {
      const { payload } = await jwtVerify(session, encodedKey, {
        algorithms: ['HS256'],
      });
      return payload;
    } catch (error) {
      console.log('Failed to verify session ', error);
    }
  }
}

export default SessionService;
