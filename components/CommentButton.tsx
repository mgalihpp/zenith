import { PostData } from '@/types/post';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

type CommentButtonProps = {
  post: PostData;
  onClick: (e: React.MouseEvent) => void;
};

export default function CommentButton(props: CommentButtonProps) {
  return (
    <Button
      className="flex items-center gap-2 relative group text-muted-foreground"
      onClick={props.onClick}
      variant="ghost"
      size="icon"
    >
      <MessageSquare className="size-5 group-hover:text-blue-600" />
      <span className="absolute left-full top-1/2 transform -translate-y-1/2 text-xs font-medium tabular-nums group-hover:text-blue-600 transition-colors">
        {props.post._count.comments}
      </span>
    </Button>
  );
}
