import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
  useChatContext,
} from 'stream-chat-react';
import ChatHeader from './CharHeader';

type ChatSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function ChatSidebar({ open, onClose }: ChatSidebarProps) {
  const user = useSession();

  const queryClient = useQueryClient();

  const { channel } = useChatContext();

  useEffect(() => {
    if (channel?.id) {
      queryClient.invalidateQueries({
        queryKey: ['unread-messages-count'],
      });
    }
  }, [channel?.id, queryClient]);

  const channelPreview = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose]
  );

  return (
    <div
      className={cn(
        'size-full flex-col border sm:rounded-2xl md:flex md:w-72',
        {
          flex: open,
          hidden: !open,
        }
      )}
    >
      <ChatHeader onClose={onClose} />
      <ChannelList
        filters={{
          type: 'messaging',
          members: { $in: [user?.id as string] },
        }}
        showChannelSearch
        options={{ state: true, presence: true, limit: 8 }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: { members: { $in: [user?.id as string] } },
            },
          },
        }}
        Preview={channelPreview}
      />
    </div>
  );
}
