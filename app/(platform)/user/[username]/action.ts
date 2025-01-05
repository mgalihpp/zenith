'use server';

import { db } from '@/lib/prisma';
import streamServerClient from '@/lib/stream-chat';
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from '@/lib/validation';
import { getSession } from '@/services/session.service';
import UserService from '@/services/user.service';

export async function UpdateUser(input: UpdateUserProfileValues) {
  const { bio, displayName } = updateUserProfileSchema.parse(input);

  const { user } = await getSession();

  if (!user) throw new Error('Unauthorized');

  const updatedUser = await db.$transaction(async () => {
    const [updatedUser] = await Promise.all([
      await new UserService().updateUser(user.id, {
        bio,
        displayName,
      }),
      await streamServerClient.partialUpdateUser({
        id: user.id,
        set: {
          name: displayName,
        },
      }),
    ]);

    return updatedUser;
  });

  return updatedUser;
}
