import { User } from '@prisma/client';
import { JWTPayload } from 'jose';

export type SessionPayload = {
  userId: string;
  expireAt: Date;
};

type Credentials = {
  username?: string;
  email?: string;
  password: string;
};

export type LoginAction = (
  params: Credentials
) => Promise<ServerActionResponse>;

export type SignUpAction = (
  params: Credentials
) => Promise<ServerActionResponse>;

export type Session = JWTPayload & {
  userId: string;
};

export type ValidateSession = {
  user?: Omit<User, 'passwordHash' | 'googleId'>;
  session?: Session;
};
