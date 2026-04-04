'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, StatusBadge } from '@/components/shared/badge';
import { User } from '@/lib/auth-context';
import { Star, CheckCircle, Clock } from 'lucide-react';
import { DataTable, Column } from '@/components/shared/data-table';

interface ProjectForReview {
  id: string;
  name: string;
  team: string;
  hackathon: string;
  status: string;
  score?: number;
}

const projectsForReview: ProjectForReview[] = [
  {
    id: '1',
    name: 'AI Code Assistant',
    team: 'TechVision',
    hackathon: 'TechCrunch',
    status: 'pending',
  },
  {
    id: '2',
    name: 'Blockchain Voting',
    team: 'ChainFlow',
    hackathon: 'DevFest',
    status: 'in_progress',
  },
  {
    id: '3',
    name: 'Smart IoT Device',
    team: 'EcoTech',
    hackathon: 'TechCrunch',
    status: 'pending',
    score: 85,
  },
];

const columns: Column<ProjectForReview>[] = [
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
  },
  {
    key: 'status',
    label: 'Status',
    render: (status) => <StatusBadge status={status} />,
  },
  {
    key: 'score',
    label: 'Your Score',
    render: (score) => score ? <Badge variant="success">{score}/100</Badge> : <span className="text-muted-foreground">-</span>,
  },
];

export function JudgeDashboard({ user }: { user: User }) {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground">Review and score projects</p>
      </div>

      {/* Judging Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Projects Reviewed</div>
              <div className="text-4xl font-bold">12</div>
              <div className="text-xs text-muted-foreground mt-2">Out of 25 assigned</div>
            </div>
            <CheckCircle className="h-12 w-12 text-green-600 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Avg Score Given</div>
              <div className="text-4xl font-bold">78</div>
              <div className="text-xs text-muted-foreground mt-2">Out of 100</div>
            </div>
            <Star className="h-12 w-12 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Pending Reviews</div>
              <div className="text-4xl font-bold">13</div>
              <div className="text-xs text-blue-600 mt-2">Reviews needed</div>
            </div>
            <Clock className="h-12 w-12 text-blue-600 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Projects to Review */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Projects to Review</h2>
          <Badge variant="warning">{projectsForReview.filter(p => p.status === 'pending').length} Pending</Badge>
        </div>
        <DataTable columns={columns} data={projectsForReview} />
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Start Reviewing</Button>
          <Button variant="outline">View Scorecard</Button>
          <Button variant="outline">Download Results</Button>
        </div>
      </Card>
    </div>
  );
}
