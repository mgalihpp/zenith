'use client';

import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from '@/lib/validation';
import { UserData } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useUpdateUserProfileMutation } from '../mutation';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import AvatarInput from './AvatarInput';
import avatarPlaceholder from '@/assets/avatar-placeholder.png';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LoadingButton from '@/components/LoadingButton';

type EditProfileDialogProps = {
  user: UserData;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditProfileDialog(props: EditProfileDialogProps) {
  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      displayName: props.user.displayName,
      bio: props.user.bio || '',
    },
  });

  const mutation = useUpdateUserProfileMutation();

  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

  const onSubmit = (data: UpdateUserProfileValues) => {
    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${props.user.id}.webp`)
      : undefined;

    mutation.mutate(
      {
        data,
        avatar: newAvatarFile,
      },
      {
        onSuccess: () => {
          setCroppedAvatar(null);
          props.setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Edit your profile information such as display name, bio, and avatar.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Avatar</Label>
          <AvatarInput
            onImageCropped={setCroppedAvatar}
            src={
              croppedAvatar
                ? URL.createObjectURL(croppedAvatar)
                : props.user.avatarUrl || avatarPlaceholder
            }
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your display name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton
                type="submit"
                loading={mutation.isPending}
                className="font-bold rounded-full"
              >
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
