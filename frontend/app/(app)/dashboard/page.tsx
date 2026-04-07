"use client";
import { useAuth } from '@/hooks/useAuth';
import { AdminDashboard } from '@/components/dashboards/admin-dashboard';
import { StudentDashboard } from '@/components/dashboards/student-dashboard';
import { JudgeDashboard } from '@/components/dashboards/judge-dashboard';
import { CompanyDashboard } from '@/components/dashboards/company-dashboard';
import { CollegeAdminDashboard } from '@/components/dashboards/college-admin-dashboard';
import { VolunteerDashboard } from '@/components/dashboards/volunteer-dashboard';

function Unauthorized() {
  return (
    <div className="p-8">
      <p className="text-red-500">Unauthorized access</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();

  // ⏳ wait for auth
  if (loading) return <div className="p-8">Loading...</div>;

  // ❌ not logged in
  if (!user) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">
          Please log in to view the dashboard.
        </p>
      </div>
    );
  }

  const roleDashboardMap = {
    admin: AdminDashboard,
    college_admin: CollegeAdminDashboard,
    student: StudentDashboard,
    company: CompanyDashboard,
    judge: JudgeDashboard,
    volunteer: VolunteerDashboard,
  };

  const getDashboard = () => {
    if (!user?.roles?.length) return <Unauthorized />;

    // 🔥 if roles are strings
    const role = user.roles.find((r) => roleDashboardMap[r]);

    // 🔥 if roles are objects (uncomment this instead)
    // const role = user.roles.find((r) => roleDashboardMap[r.name])?.name;

    const Component = roleDashboardMap[role];

    return Component ? <Component user={user} /> : <Unauthorized />;
  };

  // ✅ IMPORTANT: return dashboard
  return getDashboard();
}