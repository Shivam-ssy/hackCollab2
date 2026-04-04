'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-20">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-20">
          <div>
            <h1 className="text-3xl font-bold">HackHub</h1>
            <p className="text-muted-foreground mt-1">Hackathon Management</p>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Manage Hackathons <span className="text-primary">Effortlessly</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A comprehensive platform designed for hackathon organizers, participants, judges, and sponsors.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: 'Admin Dashboard',
              description: 'Manage hackathons, users, and all system settings from one place',
            },
            {
              title: 'Team Management',
              description: 'Create teams, invite members, and collaborate seamlessly',
            },
            {
              title: 'Smart Judging',
              description: 'Streamlined scoring system for fair and transparent evaluation',
            },
            {
              title: 'Real-time Updates',
              description: 'Stay updated with instant notifications and live dashboards',
            },
            {
              title: 'Project Showcase',
              description: 'Submit and showcase projects with rich media support',
            },
            {
              title: 'Analytics',
              description: 'Comprehensive insights into hackathon performance and engagement',
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition">
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center p-12 rounded-2xl bg-primary/10 border border-primary/20">
          <h3 className="text-3xl font-bold mb-4">Ready to organize a great hackathon?</h3>
          <p className="text-muted-foreground mb-6">
            Join hundreds of hackathons using HackHub today.
          </p>
          <Link href="/signup">
            <Button size="lg">Start Free</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
