'use server';

import { cookies } from 'next/headers';

type CookieStore = {
  name: string;
  value: string;
  path: string;
};

export async function getCookieData(): Promise<CookieStore[]> {
  const cookieData = (await cookies()).getAll();

  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(cookieData as CookieStore[]);
    }, 1000)
  );
}
