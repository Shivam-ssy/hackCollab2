'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/shared/modal';
import { FormBuilder, FormField } from '@/components/shared/form-builder';
import { Badge } from '@/components/shared/badge';
import { Edit, Mail, MapPin, Link as LinkIcon, Award } from 'lucide-react';

const profileFields: FormField[] = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
  },
  {
    name: 'bio',
    label: 'Bio',
    type: 'textarea',
    placeholder: 'Tell us about yourself...',
    rows: 4,
  },
  {
    name: 'location',
    label: 'Location',
    type: 'text',
    placeholder: 'City, Country',
  },
  {
    name: 'website',
    label: 'Website/Portfolio',
    type: 'text',
    placeholder: 'https://yoursite.com',
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'text',
    placeholder: '+1234567890',
  },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!user) {
    return <div className="p-8 text-muted-foreground">Loading...</div>;
  }

  const handleSaveProfile = async (data: Record<string, any>) => {
    console.log('Profile saved:', data);
    setIsEditOpen(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Profile */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-4xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <Badge className="mt-2">{user.role.replace(/_/g, ' ')}</Badge>
                  </div>
                  <Button onClick={() => setIsEditOpen(true)} className="gap-2">
                    <Edit size={18} />
                    Edit Profile
                  </Button>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    {user.email}
                  </div>
                  {user.college && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {user.college}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-3">About</h3>
              <p className="text-muted-foreground">
                Passionate developer and hackathon enthusiast. Always looking to build innovative solutions and collaborate with talented teams.
              </p>
            </div>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Profile Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Hackathons</span>
                <Badge variant="outline">5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Projects</span>
                <Badge variant="outline">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Teams</span>
                <Badge variant="outline">2</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Wins</span>
                <Badge variant="success">1</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Award size={18} />
              Achievements
            </h3>
            <div className="space-y-2">
              <div className="text-2xl">🏆</div>
              <p className="text-sm">1st Place - TechCrunch 2024</p>
              <hr className="my-3 border-border" />
              <div className="text-2xl">⭐</div>
              <p className="text-sm">Top 10 Developer</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { date: '2024-03-15', action: 'Submitted project to TechCrunch' },
            { date: '2024-03-10', action: 'Joined team "TechVision"' },
            { date: '2024-03-05', action: 'Registered for DevFest Global' },
            { date: '2024-02-28', action: 'Profile updated' },
          ].map((activity, i) => (
            <div key={i} className="flex gap-4 pb-4 border-b border-border last:border-0">
              <div className="text-sm text-muted-foreground min-w-max">{activity.date}</div>
              <div className="text-sm">{activity.action}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Profile"
        description="Update your profile information"
      >
        <FormBuilder
          fields={profileFields.map(f => ({ ...f, value: f.name === 'name' ? user.name : f.name === 'email' ? user.email : '' }))}
          onSubmit={handleSaveProfile}
          submitLabel="Save Changes"
        />
      </Modal>
    </div>
  );
}
