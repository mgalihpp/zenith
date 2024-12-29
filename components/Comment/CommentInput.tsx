'use client';

import { Input } from '@/components/ui/input';
import { Loader2, SendHorizonal } from 'lucide-react';
import { useSubmitCommentMutation } from './mutation';
import { useState } from 'react';
import { PostData } from '@/types/post';
import { Button } from '@/components/ui/button';

type CommentInputProps = {
  post: PostData;
};

export default function CommentInput(props: CommentInputProps) {
  const [input, setInput] = useState('');

  const mutation = useSubmitCommentMutation();
  async function onSubmit() {
    if (!input) return;

    mutation.mutate(
      {
        post: props.post,
        content: input,
      },
      {
        onSuccess: () => setInput(''),
      }
    );
  }
  return (
    <div className="flex w-full items-center gap-2 border-b pb-2">
      <Input
        placeholder="Write a comment..."
        className="h-9 w-full text-sm rounded-none border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        autoFocus
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!input.trim() || mutation.isPending}
        onClick={() => onSubmit()}
      >
        {mutation.isPending ? (
          <Loader2 className="animate-spin size-5" />
        ) : (
          <SendHorizonal className="size-5" />
        )}
      </Button>
    </div>
  );
}
