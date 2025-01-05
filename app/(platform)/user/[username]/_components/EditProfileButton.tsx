'use client';

import { Button } from '@/components/ui/button';
import { UserData } from '@/types/user';
import { useState } from 'react';
import EditProfileDialog from './EditProfileDialog';

type EditProfileButtonProps = {
  user: UserData;
};

export default function EditProfileButton(props: EditProfileButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button
        className="rounded-full font-bold"
        onClick={() => setShowDialog(true)}
      >
        Edit Profile
      </Button>
      <EditProfileDialog
        open={showDialog}
        setOpen={setShowDialog}
        user={props.user}
      />
    </>
  );
}
