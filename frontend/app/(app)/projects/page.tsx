'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, StatusBadge } from '@/components/shared/badge';
import { DataTable, Column } from '@/components/shared/data-table';
import { Plus, Users } from 'lucide-react';

interface ProjectData {
  id: string;
  name: string;
  team: string;
  hackathon: string;
  teamSize: number;
  status: string;
}

const mockProjects: ProjectData[] = [
  {
    id: '1',
    name: 'AI Code Assistant',
    team: 'TechVision',
    hackathon: 'TechCrunch Disrupt',
    teamSize: 4,
    status: 'in_progress',
  },
  {
    id: '2',
    name: 'Smart Water Monitor',
    team: 'EcoTech',
    hackathon: 'DevFest Global',
    teamSize: 3,
    status: 'completed',
  },
  {
    id: '3',
    name: 'Blockchain Voting',
    team: 'ChainFlow',
    hackathon: 'AI Innovation Summit',
    teamSize: 5,
    status: 'pending',
  },
];

const columns: Column<ProjectData>[] = [
  {
    key: 'name',
    label: 'Project Name',
    sortable: true,
  },
  {
    key: 'team',
    label: 'Team',
    sortable: true,
  },
  {
    key: 'hackathon',
    label: 'Hackathon',
    sortable: true,
  },
  {
    key: 'teamSize',
    label: 'Team Size',
    sortable: true,
    render: (size) => (
      <div className="flex items-center gap-2">
        <Users size={16} className="text-muted-foreground" />
        {size}
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (status) => <StatusBadge status={status} />,
  },
];

export default function ProjectsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">View all submitted projects</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          New Project
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={mockProjects} />
      </Card>
    </div>
  );
}
