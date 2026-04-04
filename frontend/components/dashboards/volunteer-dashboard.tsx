'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, StatusBadge } from '@/components/shared/badge';
import { User } from '@/lib/auth-context';
import { Clipboard, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export function VolunteerDashboard({ user }: { user: User }) {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground">Manage your volunteer tasks and assignments</p>
      </div>

      {/* Volunteer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Tasks Assigned</div>
              <div className="text-4xl font-bold">8</div>
              <div className="text-xs text-muted-foreground mt-2">Total</div>
            </div>
            <Clipboard className="h-12 w-12 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Completed</div>
              <div className="text-4xl font-bold">5</div>
              <div className="text-xs text-green-600 mt-2">62% done</div>
            </div>
            <CheckCircle className="h-12 w-12 text-green-600 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">In Progress</div>
              <div className="text-4xl font-bold">2</div>
              <div className="text-xs text-blue-600 mt-2">Active</div>
            </div>
            <Clock className="h-12 w-12 text-blue-600 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Hours Volunteered</div>
              <div className="text-4xl font-bold">24</div>
              <div className="text-xs text-muted-foreground mt-2">This month</div>
            </div>
            <Clock className="h-12 w-12 text-primary opacity-20" />
          </div>
        </Card>
      </div>

      {/* Current Tasks */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">My Tasks</h2>
          <Badge variant="warning">2 In Progress</Badge>
        </div>

        <div className="space-y-4">
          {[
            {
              title: 'Setup Registration Desk',
              hackathon: 'TechCrunch Disrupt',
              date: '2024-09-15',
              status: 'in_progress',
              priority: 'high',
            },
            {
              title: 'Monitor Submissions',
              hackathon: 'TechCrunch Disrupt',
              date: '2024-09-16',
              status: 'in_progress',
              priority: 'high',
            },
            {
              title: 'Assist Judging Panel',
              hackathon: 'DevFest Global',
              date: '2024-10-01',
              status: 'pending',
              priority: 'medium',
            },
            {
              title: 'Award Ceremony Setup',
              hackathon: 'DevFest Global',
              date: '2024-10-03',
              status: 'pending',
              priority: 'low',
            },
            {
              title: 'Distribute Merch',
              hackathon: 'TechCrunch Disrupt',
              date: '2024-09-17',
              status: 'completed',
              priority: 'medium',
            },
          ].map((task, i) => (
            <div key={i} className="p-4 border border-border rounded-lg hover:border-primary/50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">{task.hackathon}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">📅 {task.date}</span>
                <Badge
                  variant={
                    task.priority === 'high'
                      ? 'error'
                      : task.priority === 'medium'
                      ? 'warning'
                      : 'outline'
                  }
                  size="sm"
                >
                  {task.priority}
                </Badge>
                {task.status !== 'completed' && (
                  <Button size="sm" variant="ghost" className="ml-auto">
                    Update
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Help & Support */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Need Help?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="w-full">FAQ</Button>
          <Button variant="outline" className="w-full">Volunteer Guide</Button>
          <Button variant="outline" className="w-full">Contact Manager</Button>
          <Button variant="outline" className="w-full">Report Issue</Button>
        </div>
      </Card>
    </div>
  );
}
