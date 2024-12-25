'use server';

import { db } from '@/lib/prisma';
import SessionService from '@/services/session.service';
import { loginSchema } from '@/lib/validation';
import { LoginAction } from '@/types/auth';
import { verify } from '@node-rs/argon2';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';

export const login: LoginAction = async (params) => {
  try {
    const { username, password } = loginSchema.parse(params);

    // Check if the user exists in the database
    const existingUser = await db.user.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: 'Invalid email or password',
      };
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return {
        error: 'Invalid email or password',
      };
    }

    const session = new SessionService();

    await session.createSession(existingUser.id);

    return redirect('/');
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: 'Invalid login credentials',
    };
  }
};
