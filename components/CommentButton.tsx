import { PostData } from '@/types/post';
import { MessageSquare } from 'lucide-react';

type CommentButtonProps = {
  post: PostData;
  onClick: () => void;
};

export default function CommentButton(props: CommentButtonProps) {
  return (
    <button className="flex items-center gap-2" onClick={props.onClick}>
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {props.post._count.comments}{' '}
        <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
}
