import PrismaQueryHelper from '@/helpers/prismaQuery';
import { Prisma } from '@prisma/client';

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof PrismaQueryHelper.prototype.getUserDataSelect>;
}>;
