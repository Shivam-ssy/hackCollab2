"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "For Teams", href: "/#roles" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  // Fix SSR issue (run only on client)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setDark(savedTheme === "dark");
      } else {
        setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
      }
    }
  }, []);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (loading) return null;

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--color-bg)]/80 backdrop-blur-xl shadow-[0_1px_0_var(--color-border)]"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
          
          {/* LOGO */}
          <Link
            href="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-[9px] flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-accent-500)] shadow">
              🏠
            </div>
            <span className="text-[1.1rem] font-bold">
              HackCollab
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <ul className="hidden md:flex flex-1 justify-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="px-3 py-1.5 text-sm hover:bg-gray-100 rounded"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-3">

            <button
              onClick={() => setDark(!dark)}
              className="w-9 h-9 border rounded flex items-center justify-center"
            >
              {dark ? "🌙" : "☀️"}
            </button>

            {!user ? (
              <>
                <Link href="/login" className="px-4 py-2 border rounded">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm font-medium">
                  Hi, {user.name}
                </span>

                <button
                  onClick={logout}
                  className="px-4 py-2 border rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* MOBILE */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setDark(!dark)}
              className="w-9 h-9 border rounded flex items-center justify-center"
            >
              {dark ? "🌙" : "☀️"}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 border rounded flex flex-col items-center justify-center gap-1"
            >
              <span className="w-4 h-[2px] bg-black" />
              <span className="w-4 h-[2px] bg-black" />
              <span className="w-4 h-[2px] bg-black" />
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE DRAWER */}
      <div
        ref={menuRef}
        className={`md:hidden fixed top-16 left-0 right-0 bg-white border transition-all ${
          menuOpen ? "max-h-[400px] p-4" : "max-h-0 overflow-hidden"
        }`}
      >
        <ul className="flex flex-col gap-2 mb-4">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>

        {!user ? (
          <div className="flex flex-col gap-2">
            <Link href="/login" className="border p-2 text-center">
              Log in
            </Link>
            <Link href="/register" className="bg-blue-600 text-white p-2 text-center">
              Get Started
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2 text-center">
            <span>Hi, {user.name}</span>
            <button onClick={logout} className="border p-2">
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}