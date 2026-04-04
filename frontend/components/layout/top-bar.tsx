import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Moon, Sun, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

export function TopBar() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const notificationCount = 0;

  // ✅ Apply dark mode globally
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // ✅ Safe role text handler
  const getRoleText = () => {
    if (!user) return "";

    if (Array.isArray(user.roles)) {
      return user.roles
        .map((r) => (typeof r === "string" ? r : r?.name))
        .filter(Boolean)
        .map((r) => r.replace(/_/g, " "))
        .join(", ");
    }

    if (user.role) {
      return user.role.replace(/_/g, " ");
    }

    return "No Role";
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-muted border-muted-foreground/20"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 ml-6">

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-semibold">
                {notificationCount}
              </span>
            )}
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          {/* User Avatar */}
          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getRoleText()}
                </p>
              </div>

              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}