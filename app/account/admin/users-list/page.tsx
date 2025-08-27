import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { type User } from '@prisma/client';
import { InlineRoleForm } from './RoleForm';
import { DeleteUserForm } from './DeleteUserForm';
import { UserRow } from './UserRow';

export default async function UsersListPage() {
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }

  

  let users : User[] = [];
  let dbError = false;

  try {
    users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (err) {
    console.error('DB connection error:', err);
    dbError = true;
  }

  const filteredUsers = users.filter((u) => u.id !== session.user.id);

  return (
    <div className="tab__content active-tab">
      <h3 className="tab__header">Users & Admins List</h3>

      <table className="placed__order-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
  {filteredUsers.map((user) => (
    <UserRow key={user.id} user={user} />
  ))}
</tbody>
      </table>
    </div>
  );
}