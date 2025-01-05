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
import { CommentData } from '@/types/comment';
import { useDeleteCommentMutation } from './mutation';

type CommentDeleteDialogProps = {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
};

export default function CommentDeleteDialog(props: CommentDeleteDialogProps) {
  // TODO: MAKE API FOR DELETE POST
  const mutation = useDeleteCommentMutation();

  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Comment?</DialogTitle>
          <DialogDescription>
            Are you sure want to delete this Comment? this action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={props.onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <LoadingButton
            onClick={() =>
              mutation.mutate(props.comment.id, { onSuccess: props.onClose })
            }
            loading={mutation.isPending}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
