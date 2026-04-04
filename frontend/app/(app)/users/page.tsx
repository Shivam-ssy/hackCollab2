'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/shared/data-table';
import { Badge, StatusBadge } from '@/components/shared/badge';
import { Modal } from '@/components/shared/modal';
import { FormBuilder, FormField } from '@/components/shared/form-builder';
import { Plus, Mail, User } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

const mockUsers: UserData[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Student',
    status: 'active',
    joinDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'Judge',
    status: 'active',
    joinDate: '2024-01-20',
  },
  {
    id: '3',
    name: 'Carol White',
    email: 'carol@example.com',
    role: 'Company',
    status: 'pending',
    joinDate: '2024-02-01',
  },
];

const userColumns: Column<UserData>[] = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
          {row.name.charAt(0)}
        </div>
        <span>{row.name}</span>
      </div>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
    render: (email) => (
      <div className="flex items-center gap-2">
        <Mail size={16} className="text-muted-foreground" />
        {email}
      </div>
    ),
  },
  {
    key: 'role',
    label: 'Role',
    sortable: true,
    render: (role) => <Badge>{role}</Badge>,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (status) => <StatusBadge status={status} />,
  },
  {
    key: 'joinDate',
    label: 'Join Date',
    sortable: true,
  },
];

const formFields: FormField[] = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'John Doe',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'john@example.com',
    required: true,
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'student', label: 'Student' },
      { value: 'judge', label: 'Judge' },
      { value: 'company', label: 'Company' },
      { value: 'volunteer', label: 'Volunteer' },
    ],
    required: true,
  },
];

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState(mockUsers);

  const handleAddUser = async (data: Record<string, any>) => {
    const newUser: UserData = {
      id: String(users.length + 1),
      name: data.name,
      email: data.email,
      role: data.role.charAt(0).toUpperCase() + data.role.slice(1),
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Users</h1>
          <p className="text-muted-foreground">Manage all users in the system</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus size={20} />
          Add User
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={userColumns} data={users} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New User"
        description="Create a new user in the system"
      >
        <FormBuilder fields={formFields} onSubmit={handleAddUser} submitLabel="Create User" />
      </Modal>
    </div>
  );
}
