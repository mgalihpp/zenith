'use server';

import { Session, SessionPayload, ValidateSession } from '@/types/auth';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { cache } from 'react';
import Service from '.';

const secretKey = '2';
const encodedKey = new TextEncoder().encode(secretKey);

class SessionService extends Service {
  constructor() {
    super();
  }

  async createSession(userId: string) {
    const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await this.encrypt({ userId, expireAt });
    const cookiesStore = await cookies();

    await this.db.session.create({
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
      return payload as Session;
    } catch (error) {
      console.error('Failed to verify session ', error);
    }
  }

  async getUser(userId: string) {
    try {
      const user = await this.db.user.findFirst({
        where: {
          id: userId,
        },
        ...this.prismaQueryHelper.getDefaultUser(),
      });

      return user;
    } catch (error) {
      console.error('Failed to get user ', error);
      return null;
    }
  }
}

export const getSession = cache(async (): Promise<ValidateSession> => {
  try {
    const session = new SessionService();
    const cookiesStore = await cookies();

    const sessionCookie = cookiesStore.get('session')?.value;

    const sessionData = await session.decrypt(sessionCookie);

    if (!sessionData) {
      return {
        user: undefined,
        session: undefined,
      };
    }

    const user = await session.getUser(sessionData.userId);

    if (!user) {
      return {
        user: undefined,
        session: undefined,
      };
    }

    const result = {
      user,
      session: sessionData,
    };

    return result;
  } catch (error) {
    console.error('Failed to get session ', error);
    return {
      user: undefined,
      session: undefined,
    };
  }
});

export default SessionService;
