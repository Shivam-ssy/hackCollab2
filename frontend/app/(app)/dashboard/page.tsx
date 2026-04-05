'use client';

import { useAuth } from '@/hooks/useAuth';
import { AdminDashboard } from '@/components/dashboards/admin-dashboard';
import { StudentDashboard } from '@/components/dashboards/student-dashboard';
import { JudgeDashboard } from '@/components/dashboards/judge-dashboard';
import { CompanyDashboard } from '@/components/dashboards/company-dashboard';
import { CollegeAdminDashboard } from '@/components/dashboards/college-admin-dashboard';
import { VolunteerDashboard } from '@/components/dashboards/volunteer-dashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Please log in to view the dashboard.</p>
      </div>
    );
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard user={user} />;
    case 'college_admin':
      return <CollegeAdminDashboard user={user} />;
    case 'student':
      return <StudentDashboard user={user} />;
    case 'company':
      return <CompanyDashboard user={user} />;
    case 'judge':
      return <JudgeDashboard user={user} />;
    case 'volunteer':
      return <VolunteerDashboard user={user} />;
    default:
      return <AdminDashboard user={user} />;
  }
}
