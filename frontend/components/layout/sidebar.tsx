"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  LayoutDashboard,
  Users,
  Trophy,
  Zap,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const MAIN_MENU = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: Trophy, label: "Hackathons", to: "/hackathons" },
  { icon: Zap, label: "Projects", to: "/projects" },
  { icon: Users, label: "Teams", to: "/teams" },
];

const ACCOUNT_MENU = [
  { icon: Users, label: "Users", to: "/users" },
  { icon: MessageSquare, label: "Messages", to: "/messages" },
  { icon: Settings, label: "Settings", to: "/settings" },
  { icon: Users, label: "Profile", to: "/profile" },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getRoleText = () => {
    if (!user) return "";

    if (Array.isArray(user.roles)) {
      return user.roles
        .map((r) =>
          typeof r === "string" ? r : r?.name || null
        )
        .filter(Boolean)
        .map((r) => r.replace(/_/g, " "))
        .join(", ");
    }

    if (typeof user.role === "string") {
      return user.role.replace(/_/g, " ");
    }

    return "No Role";
  };

  const renderMenu = (items: any[]) =>
    items.map((item) => {
      const Icon = item.icon;
      const isActive = pathname === item.to;

      return (
        <Link key={item.to} href={item.to}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              "text-gray-700 dark:text-gray-300",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive &&
                "bg-blue-500 text-white shadow-lg hover:bg-blue-600"
            )}
          >
            <Icon size={18} />
            {item.label}
          </Button>
        </Link>
      );
    });

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-800"
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transition-all duration-300 md:relative md:translate-x-0",
          "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl",
          "border-r border-gray-200 dark:border-gray-700",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">

          {/* Logo */}
          <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              HackCollab
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Management Platform
            </p>
          </div>

          {/* User Info */}
          {user && (
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {getRoleText()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6">

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase px-2 mb-2">
                Main
              </p>
              <div className="space-y-1">{renderMenu(MAIN_MENU)}</div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase px-2 mb-2">
                Account
              </p>
              <div className="space-y-1">{renderMenu(ACCOUNT_MENU)}</div>
            </div>

          </nav>

          {/* Logout */}
          <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}