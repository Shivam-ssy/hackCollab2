'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/shared/modal';
import { FormBuilder, FormField } from '@/components/shared/form-builder';
import { Badge } from '@/components/shared/badge';
import {
  Edit, Mail, Award, GraduationCap, Building2,
  Briefcase, Users, Star, Scale, Loader2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole =
  | 'student' | 'college' | 'company' | 'sponsor'
  | 'volunteer' | 'mentor' | 'judge' | 'alumni';

interface CollegeOption {
  _id: string;
  name: string;       // collegeProfile.name from backend
  location?: string;
}

// ─── Role Helper ──────────────────────────────────────────────────────────────

function hasRole(user: any, role: UserRole): boolean {
  if (!user?.roles) return false;
  return user.roles.some((r: any) =>
    (typeof r === 'string' ? r : r?.name)?.toLowerCase() === role
  );
}

// ─── CollegePicker ────────────────────────────────────────────────────────────
// Fetches registered colleges from GET /api/colleges.
// Shows a <select> with all colleges + "Other (not listed)".
// When "Other" is chosen, reveals a free-text college name input.
// Handles pre-selection when the user already has a collegeId saved.

interface CollegePickerProps {
  initialCollegeId?: string | null;
  initialCollegeName?: string;
  onChange: (value: { collegeId: string | null; collegeName: string }) => void;
}

function CollegePicker({ initialCollegeId, initialCollegeName, onChange }: CollegePickerProps) {
  const [colleges, setColleges]     = useState<CollegeOption[]>([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState<string>('');
  const [customName, setCustomName] = useState(initialCollegeName ?? '');

  useEffect(() => {
    // Replace with your real colleges endpoint.
    // Expected shape: [{ _id, name, location? }]
    fetch('/api/colleges')
      .then(r => r.json())
      .then((data: CollegeOption[]) => {
        setColleges(data);
        if (initialCollegeId) {
          const found = data.find(c => c._id === initialCollegeId);
          setSelected(found ? initialCollegeId : '__other__');
        } else if (initialCollegeName) {
          setSelected('__other__');
        } else {
          setSelected('');
        }
      })
      .catch(() => {
        setColleges([]);
        if (initialCollegeName) setSelected('__other__');
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOther = selected === '__other__';

  const handleSelect = (value: string) => {
    setSelected(value);
    if (value !== '__other__') {
      const college = colleges.find(c => c._id === value);
      onChange({ collegeId: value || null, collegeName: college?.name ?? '' });
    } else {
      onChange({ collegeId: null, collegeName: customName });
    }
  };

  const handleCustomName = (name: string) => {
    setCustomName(name);
    onChange({ collegeId: null, collegeName: name });
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">College</label>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
          <Loader2 size={14} className="animate-spin" /> Loading colleges…
        </div>
      ) : (
        <select
          value={selected}
          onChange={e => handleSelect(e.target.value)}
          className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background
                     focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="" disabled>Select your college…</option>
          {colleges.map(c => (
            <option key={c._id} value={c._id}>
              {c.name}{c.location ? ` — ${c.location}` : ''}
            </option>
          ))}
          <option value="__other__">Other (not listed)</option>
        </select>
      )}

      {/* Free-text fallback — only shown when "Other" is selected */}
      {isOther && (
        <div>
          <label className="block text-sm font-medium mb-1">College Name</label>
          <Input
            value={customName}
            onChange={e => handleCustomName(e.target.value)}
            placeholder="Enter your college name…"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Your college isn't registered on the platform yet — just type the name.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── StudentProfileForm ───────────────────────────────────────────────────────

const TECH_SUGGESTIONS = [
  'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Django',
  'FastAPI', 'Go', 'Rust', 'Java', 'Spring Boot', 'Flutter',
  'Swift', 'Kotlin', 'PostgreSQL', 'MongoDB',
];

function StudentProfileForm({
  profile,
  onSubmit,
}: {
  profile: any;
  onSubmit: (data: any) => Promise<void>;
}) {
  const [college, setCollege]        = useState<{ collegeId: string | null; collegeName: string }>({
    collegeId: profile?.collegeId ?? null,
    collegeName: profile?.collegeName ?? '',
  });
  const [course, setCourse]          = useState(profile?.course ?? '');
  const [techStack, setTechStack]    = useState<string[]>(profile?.techStack ?? []);
  const [techInput, setTechInput]    = useState('');
  const [lookingForTeam, setLooking] = useState<boolean>(profile?.lookingForTeam ?? false);
  const [saving, setSaving]          = useState(false);

  const addTech = (tech: string) => {
    const t = tech.trim();
    if (t && !techStack.includes(t)) setTechStack(prev => [...prev, t]);
    setTechInput('');
  };
  const removeTech = (tech: string) =>
    setTechStack(prev => prev.filter(t => t !== tech));

  const handleSubmit = async () => {
    setSaving(true);
    await onSubmit({
      collegeId:   college.collegeId,
      collegeName: college.collegeName,
      // set collegeType automatically from selection
      collegeType: college.collegeId ? 'registered' : 'external',
      course,
      techStack,
      lookingForTeam,
    });
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      {/* College dropdown */}
      <CollegePicker
        initialCollegeId={profile?.collegeId}
        initialCollegeName={profile?.collegeName}
        onChange={setCollege}
      />

      {/* Course */}
      <div>
        <label className="block text-sm font-medium mb-1">Course / Major</label>
        <Input
          value={course}
          onChange={e => setCourse(e.target.value)}
          placeholder="B.Tech Computer Science…"
        />
      </div>

      {/* Tech Stack tag input */}
      <div>
        <label className="block text-sm font-medium mb-2">Tech Stack</label>

        {/* Current tags */}
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {techStack.map(t => (
              <span key={t}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full
                           bg-primary/10 text-primary font-medium">
                {t}
                <button type="button" onClick={() => removeTech(t)}
                  className="ml-0.5 hover:text-destructive leading-none">&times;</button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={techInput}
            onChange={e => setTechInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); addTech(techInput); }
            }}
            placeholder="Type a tech and press Enter…"
            className="flex-1"
          />
          <Button type="button" size="sm" variant="outline"
            onClick={() => addTech(techInput)}>
            Add
          </Button>
        </div>

        {/* Quick-add suggestions */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {TECH_SUGGESTIONS.filter(s => !techStack.includes(s)).slice(0, 10).map(s => (
            <button key={s} type="button" onClick={() => addTech(s)}
              className="text-xs px-2 py-0.5 rounded-full border border-border
                         hover:bg-muted transition-colors">
              + {s}
            </button>
          ))}
        </div>
      </div>

      {/* Looking for team toggle */}
      <div className="flex items-center justify-between rounded-md border border-border p-3">
        <div>
          <p className="text-sm font-medium">Looking for a team?</p>
          <p className="text-xs text-muted-foreground">Let others discover and invite you</p>
        </div>
        <button
          type="button"
          onClick={() => setLooking(v => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors
                      ${lookingForTeam ? 'bg-primary' : 'bg-muted'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow
                            transition-transform ${lookingForTeam ? 'translate-x-5' : ''}`} />
        </button>
      </div>

      <Button onClick={handleSubmit} disabled={saving} className="w-full">
        {saving
          ? <><Loader2 size={16} className="animate-spin mr-2" />Saving…</>
          : 'Save Student Profile'}
      </Button>
    </div>
  );
}

// ─── AlumniProfileForm ────────────────────────────────────────────────────────

function AlumniProfileForm({
  profile,
  onSubmit,
}: {
  profile: any;
  onSubmit: (data: any) => Promise<void>;
}) {
  const [college, setCollege]         = useState<{ collegeId: string | null; collegeName: string }>({
    collegeId: profile?.collegeId ?? null,
    collegeName: '',
  });
  const [graduationYear, setGradYear] = useState(String(profile?.graduationYear ?? ''));
  const [currentCompany, setCompany]  = useState(profile?.currentCompany ?? '');
  const [willingToMentor, setMentor]  = useState<boolean>(profile?.willingToMentor ?? false);
  const [saving, setSaving]           = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    await onSubmit({
      collegeId:      college.collegeId,
      graduationYear: Number(graduationYear) || undefined,
      currentCompany,
      willingToMentor,
    });
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      <CollegePicker
        initialCollegeId={profile?.collegeId}
        onChange={setCollege}
      />

      <div>
        <label className="block text-sm font-medium mb-1">Graduation Year</label>
        <Input
          type="number"
          value={graduationYear}
          onChange={e => setGradYear(e.target.value)}
          placeholder="2022"
          min={1960}
          max={new Date().getFullYear()}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Current Company</label>
        <Input
          value={currentCompany}
          onChange={e => setCompany(e.target.value)}
          placeholder="Google, self-employed, startup…"
        />
      </div>

      <div className="flex items-center justify-between rounded-md border border-border p-3">
        <div>
          <p className="text-sm font-medium">Willing to mentor?</p>
          <p className="text-xs text-muted-foreground">Students will be able to reach out</p>
        </div>
        <button
          type="button"
          onClick={() => setMentor(v => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors
                      ${willingToMentor ? 'bg-primary' : 'bg-muted'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow
                            transition-transform ${willingToMentor ? 'translate-x-5' : ''}`} />
        </button>
      </div>

      <Button onClick={handleSubmit} disabled={saving} className="w-full">
        {saving
          ? <><Loader2 size={16} className="animate-spin mr-2" />Saving…</>
          : 'Save Alumni Profile'}
      </Button>
    </div>
  );
}

// ─── Shared UI Helpers ────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value?: string | boolean | string[] }) {
  if (value === undefined || value === null || value === '') return null;
  const display = Array.isArray(value) ? value.join(', ') : String(value);
  return (
    <div className="flex gap-3 py-2 border-b border-border last:border-0">
      <span className="text-muted-foreground text-sm min-w-[140px]">{label}</span>
      <span className="text-sm font-medium">{display}</span>
    </div>
  );
}

function SectionCard({ icon, title, onEdit, children }: {
  icon: React.ReactNode; title: string;
  onEdit: () => void; children: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">{icon}{title}</h3>
        <Button size="sm" variant="ghost" onClick={onEdit} className="gap-1 text-xs">
          <Edit size={14} /> Edit
        </Button>
      </div>
      {children}
    </Card>
  );
}

// ─── Static FormField sets (for roles without college picker) ─────────────────

const commonFields: FormField[] = [
  { name: 'name',  label: 'Full Name', type: 'text',  required: true },
  { name: 'email', label: 'Email',     type: 'email', required: true },
];
const collegeFields: FormField[] = [
  { name: 'collegeProfile.name',        label: 'College Name', type: 'text' },
  { name: 'collegeProfile.location',    label: 'Location',     type: 'text' },
  { name: 'collegeProfile.website',     label: 'Website',      type: 'text', placeholder: 'https://' },
  { name: 'collegeProfile.description', label: 'Description',  type: 'textarea', rows: 3 },
];
const companyFields: FormField[] = [
  { name: 'companyProfile.companyName', label: 'Company Name', type: 'text' },
  { name: 'companyProfile.website',     label: 'Website',      type: 'text', placeholder: 'https://' },
  { name: 'companyProfile.overview',    label: 'Overview',     type: 'textarea', rows: 3 },
];
const sponsorFields: FormField[] = [
  { name: 'sponsorProfile.organizationName', label: 'Organisation Name', type: 'text' },
];
const volunteerFields: FormField[] = [
  { name: 'volunteerProfile.expertise', label: 'Expertise (comma-separated)', type: 'text' },
  { name: 'volunteerProfile.available', label: 'Available?', type: 'select',
    options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
];
const mentorFields: FormField[] = [
  { name: 'mentorProfile.expertise',    label: 'Expertise (comma-separated)', type: 'text' },
  { name: 'mentorProfile.availability', label: 'Available for mentoring?', type: 'select',
    options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
];
const judgeFields: FormField[] = [
  { name: 'judgeProfile.expertise', label: 'Expertise (comma-separated)', type: 'text' },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  if (!user) return <div className="p-8 text-muted-foreground">Loading…</div>;

  const handleSave = async (section: string, data: Record<string, any>) => {
    console.log(`[ProfilePage] save section="${section}"`, data);
    // TODO: await api.patch('/users/me', { [`${section}Profile`]: data })
    setActiveModal(null);
  };

  const prefill = (fields: FormField[], source: Record<string, any> = {}) =>
    fields.map(f => {
      const key = f.name.includes('.') ? f.name.split('.').pop()! : f.name;
      return { ...f, value: source[key] ?? '' };
    });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Identity card */}
          <Card className="p-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground
                              flex items-center justify-center text-4xl font-bold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(user.roles ?? []).map((r: any, i: number) => (
                        <Badge key={i}>
                          {(typeof r === 'string' ? r : r?.name ?? '').replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button onClick={() => setActiveModal('common')} className="gap-2 shrink-0">
                    <Edit size={16} /> Edit
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={14} />{user.email}
                </div>
              </div>
            </div>
          </Card>

          {/* Student */}
          {hasRole(user, 'student') && (
            <SectionCard icon={<GraduationCap size={18} />} title="Student Profile"
              onEdit={() => setActiveModal('student')}>
              <InfoRow label="College"
                value={
                  user.studentProfile?.collegeName ||
                  (user.studentProfile?.collegeId
                    ? `ID: ${user.studentProfile.collegeId}` : undefined)
                }
              />
              <InfoRow label="College type"     value={user.studentProfile?.collegeType} />
              <InfoRow label="Course"           value={user.studentProfile?.course} />
              <InfoRow label="Tech stack"       value={user.studentProfile?.techStack} />
              <InfoRow label="Looking for team" value={user.studentProfile?.lookingForTeam ? 'Yes' : 'No'} />
              {!user.studentProfile?.course && !user.studentProfile?.collegeName && (
                <p className="text-sm text-muted-foreground italic">
                  No student info yet — click Edit to get started.
                </p>
              )}
            </SectionCard>
          )}

          {/* College */}
          {hasRole(user, 'college') && (
            <SectionCard icon={<Building2 size={18} />} title="College Profile"
              onEdit={() => setActiveModal('college')}>
              <InfoRow label="Name"        value={user.collegeProfile?.name} />
              <InfoRow label="Location"    value={user.collegeProfile?.location} />
              <InfoRow label="Website"     value={user.collegeProfile?.website} />
              <InfoRow label="Description" value={user.collegeProfile?.description} />
              <InfoRow label="Verified"    value={user.collegeProfile?.isVerified ? 'Yes ✓' : 'Pending'} />
            </SectionCard>
          )}

          {/* Company */}
          {hasRole(user, 'company') && (
            <SectionCard icon={<Briefcase size={18} />} title="Company Profile"
              onEdit={() => setActiveModal('company')}>
              <InfoRow label="Company"  value={user.companyProfile?.companyName} />
              <InfoRow label="Website"  value={user.companyProfile?.website} />
              <InfoRow label="Overview" value={user.companyProfile?.overview} />
              <InfoRow label="Verified" value={user.companyProfile?.isVerified ? 'Yes ✓' : 'Pending'} />
            </SectionCard>
          )}

          {/* Sponsor */}
          {hasRole(user, 'sponsor') && (
            <SectionCard icon={<Award size={18} />} title="Sponsor Profile"
              onEdit={() => setActiveModal('sponsor')}>
              <InfoRow label="Organisation" value={user.sponsorProfile?.organizationName} />
              {(user.sponsorProfile?.sponsorshipHistory ?? []).length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">Sponsorship history</p>
                  {user.sponsorProfile.sponsorshipHistory.map((s: any, i: number) => (
                    <div key={i}
                      className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                      <span className="text-muted-foreground">Hackathon #{String(s.hackathonId)}</span>
                      <span className="font-medium">${s.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          )}

          {/* Volunteer */}
          {hasRole(user, 'volunteer') && (
            <SectionCard icon={<Users size={18} />} title="Volunteer Profile"
              onEdit={() => setActiveModal('volunteer')}>
              <InfoRow label="Expertise" value={user.volunteerProfile?.expertise} />
              <InfoRow label="Available" value={user.volunteerProfile?.available ? 'Yes' : 'No'} />
            </SectionCard>
          )}

          {/* Mentor */}
          {hasRole(user, 'mentor') && (
            <SectionCard icon={<Star size={18} />} title="Mentor Profile"
              onEdit={() => setActiveModal('mentor')}>
              <InfoRow label="Expertise"    value={user.mentorProfile?.expertise} />
              <InfoRow label="Availability" value={user.mentorProfile?.availability ? 'Yes' : 'No'} />
            </SectionCard>
          )}

          {/* Judge */}
          {hasRole(user, 'judge') && (
            <SectionCard icon={<Scale size={18} />} title="Judge Profile"
              onEdit={() => setActiveModal('judge')}>
              <InfoRow label="Expertise" value={user.judgeProfile?.expertise} />
              {(user.judgeProfile?.judgingHackathons ?? []).length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Judging {user.judgeProfile.judgingHackathons.length} hackathon(s)
                </p>
              )}
            </SectionCard>
          )}

          {/* Alumni */}
          {hasRole(user, 'alumni') && (
            <SectionCard icon={<GraduationCap size={18} />} title="Alumni Profile"
              onEdit={() => setActiveModal('alumni')}>
              {/* Show college name if populated, otherwise fall back to ID */}
              <InfoRow label="College"
                value={
                  user.alumniProfile?.collegeId
                    ? `ID: ${user.alumniProfile.collegeId}` : undefined
                }
              />
              <InfoRow label="Graduation year"   value={String(user.alumniProfile?.graduationYear ?? '')} />
              <InfoRow label="Current company"   value={user.alumniProfile?.currentCompany} />
              <InfoRow label="Willing to mentor" value={user.alumniProfile?.willingToMentor ? 'Yes' : 'No'} />
            </SectionCard>
          )}
        </div>

        {/* ── Right column ── */}
        {/* <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Profile Stats</h3>
            <div className="space-y-3">
              {[
                { label: 'Hackathons', value: '5' },
                { label: 'Projects',   value: '3' },
                { label: 'Teams',      value: '2' },
                { label: 'Wins',       value: '1', success: true },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">{s.label}</span>
                  <Badge variant={s.success ? 'success' : 'outline'}>{s.value}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Award size={16} /> Recent Activity
            </h3>
            <div className="space-y-3">
              {[
                { date: '2024-03-15', action: 'Submitted project to TechCrunch' },
                { date: '2024-03-10', action: 'Joined team "TechVision"' },
                { date: '2024-03-05', action: 'Registered for DevFest Global' },
              ].map((a, i) => (
                <div key={i} className="pb-3 border-b border-border last:border-0">
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                  <p className="text-sm mt-0.5">{a.action}</p>
                </div>
              ))}
            </div>
          </Card>
        </div> */}
      </div>

      {/* ══ Modals ══ */}

      {/* Common */}
      <Modal isOpen={activeModal === 'common'} onClose={() => setActiveModal(null)}
        title="Edit Basic Info" description="Update your name and email">
        <FormBuilder
          fields={prefill(commonFields, user)}
          onSubmit={data => handleSave('common', data)}
          submitLabel="Save Changes"
        />
      </Modal>

      {/* Student — uses custom form with CollegePicker */}
      <Modal isOpen={activeModal === 'student'} onClose={() => setActiveModal(null)}
        title="Edit Student Profile" description="Update your student information">
        <StudentProfileForm
          profile={user.studentProfile}
          onSubmit={data => handleSave('student', data)}
        />
      </Modal>

      {/* College */}
      <Modal isOpen={activeModal === 'college'} onClose={() => setActiveModal(null)}
        title="Edit College Profile" description="Update your college information">
        <FormBuilder
          fields={prefill(collegeFields, user.collegeProfile ?? {})}
          onSubmit={data => handleSave('college', data)}
          submitLabel="Save Changes"
        />
      </Modal>

      {/* Company */}
      <Modal isOpen={activeModal === 'company'} onClose={() => setActiveModal(null)}
        title="Edit Company Profile" description="Update your company information">
        <FormBuilder
          fields={prefill(companyFields, user.companyProfile ?? {})}
          onSubmit={data => handleSave('company', data)}
          submitLabel="Save Changes"
        />
      </Modal>

      {/* Sponsor */}
      <Modal isOpen={activeModal === 'sponsor'} onClose={() => setActiveModal(null)}
        title="Edit Sponsor Profile" description="Update your sponsor information">
        <FormBuilder
          fields={prefill(sponsorFields, user.sponsorProfile ?? {})}
          onSubmit={data => handleSave('sponsor', data)}
          submitLabel="Save Changes"
        />
      </Modal>

      {/* Volunteer */}
      <Modal isOpen={activeModal === 'volunteer'} onClose={() => setActiveModal(null)}
        title="Edit Volunteer Profile" description="Update your volunteer information">
        <FormBuilder
          fields={prefill(volunteerFields, user.volunteerProfile ?? {})}
          onSubmit={data => handleSave('volunteer', data)}
          submitLabel="Save Changes"
        />
      </Modal>

      {/* Mentor */}
      <Modal isOpen={activeModal === 'mentor'} onClose={() => setActiveModal(null)}
        title="Edit Mentor Profile" description="Update your mentor information">
        <FormBuilder
          fields={prefill(mentorFields, user.mentorProfile ?? {})}
          onSubmit={data => handleSave('mentor', data)}
          submitLabel="Save Changes"
        />
      </Modal>

      {/* Judge */}
      <Modal isOpen={activeModal === 'judge'} onClose={() => setActiveModal(null)}
        title="Edit Judge Profile" description="Update your judge information">
        <FormBuilder
          fields={prefill(judgeFields, user.judgeProfile ?? {})}
          onSubmit={data => handleSave('judge', data)}
          submitLabel="Save Changes"
        />
      </Modal>

      {/* Alumni — uses custom form with CollegePicker */}
      <Modal isOpen={activeModal === 'alumni'} onClose={() => setActiveModal(null)}
        title="Edit Alumni Profile" description="Update your alumni information">
        <AlumniProfileForm
          profile={user.alumniProfile}
          onSubmit={data => handleSave('alumni', data)}
        />
      </Modal>
    </div>
  );
}