'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, StatusBadge } from '@/components/shared/badge';
import { User } from '@/lib/auth-context';
import { Users, Trophy, Zap, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockTrend = [
  { month: 'Jan', students: 45, teams: 10, projects: 8 },
  { month: 'Feb', students: 62, teams: 14, projects: 12 },
  { month: 'Mar', students: 78, teams: 18, projects: 16 },
  { month: 'Apr', students: 95, teams: 22, projects: 20 },
];

export function CollegeAdminDashboard({ user }: { user: User }) {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">College Portal - {user.college || 'Your College'}</h1>
        <p className="text-muted-foreground">Manage your college&apos;s hackathon participation</p>
      </div>

      {/* College Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Registered Students</div>
              <div className="text-4xl font-bold">95</div>
              <div className="text-xs text-green-600 mt-2">+12% this month</div>
            </div>
            <Users className="h-12 w-12 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Teams Formed</div>
              <div className="text-4xl font-bold">22</div>
              <div className="text-xs text-muted-foreground mt-2">Across events</div>
            </div>
            <Zap className="h-12 w-12 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Projects Submitted</div>
              <div className="text-4xl font-bold">20</div>
              <div className="text-xs text-muted-foreground mt-2">3 finalists</div>
            </div>
            <Trophy className="h-12 w-12 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Hackathons Active</div>
              <div className="text-4xl font-bold">4</div>
              <div className="text-xs text-green-600 mt-2">All regions</div>
            </div>
            <TrendingUp className="h-12 w-12 text-primary opacity-20" />
          </div>
        </Card>
      </div>

      {/* Growth Chart */}
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Participation Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
            <Line type="monotone" dataKey="students" stroke="#7c3aed" strokeWidth={2} />
            <Line type="monotone" dataKey="teams" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="projects" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Student & Team Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Top Performing Teams</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'TechVision', members: 4, projects: 2 },
              { name: 'EcoTech', members: 3, projects: 2 },
              { name: 'AI Innovators', members: 5, projects: 1 },
            ].map((team, i) => (
              <div key={i} className="p-3 border border-border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{team.name}</h3>
                  <Badge>{team.projects} projects</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{team.members} members</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Resources */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Resources & Support</h2>
          <div className="space-y-3">
            <Button className="w-full" variant="outline">Download Report</Button>
            <Button className="w-full" variant="outline">Student Guidelines</Button>
            <Button className="w-full" variant="outline">Event Calendar</Button>
            <Button className="w-full" variant="outline">Contact Support</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
