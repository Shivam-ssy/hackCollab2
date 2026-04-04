'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, StatusBadge } from '@/components/shared/badge';
import { User } from '@/lib/auth-context';
import { Briefcase, Eye, Users, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Week 1', views: 400, applications: 240 },
  { name: 'Week 2', views: 300, applications: 221 },
  { name: 'Week 3', views: 200, applications: 229 },
  { name: 'Week 4', views: 278, applications: 200 },
];

export function CompanyDashboard({ user }: { user: User }) {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground">Manage your company&apos;s presence</p>
      </div>

      {/* Company Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Problems Posted</div>
              <div className="text-4xl font-bold">3</div>
              <div className="text-xs text-green-600 mt-2">2 active</div>
            </div>
            <Briefcase className="h-12 w-12 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Total Views</div>
              <div className="text-4xl font-bold">1.2K</div>
              <div className="text-xs text-green-600 mt-2">+23% this week</div>
            </div>
            <Eye className="h-12 w-12 text-blue-600 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Submissions Received</div>
              <div className="text-4xl font-bold">24</div>
              <div className="text-xs text-muted-foreground mt-2">8 pending review</div>
            </div>
            <Users className="h-12 w-12 text-green-600 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Avg Rating</div>
              <div className="text-4xl font-bold">4.5</div>
              <div className="text-xs text-muted-foreground mt-2">Out of 5</div>
            </div>
            <TrendingUp className="h-12 w-12 text-primary opacity-20" />
          </div>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Problem Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
            <Bar dataKey="views" fill="#7c3aed" />
            <Bar dataKey="applications" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Your Problems */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Your Problems</h2>
          <Button>Post New Problem</Button>
        </div>

        <div className="space-y-4">
          {[
            {
              name: 'Mobile App Backend',
              views: 450,
              submissions: 12,
              status: 'active',
            },
            {
              name: 'Data Analytics Tool',
              views: 320,
              submissions: 8,
              status: 'active',
            },
            {
              name: 'Cloud Migration',
              views: 180,
              submissions: 4,
              status: 'closed',
            },
          ].map((problem, i) => (
            <div key={i} className="p-4 border border-border rounded-lg hover:border-primary/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{problem.name}</h3>
                <StatusBadge status={problem.status} />
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <span>👁 {problem.views} views</span>
                <span>📧 {problem.submissions} submissions</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
