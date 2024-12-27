import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import { useRef } from 'react';

type AddAttachmentsButtonProps = {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
};

export default function AddAttachmentButton(props: AddAttachmentsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary"
        disabled={props.disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        name="file"
        id="file"
        accept="image/*, video/*"
        multiple
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            props.onFilesSelected(files);
            e.target.value = '';
          }
        }}
      />
    </>
  );
}
