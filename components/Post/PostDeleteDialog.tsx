import { PostData } from '@/types/post';
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
import { useDeletePostMutation } from './mutation';

type PostDeleteDialogProps = {
  post: PostData;
  open: boolean;
  onClose: () => void;
};

export default function PostDeleteDialog(props: PostDeleteDialogProps) {
  // TODO: MAKE API FOR DELETE POST
  const mutation = useDeletePostMutation();

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
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              props.onClose();
            }}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <LoadingButton
            onClick={(e) => {
              e.stopPropagation();
              mutation.mutate(props.post.id, { onSuccess: props.onClose });
            }}
            loading={mutation.isPending}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
