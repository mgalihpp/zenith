import TrendSidebar from '@/components/Navbar/TrendSidebar';
import { Metadata } from 'next';
import Notifications from './_components/Notifications';
import Navbar from '@/components/Navbar';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'View your notifications',
};

export default function NotificationsPage() {
  return (
    <div className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-2">
        <Navbar title="Notifications" />
        <Notifications />
      </div>
      <TrendSidebar />
    </div>
  );
}
