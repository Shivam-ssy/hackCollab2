'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, StatusBadge } from '@/components/shared/badge';
import { Modal } from '@/components/shared/modal';
import { FormBuilder, FormField } from '@/components/shared/form-builder';
import { Plus, Users, Mail, Trash2 } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  members: Array<{ id: string; name: string; role: string }>;
  hackathons: number;
  projects: number;
  createdDate: string;
  status: string;
}

const mockTeams: Team[] = [
  {
    id: '1',
    name: 'TechVision',
    members: [
      { id: '1', name: 'Alice Johnson', role: 'Leader' },
      { id: '2', name: 'Bob Smith', role: 'Developer' },
      { id: '3', name: 'Carol White', role: 'Designer' },
    ],
    hackathons: 3,
    projects: 2,
    createdDate: '2024-01-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'EcoTech',
    members: [
      { id: '4', name: 'David Lee', role: 'Leader' },
      { id: '5', name: 'Emma Wilson', role: 'Developer' },
    ],
    hackathons: 2,
    projects: 1,
    createdDate: '2024-02-20',
    status: 'active',
  },
];

const teamFormFields: FormField[] = [
  {
    name: 'name',
    label: 'Team Name',
    type: 'text',
    placeholder: 'My Awesome Team',
    required: true,
  },
  {
    name: 'description',
    label: 'Team Description',
    type: 'textarea',
    placeholder: 'What is your team about?',
    rows: 3,
  },
  {
    name: 'maxMembers',
    label: 'Max Team Size',
    type: 'select',
    options: [
      { value: '2', label: '2 members' },
      { value: '4', label: '4 members' },
      { value: '6', label: '6 members' },
      { value: '8', label: '8 members' },
    ],
  },
];

export default function TeamsPage() {
  const [teams, setTeams] = useState(mockTeams);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleCreateTeam = async (data: Record<string, any>) => {
    const newTeam: Team = {
      id: String(teams.length + 1),
      name: data.name,
      members: [{ id: '0', name: 'You', role: 'Leader' }],
      hackathons: 0,
      projects: 0,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setTeams([...teams, newTeam]);
    setIsCreateOpen(false);
  };

  const handleDeleteTeam = (id: string) => {
    setTeams(teams.filter(t => t.id !== id));
    setIsDetailOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Teams</h1>
          <p className="text-muted-foreground">Manage your hackathon teams</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus size={20} />
          Create Team
        </Button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card
            key={team.id}
            className="p-6 cursor-pointer hover:border-primary/50 transition"
            onClick={() => {
              setSelectedTeam(team);
              setIsDetailOpen(true);
            }}
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">{team.name}</h2>
                <StatusBadge status={team.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                Created {new Date(team.createdDate).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-3 mb-4 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-muted-foreground" />
                <span className="text-sm">{team.members.length} members</span>
              </div>
              <div className="flex gap-2">
                <Badge size="sm">
                  {team.hackathons} hackathons
                </Badge>
                <Badge size="sm">
                  {team.projects} projects
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Members:</p>
              <div className="space-y-1">
                {team.members.slice(0, 3).map((member) => (
                  <div key={member.id} className="text-xs">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-muted-foreground"> • {member.role}</span>
                  </div>
                ))}
                {team.members.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{team.members.length - 3} more
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Team Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Team"
        description="Form a new team for upcoming hackathons"
      >
        <FormBuilder
          fields={teamFormFields}
          onSubmit={handleCreateTeam}
          submitLabel="Create Team"
        />
      </Modal>

      {/* Team Details Modal */}
      {selectedTeam && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={selectedTeam.name}
          description="Team details and management"
          size="lg"
        >
          <div className="space-y-6">
            {/* Members */}
            <div>
              <h3 className="font-semibold mb-3">Team Members</h3>
              <div className="space-y-2">
                {selectedTeam.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                    {member.role !== 'Leader' && (
                      <Button variant="ghost" size="sm">Remove</Button>
                    )}
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">Invite Members</Button>
            </div>

            {/* Team Stats */}
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-3">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold">{selectedTeam.hackathons}</p>
                  <p className="text-sm text-muted-foreground">Hackathons</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{selectedTeam.projects}</p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-border pt-6 flex gap-3">
              <Button className="flex-1">Edit Team</Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteTeam(selectedTeam.id)}
                className="gap-2"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
