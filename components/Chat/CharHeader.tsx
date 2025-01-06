'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MailPlus, X } from 'lucide-react';
import NewChatDialog from './NewChatDialog';

type ChatHeaderProps = {
  onClose: () => void;
};

export default function ChatHeader(props: ChatHeaderProps) {
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 p-2">
        <div className="h-full md:hidden">
          <Button size="icon" variant="ghost" onClick={props.onClose}>
            <X className="size-5" />
          </Button>
        </div>
        <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>

        <Button
          size="icon"
          variant="ghost"
          title="Start new chat"
          onClick={() => setShowNewChatDialog(true)}
        >
          <MailPlus className="size-5" />
        </Button>
      </div>
      {showNewChatDialog && (
        <NewChatDialog
          onOpenChange={setShowNewChatDialog}
          onChatCreated={() => {
            setShowNewChatDialog(false);
            props.onClose();
          }}
        />
      )}
    </>
  );
}
