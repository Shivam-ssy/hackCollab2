'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Search, Filter, Calendar, Users, Clock,
  Trophy, Globe, Lock, Edit3, Gavel, Zap,
  ArrowUpRight, BookOpen, Loader2, CheckCircle2,
  Star, X,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import apis from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

type RoleName = 'student' | 'college' | 'judge' | 'admin';
type Tab = 'all' | 'participated' | 'mine' | 'judging';

interface Track { name: string; description: string }
interface Prize { position: string; reward: string }

interface Hackathon {
  _id: string;
  title: string;
  description: string;
  slug: string;
  hackathonStart: string;
  hackathonEnd: string;
  registrationEnd: string;
  minTeamSize: number;
  maxTeamSize: number;
  tracks: Track[];
  prizes: Prize[];
  status: 'draft' | 'upcoming' | 'active' | 'completed';
  isPublic: boolean;
  totalTeams: number;
  totalParticipants: number;
  college: { _id: string; collegeProfile: { name: string } };
}

interface JudgeSubmission {
  _id: string;
  projectTitle: string;
  team: { name: string };
  myScore: number | null;
  myFeedback: string | null;
  scoredByMe: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveRole(user: any): RoleName {
  const names: string[] = (user?.roles ?? []).map((r: any) =>
    typeof r === 'string' ? r : r.name
  );
  if (names.includes('admin'))   return 'admin';
  if (names.includes('college')) return 'college';
  if (names.includes('judge'))   return 'judge';
  return 'student';
}

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const daysLeft = (end: string) => {
  const d = Math.ceil((new Date(end).getTime() - Date.now()) / 86400000);
  return d > 0 ? `${d}d left` : 'Ended';
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'Draft',    cls: 'bg-muted text-muted-foreground' },
  upcoming:  { label: 'Upcoming', cls: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  active:    { label: 'Live',     cls: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  completed: { label: 'Ended',    cls: 'bg-secondary text-secondary-foreground' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.draft;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
      {status === 'active' && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      )}
      {cfg.label}
    </span>
  );
}

// ─── Hackathon Card ───────────────────────────────────────────────────────────

function HackathonCard({ h, role, onEdit, onOpen, onJudge }: {
  h: Hackathon; role: RoleName;
  onEdit?: () => void; onOpen?: () => void; onJudge?: () => void;
}) {
  return (
    <div className="border border-border rounded-lg bg-card text-card-foreground hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
      {/* status accent stripe */}
      <div className={`h-1 w-full shrink-0 ${
        h.status === 'active'    ? 'bg-green-500'  :
        h.status === 'upcoming'  ? 'bg-yellow-500' :
        h.status === 'completed' ? 'bg-primary'    : 'bg-border'
      }`} />

      <div className="p-5 flex flex-col flex-1 gap-3">

        {/* title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <StatusBadge status={h.status} />
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {h.isPublic
                  ? <><Globe size={10} />Public</>
                  : <><Lock  size={10} />Private</>}
              </span>
            </div>
            <h3 className="font-semibold text-foreground leading-snug">{h.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {h.college?.collegeProfile?.name}
            </p>
          </div>

          {(role === 'college' || role === 'admin') && (
            <button
              onClick={e => { e.stopPropagation(); onEdit?.(); }}
              className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground border border-border rounded-md px-2.5 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Edit3 size={11} />Edit
            </button>
          )}
        </div>

        {/* description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {h.description}
        </p>

        {/* tracks */}
        {h.tracks.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {h.tracks.slice(0, 3).map(t => (
              <span key={t.name} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md">
                {t.name}
              </span>
            ))}
            {h.tracks.length > 3 && (
              <span className="text-xs text-muted-foreground py-0.5">+{h.tracks.length - 3}</span>
            )}
          </div>
        )}

        {/* meta */}
        <div className="grid grid-cols-3 gap-1 pt-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-1"><Calendar size={11} /><span className="truncate">{fmtDate(h.hackathonStart)}</span></div>
          <div className="flex items-center gap-1"><Users    size={11} /><span>{h.totalParticipants} joined</span></div>
          <div className="flex items-center gap-1"><Clock    size={11} /><span>{daysLeft(h.hackathonEnd)}</span></div>
        </div>

        {/* prizes */}
        {h.prizes.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Trophy size={11} className="text-yellow-500 shrink-0" />
            <span className="truncate">{h.prizes.map(p => `${p.position}: ${p.reward}`).join(' · ')}</span>
          </div>
        )}

        {/* CTA — pushed to bottom */}
        <div className="mt-auto pt-1">
          {role === 'student' && (
            <button
              onClick={onOpen}
              className={`w-full flex items-center justify-center gap-2 h-9 rounded-md text-sm font-medium transition-colors ${
                h.status === 'active'
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {h.status === 'active'
                ? <><Zap size={13} />Register Now</>
                : <><ArrowUpRight size={13} />View Details</>}
            </button>
          )}
          {role === 'judge' && (
            <button
              onClick={onJudge}
              className="w-full flex items-center justify-center gap-2 h-9 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              <Gavel size={13} />Review Submissions
            </button>
          )}
          {(role === 'college' || role === 'admin') && (
            <button
              onClick={onOpen}
              className="w-full flex items-center justify-center gap-2 h-9 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              <BookOpen size={13} />View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Shared modal wrapper ─────────────────────────────────────────────────────

function Modal({ title, subtitle, onClose, children }: {
  title: string; subtitle?: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-card border border-border rounded-xl shadow-xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            {subtitle && <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">{subtitle}</p>}
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground">
            <X size={15} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

// ─── Hackathon Form Modal ─────────────────────────────────────────────────────

function HackathonFormModal({ hackathon, onClose, onSave }: {
  hackathon?: Hackathon; onClose: () => void; onSave: (d: any) => Promise<void>;
}) {
  const [form, setForm] = useState({
    title:           hackathon?.title ?? '',
    description:     hackathon?.description ?? '',
    hackathonStart:  hackathon?.hackathonStart?.slice(0, 10) ?? '',
    hackathonEnd:    hackathon?.hackathonEnd?.slice(0, 10)   ?? '',
    registrationEnd: hackathon?.registrationEnd?.slice(0, 10) ?? '',
    minTeamSize:     hackathon?.minTeamSize ?? 2,
    maxTeamSize:     hackathon?.maxTeamSize ?? 4,
    isPublic:        hackathon?.isPublic ?? true,
    status:          hackathon?.status   ?? 'draft',
    tracks:          hackathon?.tracks.map(t => t.name).join(', ') ?? '',
    prize1:          hackathon?.prizes[0]?.reward ?? '',
    prize2:          hackathon?.prizes[1]?.reward ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [key]: e.target.type === 'number' ? +e.target.value : e.target.value }));

  async function handleSave() {
    if (!form.title.trim()) return setError('Title is required');
    setSaving(true); setError('');
    try {
      await onSave({
        ...form,
        tracks: form.tracks.split(',').map(s => ({ name: s.trim(), description: '' })).filter(t => t.name),
        prizes: [
          form.prize1 && { position: '1st', reward: form.prize1 },
          form.prize2 && { position: '2nd', reward: form.prize2 },
        ].filter(Boolean),
      });
      onClose();
    } catch (e: any) { setError(e.response?.data?.message ?? e.message ?? 'Failed to save'); }
    finally { setSaving(false); }
  }

  const inputCls = "h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full";
  const labelCls = "text-sm font-medium text-foreground";

  return (
    <Modal
      title={hackathon ? hackathon.title : 'Create Hackathon'}
      subtitle={hackathon ? 'Edit Hackathon' : 'New Event'}
      onClose={onClose}
    >
      <div className="p-6 flex flex-col gap-4">
        {/* title */}
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Title</label>
          <input className={inputCls} value={form.title} onChange={set('title')} placeholder="Hackathon name" />
        </div>

        {/* description */}
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Description</label>
          <textarea
            rows={3} value={form.description} onChange={set('description')}
            className="px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* dates + status */}
        <div className="grid grid-cols-2 gap-3">
          {([
            ['Start Date',            'hackathonStart',  'date'],
            ['End Date',              'hackathonEnd',    'date'],
            ['Registration Closes',   'registrationEnd', 'date'],
          ] as const).map(([lbl, key, type]) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className={labelCls}>{lbl}</label>
              <input type={type} className={inputCls} value={form[key] as string} onChange={set(key)} />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Status</label>
            <select value={form.status} onChange={set('status')} className={inputCls}>
              {['draft','upcoming','active','completed'].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* team size */}
        <div className="grid grid-cols-2 gap-3">
          {(['minTeamSize','maxTeamSize'] as const).map(key => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className={labelCls}>{key === 'minTeamSize' ? 'Min Team Size' : 'Max Team Size'}</label>
              <input type="number" className={inputCls} value={form[key]} onChange={set(key)} min={1} />
            </div>
          ))}
        </div>

        {/* tracks */}
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Tracks <span className="text-muted-foreground font-normal">(comma-separated)</span></label>
          <input className={inputCls} value={form.tracks} onChange={set('tracks')} placeholder="AI/ML, Web3, HealthTech" />
        </div>

        {/* prizes */}
        <div className="grid grid-cols-2 gap-3">
          {(['prize1','prize2'] as const).map((key, i) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className={labelCls}>{i === 0 ? '1st Prize' : '2nd Prize'}</label>
              <input className={inputCls} value={form[key]} onChange={set(key)} placeholder="₹50,000" />
            </div>
          ))}
        </div>

        {/* public toggle */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox" checked={form.isPublic}
            onChange={e => setForm(p => ({ ...p, isPublic: e.target.checked }))}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-sm text-foreground">Make this hackathon public</span>
        </label>

        {error && (
          <p className="text-sm px-3 py-2 rounded-md bg-destructive/10 text-destructive-foreground">{error}</p>
        )}
      </div>

      {/* footer */}
      <div className="flex gap-3 px-6 pb-6 shrink-0">
        <button
          onClick={onClose}
          className="flex-1 h-9 rounded-md border border-border text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave} disabled={saving}
          className="flex-[2] h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
        >
          {saving
            ? <><Loader2 size={13} className="animate-spin" />Saving…</>
            : hackathon ? 'Save Changes' : 'Create Hackathon'}
        </button>
      </div>
    </Modal>
  );
}

// ─── Judge Scoring Modal ──────────────────────────────────────────────────────

function JudgeScoringModal({ hackathon, onClose }: { hackathon: Hackathon; onClose: () => void }) {
  const [submissions, setSubmissions] = useState<JudgeSubmission[]>([]);
  const [loading, setLoading]         = useState(true);
  const [scores,  setScores]          = useState<Record<string, { score: number; feedback: string }>>({});
  const [saving,  setSaving]          = useState<string | null>(null);
  const [saved,   setSaved]           = useState<string[]>([]);
  const [error,   setError]           = useState('');

  useEffect(() => {
    apis.get(`/hackathons/${hackathon._id}/submissions`)
      .then(res => {
        const data: JudgeSubmission[] = res.data.data;
        setSubmissions(data);
        setScores(Object.fromEntries(
          data.map(s => [s._id, { score: s.myScore ?? 0, feedback: s.myFeedback ?? '' }])
        ));
      })
      .catch(e => setError(e.response?.data?.message ?? e.message))
      .finally(() => setLoading(false));
  }, [hackathon._id]);

  async function submitScore(subId: string) {
    setSaving(subId);
    try {
      await apis.post(`/hackathons/submissions/${subId}/score`, scores[subId]);
      setSaved(p => [...p, subId]);
    } catch (e: any) { setError(e.response?.data?.message ?? e.message); }
    finally { setSaving(null); }
  }

  return (
    <Modal title={hackathon.title} subtitle="Scoring Panel" onClose={onClose}>
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-center text-sm text-destructive-foreground py-8">{error}</p>
        ) : submissions.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">No submissions assigned to you yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {submissions.map(sub => {
              const isSaved  = saved.includes(sub._id) || sub.scoredByMe;
              const isSaving = saving === sub._id;
              return (
                <div
                  key={sub._id}
                  className={`border rounded-lg p-4 ${
                    isSaved
                      ? 'border-green-200 dark:border-green-800 bg-green-50/40 dark:bg-green-900/10'
                      : 'border-border bg-background'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{sub.projectTitle}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{sub.team?.name}</p>
                    </div>
                    {isSaved && (
                      <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                        <CheckCircle2 size={12} />Scored
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-muted-foreground w-9 shrink-0">Score</span>
                    <input
                      type="range" min={0} max={100}
                      value={scores[sub._id]?.score ?? 0}
                      onChange={e => setScores(p => ({ ...p, [sub._id]: { ...p[sub._id], score: +e.target.value } }))}
                      className="flex-1 accent-primary h-1.5"
                    />
                    <span className="text-lg font-bold text-foreground w-9 text-right tabular-nums">
                      {scores[sub._id]?.score ?? 0}
                    </span>
                  </div>

                  <textarea
                    placeholder="Feedback for the team (optional)"
                    rows={2}
                    value={scores[sub._id]?.feedback ?? ''}
                    onChange={e => setScores(p => ({ ...p, [sub._id]: { ...p[sub._id], feedback: e.target.value } }))}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />

                  <button
                    onClick={() => submitScore(sub._id)}
                    disabled={isSaving || isSaved}
                    className={`mt-3 w-full h-9 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      isSaved
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 cursor-default'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 cursor-pointer'
                    }`}
                  >
                    {isSaving  ? <><Loader2 size={13} className="animate-spin" />Saving…</>
                      : isSaved ? <><CheckCircle2 size={13} />Score Submitted</>
                      : <><Star size={13} />Submit Score</>}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: Tab }) {
  const msgs: Record<Tab, { title: string; sub: string }> = {
    all:          { title: 'No hackathons found',         sub: 'Try adjusting your filters.' },
    participated: { title: "You haven't joined any yet",  sub: 'Browse hackathons and register your team.' },
    mine:         { title: 'No hackathons created yet',   sub: 'Click "New Hackathon" to get started.' },
    judging:      { title: 'No events assigned',          sub: 'Contact the college admin to be assigned.' },
  };
  const { title, sub } = msgs[tab];
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Trophy size={20} className="text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HackathonsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const role: RoleName = user ? resolveRole(user) : 'student';

  const defaultTab = useCallback((): Tab => {
    if (role === 'college' || role === 'admin') return 'mine';
    if (role === 'judge')                       return 'judging';
    return 'all';
  }, [role]);

  const [activeTab,   setActiveTab]   = useState<Tab>('all');
  const [hackathons,  setHackathons]  = useState<Hackathon[]>([]);
  const [fetching,    setFetching]    = useState(true);
  const [fetchError,  setFetchError]  = useState('');
  const [search,      setSearch]      = useState('');
  const [filterSt,    setFilterSt]    = useState('all');
  const [showForm,    setShowForm]    = useState(false);
  const [editTarget,  setEditTarget]  = useState<Hackathon | undefined>();
  const [judgeTarget, setJudgeTarget] = useState<Hackathon | null>(null);

  useEffect(() => { setActiveTab(defaultTab()); }, [defaultTab]);

  const fetchHackathons = useCallback(async () => {
    if (!user) return;
    setFetching(true); setFetchError('');
    try {
      const endpointMap: Record<Tab, string> = {
        all:          '/hackathons',
        participated: '/hackathons/student/participated',
        mine:         '/hackathons/college/my',
        judging:      '/hackathons/judge/assigned',
      };
      const res = await apis.get(endpointMap[activeTab]);
      setHackathons(res.data.data ?? []);
    } catch (e: any) {
      setFetchError(e.response?.data?.message ?? 'Failed to load hackathons');
    } finally {
      setFetching(false);
    }
  }, [activeTab, user]);

  useEffect(() => { fetchHackathons(); }, [fetchHackathons]);

  async function saveHackathon(data: any) {
    if (editTarget) {
      await apis.patch(`/hackathons/${editTarget._id}`, data);
    } else {
      const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await apis.post('/hackathons', { ...data, slug });
    }
    await fetchHackathons();
  }

  const filtered = hackathons.filter(h => {
    const q = search.toLowerCase();
    return (h.title.toLowerCase().includes(q) || h.description.toLowerCase().includes(q))
        && (filterSt === 'all' || h.status === filterSt);
  });

  const tabs: { key: Tab; label: string }[] = ([
    { key: 'all',          label: 'All Hackathons'    },
    { key: 'participated', label: 'My Participations' },
    { key: 'mine',         label: 'My Hackathons'     },
    { key: 'judging',      label: 'Assigned Events'   },
  ] as const).filter(t => {
    if (t.key === 'all')          return role === 'student' || role === 'admin';
    if (t.key === 'participated') return role === 'student';
    if (t.key === 'mine')         return role === 'college' || role === 'admin';
    if (t.key === 'judging')      return role === 'judge'   || role === 'admin';
    return false;
  });

  // auth guard
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) { router.replace('/login'); return null; }

  return (
    <div className="p-8">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Hackathons</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {role === 'student' && 'Discover and join hackathons at your college and beyond'}
            {role === 'college' && 'Create, manage and track your hackathons'}
            {role === 'judge'   && 'Review submissions and assign scores for your events'}
            {role === 'admin'   && 'Full access across all hackathons on the platform'}
          </p>
        </div>

        {(role === 'college' || role === 'admin') && (
          <button
            onClick={() => { setEditTarget(undefined); setShowForm(true); }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />New Hackathon
          </button>
        )}
      </div>

      {/* ── Student stat cards — matches dashboard pattern ───────────────── */}
      {role === 'student' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Live Now',  sub: '1 active events',  value: hackathons.filter(h => h.status === 'active').length,  Icon: Zap      },
            { label: 'Upcoming',  sub: 'Registrations open',value: hackathons.filter(h => h.status === 'upcoming').length, Icon: Calendar },
            { label: 'Total',     sub: 'All visible events', value: hackathons.length,                                      Icon: Trophy   },
          ].map(({ label, sub, value, Icon }) => (
            <div key={label} className="border border-border rounded-lg bg-card p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              </div>
              <Icon size={36} className="text-muted-foreground/20" />
            </div>
          ))}
        </div>
      )}

      {/* ── Tabs + Filters ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">

        {/* segmented tab control */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === t.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* search + status filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              placeholder="Search hackathons…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-9 pl-9 pr-3 rounded-md border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-48"
            />
          </div>
          <div className="relative">
            <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <select
              value={filterSt}
              onChange={e => setFilterSt(e.target.value)}
              className="h-9 pl-9 pr-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Live</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Ended</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      {fetching ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : fetchError ? (
        <div className="border border-border rounded-lg bg-card p-10 text-center">
          <p className="text-sm font-medium text-foreground mb-1">Failed to load hackathons</p>
          <p className="text-sm text-muted-foreground mb-4">{fetchError}</p>
          <button
            onClick={fetchHackathons}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-border rounded-lg bg-card">
          <EmptyState tab={activeTab} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(h => (
            <HackathonCard
              key={h._id}
              h={h}
              role={role}
              onEdit={() => { setEditTarget(h); setShowForm(true); }}
              onOpen={() => router.push(`/hackathons/${h.slug}`)}
              onJudge={() => setJudgeTarget(h)}
            />
          ))}
        </div>
      )}

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {showForm && (
        <HackathonFormModal
          hackathon={editTarget}
          onClose={() => setShowForm(false)}
          onSave={saveHackathon}
        />
      )}
      {judgeTarget && (
        <JudgeScoringModal
          hackathon={judgeTarget}
          onClose={() => setJudgeTarget(null)}
        />
      )}
    </div>
  );
}