'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/badge';
import { User } from '@/lib/auth-context';
import { Trophy, Users, Calendar, BookOpen, Github, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import apis from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardStats {
  myTeams: { total: number; activeTeams: number };
  projectsSubmitted: { total: number; finalists: number };
  hackathonsAttended: { total: number; won: number };
}

interface RegisteredHackathon {
  _id: string;
  title: string;
  slug: string;
  status: string;
  registrationStatus: string;
  hackathonStart?: string;
  hackathonEnd?: string;
}

interface MyProject {
  _id: string;
  projectTitle: string;
  projectDescription: string;
  hackathonTitle: string;
  hackathonSlug: string;
  teamName: string;
  status: string;
  rawStatus: string;
  isFinal: boolean;
  totalScore?: number;
  githubRepo?: string;
  submittedAt: string;
}

interface DashboardData {
  stats: DashboardStats;
  registeredHackathons: RegisteredHackathon[];
  myProjects: MyProject[];
}

// ─── Skeleton Components ───────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <Card className="p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-3 w-28 bg-muted rounded" />
          <div className="h-9 w-16 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded" />
        </div>
        <div className="h-12 w-12 bg-muted rounded-full opacity-30" />
      </div>
    </Card>
  );
}

function ListItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-5 w-5 bg-muted rounded" />
        <div className="space-y-2">
          <div className="h-4 w-44 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted rounded" />
        </div>
      </div>
      <div className="h-6 w-20 bg-muted rounded-full" />
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateRange(start?: string, end?: string) {
  if (!start || !end) return 'Date TBA';
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

function ScorePill({ score }: { score: number }) {
  const color =
    score >= 90 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
      score >= 70 ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
        'bg-red-500/10 text-red-600 border-red-500/20';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${color}`}>
      <Star size={10} className="fill-current" />
      {score}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function StudentDashboard({ user }: { user: User }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        const res = await apis.get("/dashboard/student");
        const json = res.data;

        if (!json.success) throw new Error(json.message);

        if (isMounted) setData(json.data);
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  // ── Error state ──
  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-destructive text-sm font-medium">{error}</div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const stats = data?.stats;
  const hackathons = data?.registeredHackathons ?? [];
  const projects = data?.myProjects ?? [];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user.name}!
        </h1>
        <p className="text-muted-foreground">Manage your hackathon journey</p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted-foreground text-sm font-medium mb-2">My Teams</div>
                  <div className="text-4xl font-bold">{stats?.myTeams.total ?? 0}</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {stats?.myTeams.activeTeams ?? 0} active teams
                  </div>
                </div>
                <Users className="h-12 w-12 text-primary opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted-foreground text-sm font-medium mb-2">Projects Submitted</div>
                  <div className="text-4xl font-bold">{stats?.projectsSubmitted.total ?? 0}</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {stats?.projectsSubmitted.finalists ?? 0} finalist{stats?.projectsSubmitted.finalists !== 1 ? 's' : ''}
                  </div>
                </div>
                <BookOpen className="h-12 w-12 text-primary opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted-foreground text-sm font-medium mb-2">Hackathons Attended</div>
                  <div className="text-4xl font-bold">{stats?.hackathonsAttended.total ?? 0}</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {stats?.hackathonsAttended.won ?? 0} won
                  </div>
                </div>
                <Trophy className="h-12 w-12 text-primary opacity-20" />
              </div>
            </Card>
          </>
        )}
      </div>

      {/* ── Registered Hackathons ── */}
      <Card className="mb-8 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">My Registered Hackathons</h2>
          <Link href="/hackathons">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>

        <div className="space-y-4">
          {loading ? (
            <>
              <ListItemSkeleton />
              <ListItemSkeleton />
            </>
          ) : hackathons.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              You haven't registered for any hackathons yet.
            </p>
          ) : (
            hackathons.map((hack) => (
              <Link
                key={hack._id}
                href={`/hackathons/${hack.slug}`}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <Calendar size={20} className="text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-semibold">{hack.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateRange(hack.hackathonStart, hack.hackathonEnd)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={hack.registrationStatus} />
              </Link>
            ))
          )}
        </div>
      </Card>

      {/* ── My Projects ── */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">My Projects</h2>
          <Button>Submit Project</Button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <>
              <ListItemSkeleton />
              <ListItemSkeleton />
            </>
          ) : projects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No projects submitted yet.
            </p>
          ) : (
            projects.map((proj) => (
              <div
                key={proj._id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold truncate">{proj.projectTitle}</p>
                    {proj.isFinal && proj.totalScore !== undefined && (
                      <ScorePill score={proj.totalScore} />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{proj.projectDescription}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">{proj.hackathonTitle}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">Team: {proj.teamName}</span>
                    {proj.githubRepo && (
                      <>
                        <span className="text-xs text-muted-foreground">·</span>
                        <a
                          href={proj.githubRepo}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <Github size={11} />
                          Repo
                        </a>
                      </>
                    )}
                  </div>
                </div>
                <StatusBadge status={proj.rawStatus} />
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}