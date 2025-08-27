'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { deleteUser } from '@/lib/actions/account';

export function DeleteUserForm({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (formData: FormData) => {
    startTransition(async () => {
      try {
        await deleteUser(formData);
        toast.success('User deleted successfully');
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete user');
      }
    });
  };

  return (
    <form action={handleDelete}>
      <input type="hidden" name="id" value={userId} />
      <button type="submit" className="btn__danger" disabled={isPending}>
        <Trash2 />
      </button>
    </form>
  );
}
