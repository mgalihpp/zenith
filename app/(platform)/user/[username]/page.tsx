'use client';

import { use } from 'react';

type PageProps = {
  params: Promise<{ username: string }>;
};

export default function UserPage({ params }: PageProps) {
  const { username: usernameParams } = use(params);
  const username = decodeURIComponent(usernameParams);

  return <div>{username}</div>;
}
