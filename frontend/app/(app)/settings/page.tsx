'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Lock, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveProfile = async () => {
    // TODO: Implement API call
    console.log('Saving profile:', formData);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-6 max-w-2xl">
        {/* Profile Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Notification Settings</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Email notifications', value: true },
              { label: 'Hackathon updates', value: true },
              { label: 'Team invitations', value: true },
              { label: 'Scoring updates', value: false },
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked={item.value} className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>
          <Button className="mt-6">Save Preferences</Button>
        </Card>

        {/* Password Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>
          <p className="text-muted-foreground mb-4">Change your password</p>
          <Button variant="outline">Change Password</Button>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-destructive/20">
          <h2 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive">Delete Account</Button>
        </Card>
      </div>
    </div>
  );
}
