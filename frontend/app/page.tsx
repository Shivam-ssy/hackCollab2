'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Hero from '@/components/Landing/Hero';
import Why from '@/components/Landing/Why';
import Roles from '@/components/Landing/Roles';
import HowItWorks from '@/components/Landing/HowItWorks';
import CTA from '@/components/Landing/CTA';
import Navbar from '@/components/NavBar';
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
        {/* <div className="flex items-center justify-between mb-20">
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
        </div> */}
        <Navbar />
        {/* Hero */}
        <div className="text-black">
          <Hero />
          <Why />
          <Roles />
          <HowItWorks />
          <CTA />
        </div>

        {/* Features */}


        {/* CTA */}

      </div>
    </div>
  );
}
