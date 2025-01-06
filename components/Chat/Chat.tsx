'use client';

import { useTheme } from 'next-themes';
import useInitializeChatClient from './useInitializeChatClient';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Chat as StreamChat } from 'stream-chat-react';
import ChatSidebar from './ChatSidebar';
import 'stream-chat-react/dist/css/v2/index.css';
import './chatStyles.css';
import ChatChannel from './ChatChannel';

export default function Chat() {
  const chatClient = useInitializeChatClient();

  const { resolvedTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!chatClient) {
    return <Loader2 className="animate-spin mx-auto my-3" />;
  }

  return (
    <div className="relative w-full overflow-hidden sm:rounded-2xl bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full gap-2">
        <StreamChat
          client={chatClient}
          theme={
            resolvedTheme === 'dark'
              ? 'str-chat__theme-dark'
              : 'str-chat__theme-light'
          }
          customClasses={{
            channelList: 'border-none',
          }}
        >
          <ChatSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <ChatChannel
            open={!sidebarOpen}
            openSidebar={() => setSidebarOpen(true)}
          />
        </StreamChat>
      </div>
    </div>
  );
}
