import { PostData } from '@/types/post';
import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import LoadingButton from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';

type PostDeleteDialogProps = {
  post: PostData;
  open: boolean;
  onClose: () => void;
};

export default function PostDeleteDialog(props: PostDeleteDialogProps) {
  // TODO: MAKE API FOR DELETE POST
  const mutation = useMutation();

  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>
            Are you sure want to delete this post? this action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            onClick={() =>
              mutation.mutate(props.post.id, { onSuccess: props.onClose })
            }
            loading={mutation.isPending}
          >
            Delete
          </LoadingButton>
          <Button
            variant="outline"
            onClick={props.onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
