'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, StatusBadge } from '@/components/shared/badge';
import { DataTable, Column } from '@/components/shared/data-table';
import { Plus, Calendar, Users } from 'lucide-react';

interface HackathonData {
  id: string;
  name: string;
  date: string;
  location: string;
  participants: number;
  status: string;
}

const mockHackathons: HackathonData[] = [
  {
    id: '1',
    name: 'TechCrunch Disrupt 2024',
    date: '2024-09-15',
    location: 'San Francisco',
    participants: 250,
    status: 'active',
  },
  {
    id: '2',
    name: 'DevFest Global 2024',
    date: '2024-10-01',
    location: 'Virtual',
    participants: 500,
    status: 'active',
  },
  {
    id: '3',
    name: 'AI Innovation Summit',
    date: '2024-11-10',
    location: 'New York',
    participants: 120,
    status: 'pending',
  },
];

const columns: Column<HackathonData>[] = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    render: (date) => (
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-muted-foreground" />
        {new Date(date).toLocaleDateString()}
      </div>
    ),
  },
  {
    key: 'location',
    label: 'Location',
    sortable: true,
  },
  {
    key: 'participants',
    label: 'Participants',
    sortable: true,
    render: (count) => (
      <div className="flex items-center gap-2">
        <Users size={16} className="text-muted-foreground" />
        {count}
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (status) => <StatusBadge status={status} />,
  },
];

export default function HackathonsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hackathons</h1>
          <p className="text-muted-foreground">Manage all hackathons</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          Create Hackathon
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={mockHackathons} />
      </Card>
    </div>
  );
}
