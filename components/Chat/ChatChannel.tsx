import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
} from 'stream-chat-react';
import { Button } from '@/components/ui/button';

type ChatChannelProps = {
  open: boolean;
  openSidebar: () => void;
};

export default function ChatChannel({ open, openSidebar }: ChatChannelProps) {
  return (
    <div
      className={cn('w-full md:block border sm:rounded-2xl p-2', {
        hidden: !open,
      })}
    >
      <Channel>
        <Window>
          <CustomChannelHeader openSidebar={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}

interface CustomChannelHeaderProps extends ChannelHeaderProps {
  openSidebar: () => void;
}

function CustomChannelHeader({
  openSidebar,
  ...props
}: CustomChannelHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden">
        <Button size="icon" variant="ghost" onClick={openSidebar}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
}
