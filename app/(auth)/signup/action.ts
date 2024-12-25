'use server';

import { db } from '@/lib/prisma';
import SessionService from '@/services/session.service';
import { signUpSchema } from '@/lib/validation';
import { SignUpAction } from '@/types/auth';
import { hash } from '@node-rs/argon2';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';

export const signup: SignUpAction = async (params) => {
  try {
    const { email, username, password } = signUpSchema.parse(params);

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const existingUsername = await db.user.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
    });

    if (existingUsername) {
      return {
        error: 'Username already exists',
      };
    }

    const existingEmail = await db.user.findFirst({
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (existingEmail) {
      return {
        error: 'Email already taken',
      };
    }

    const user = await db.user.create({
      data: {
        username,
        email,
        displayName: username,
        passwordHash,
      },
    });

    const session = new SessionService();

    await session.createSession(user.id);

    return redirect('/');
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: 'Something went wrong. Please try again.',
    };
  }
};
