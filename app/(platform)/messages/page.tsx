import Chat from '@/components/Chat/Chat';
import { Metadata } from 'next';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Messages',
};

export default function MessagesPage() {
  return <Chat />;
}
