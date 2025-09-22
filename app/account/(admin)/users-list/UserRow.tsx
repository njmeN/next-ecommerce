'use client';

import { useState } from 'react';
import { InlineRoleForm } from './RoleForm';
import { DeleteUserForm } from './DeleteUserForm';
import { type User } from '@prisma/client';

export function UserRow({ user }: { user: User }) {
  const [role, setRole] = useState(user.role);

  return (
    <tr>
      <td>{user.email}</td>
      <td>
        <InlineRoleForm
          userId={user.id}
          currentRole={role}
          onRoleChange={(newRole) => setRole(newRole)}
        />
      </td>
      <td>
        <DeleteUserForm userId={user.id} />
      </td>
    </tr>
  );
}

