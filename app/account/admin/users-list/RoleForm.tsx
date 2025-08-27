import { updateUserRole } from "@/lib/actions/account";
import { ChevronDown } from "lucide-react";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export function InlineRoleForm({ userId, currentRole, onRoleChange }: { userId: string; currentRole: string; onRoleChange?: (newRole: string) => void }) {
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [isPending, startTransition] = useTransition();
  const [changed, setChanged] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent page reload
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await updateUserRole(formData);
        toast.success('User role updated');
        const newRole = formData.get('role') as string;
        setSelectedRole(newRole);
        onRoleChange?.(newRole);
        setChanged(false);
      } catch (err: any) {
        toast.error(err.message || 'Failed to update role');
      }
    });
  };

  React.useEffect(() => {
    setSelectedRole(currentRole);
  }, [currentRole]);

  return (
    <form onSubmit={handleSubmit} className="form-inline tr-space">
      <input type="hidden" name="id" value={userId} />
      <div className="select-wrapper">
        <select
          name="role"
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setChanged(e.target.value !== currentRole);
          }}
          className="form__input custom-select"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>          
        </select>
        <ChevronDown className="select-icon" size={18} />
      </div>
      {changed && (
        <button className="btn btn__xs" type="submit" disabled={isPending}>
          {isPending ? 'Updating...' : 'Update'}
        </button>
      )}
    </form>
  );
}
