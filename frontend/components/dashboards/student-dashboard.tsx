'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, StatusBadge } from '@/components/shared/badge';
import { User } from '@/lib/auth-context';
import { Trophy, Users, Calendar, BookOpen } from 'lucide-react';
import Link from 'next/link';

export function StudentDashboard({ user }: { user: User }) {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground">Manage your hackathon journey</p>
      </div>

      {/* My Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">My Teams</div>
              <div className="text-4xl font-bold">2</div>
              <div className="text-xs text-muted-foreground mt-2">Active teams</div>
            </div>
            <Users className="h-12 w-12 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Projects Submitted</div>
              <div className="text-4xl font-bold">3</div>
              <div className="text-xs text-muted-foreground mt-2">1 finalist</div>
            </div>
            <BookOpen className="h-12 w-12 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm font-medium mb-2">Hackathons Attended</div>
              <div className="text-4xl font-bold">5</div>
              <div className="text-xs text-muted-foreground mt-2">1 won</div>
            </div>
            <Trophy className="h-12 w-12 text-primary opacity-20" />
          </div>
        </Card>
      </div>

      {/* My Current Hackathons */}
      <Card className="mb-8 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">My Registered Hackathons</h2>
          <Link href="/hackathons">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>

        <div className="space-y-4">
          {[
            {
              name: 'TechCrunch Disrupt 2024',
              date: 'Sep 15 - Sep 17, 2024',
              status: 'registered',
            },
            {
              name: 'DevFest Global 2024',
              date: 'Oct 1 - Oct 3, 2024',
              status: 'pending',
            },
          ].map((hack, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-4">
                <Calendar size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-semibold">{hack.name}</p>
                  <p className="text-sm text-muted-foreground">{hack.date}</p>
                </div>
              </div>
              <StatusBadge status={hack.status} />
            </div>
          ))}
        </div>
      </Card>

      {/* My Projects */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">My Projects</h2>
          <Button>Submit Project</Button>
        </div>

        <div className="space-y-4">
          {[
            { name: 'AI Chat Assistant', hackathon: 'TechCrunch', status: 'completed' },
            { name: 'Smart IoT Device', hackathon: 'DevFest', status: 'in_progress' },
          ].map((proj, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 cursor-pointer">
              <div>
                <p className="font-semibold">{proj.name}</p>
                <p className="text-sm text-muted-foreground">{proj.hackathon}</p>
              </div>
              <StatusBadge status={proj.status} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
