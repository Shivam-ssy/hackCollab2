'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/auth-context';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, Trophy, Zap, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const mockChartData = [
  { name: 'Jan', users: 400, projects: 240 },
  { name: 'Feb', users: 300, projects: 221 },
  { name: 'Mar', users: 200, projects: 229 },
  { name: 'Apr', users: 278, projects: 200 },
  { name: 'May', users: 190, projects: 229 },
  { name: 'Jun', users: 239, projects: 200 },
];

const mockDistribution = [
  { name: 'Students', value: 400 },
  { name: 'Companies', value: 300 },
  { name: 'Judges', value: 200 },
  { name: 'Volunteers', value: 100 },
];

const colors = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444'];

export function AdminDashboard({ user }: { user: User }) {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">System Overview & Management</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Total Users</div>
              <div className="text-4xl font-bold">1,234</div>
              <div className="text-xs text-green-600 mt-2">+12% from last month</div>
            </div>
            <Users className="h-12 w-12 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Active Hackathons</div>
              <div className="text-4xl font-bold">8</div>
              <div className="text-xs text-green-600 mt-2">2 starting this week</div>
            </div>
            <Trophy className="h-12 w-12 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Total Projects</div>
              <div className="text-4xl font-bold">523</div>
              <div className="text-xs text-blue-600 mt-2">45 pending review</div>
            </div>
            <Zap className="h-12 w-12 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">System Health</div>
              <div className="text-4xl font-bold">99.8%</div>
              <div className="text-xs text-green-600 mt-2">All systems operational</div>
            </div>
            <AlertCircle className="h-12 w-12 text-primary opacity-20" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Line Chart */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold mb-4">Growth Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Line type="monotone" dataKey="users" stroke="#7c3aed" strokeWidth={2} />
              <Line type="monotone" dataKey="projects" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">User Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {mockDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/users">
            <Button className="w-full" variant="outline">Manage Users</Button>
          </Link>
          <Link href="/hackathons">
            <Button className="w-full" variant="outline">Create Hackathon</Button>
          </Link>
          <Button className="w-full" variant="outline">View Reports</Button>
          <Button className="w-full" variant="outline">Settings</Button>
        </div>
      </Card>
    </div>
  );
}
