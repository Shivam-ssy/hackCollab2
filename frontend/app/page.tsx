'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Hero from '@/components/Landing/Hero';
import Why from '@/components/Landing/Why';
import Roles from '@/components/Landing/Roles';
import HowItWorks from '@/components/Landing/HowItWorks';
import CTA from '@/components/Landing/CTA';
import Navbar from '@/components/NavBar';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth(); // ✅ make sure your hook provides loading

  useEffect(() => {
    // ✅ wait for auth to finish before redirect
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // ✅ prevent flicker while checking auth
  if (loading) {
    return null; // or loader
  }

  return (
    <>
      {/* ✅ Navbar always visible */}
      <Navbar />

      {/* ✅ Show landing page ONLY if user is NOT logged in */}
      {!user && (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
          <div className="container mx-auto px-4 py-20">
            <Hero />
            <Why />
            <Roles />
            <HowItWorks />
            <CTA />
          </div>
        </div>
      )}
    </>
  );
}