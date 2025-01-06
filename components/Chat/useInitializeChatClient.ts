import { useSession } from '@/hooks/useSession';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';

export default function useInitializeChatClient() {
  const user = useSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  const getToken = async (): Promise<string> => {
    return await api.get<string>('/api/token').then((json) => json.data);
  };

  useEffect(() => {
    if (!user?.id) return;
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);

    client
      .connectUser(
        {
          id: user.id,
          username: user.username,
          name: user.displayName,
          image: user.avatarUrl,
        },
        async () => await getToken()
      )
      .then(() => setChatClient(client))
      .catch((error) => console.error(error));

    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .then(() => console.log('Connection Closed'))
        .catch((error) => console.error(error));
    };
  }, [user?.id, user?.username, user?.displayName, user?.avatarUrl]);

  return chatClient;
}
