# HackHub - Hackathon Management Platform

A comprehensive, role-based hackathon management platform built with Next.js 16, React Redux, and TypeScript. Designed to streamline hackathon organization and management with dedicated dashboards for administrators, students, judges, companies, college admins, and volunteers.

## Features

### Core Features
- **Role-Based Access Control**: Different dashboards and permissions for 6 user roles
- **User Authentication**: Secure login/signup system with mock authentication
- **Real-Time Dashboards**: Role-specific dashboards with analytics and metrics
- **Team Management**: Create teams, invite members, track team statistics
- **Project Submissions**: Submit and manage hackathon projects
- **User Profiles**: Customize user profiles with achievements and statistics

### User Roles & Capabilities

#### Admin
- System-wide oversight and management
- User and hackathon administration
- Analytics and reporting
- System health monitoring

#### College Admin
- Manage college-specific participation
- Track student and team statistics
- Monitor college performance across hackathons
- Download reports and resources

#### Student
- Register for hackathons
- Create and manage teams
- Submit projects
- Track participation history
- View achievements

#### Company
- Post challenge problems
- Track submissions and engagement
- View analytics on problem performance
- Rate and review submissions

#### Judge
- Review and score projects
- Track scoring progress
- Generate evaluation reports
- Manage scorecard submissions

#### Volunteer
- Manage assigned tasks
- Track task completion
- Monitor volunteer hours
- Update task status

### UI Components
- **Data Table**: Sortable, paginated data display
- **Form Builder**: Reusable form component with validation
- **Modal Dialogs**: Custom modal implementation
- **Status Badges**: Predefined status indicators
- **Pagination**: Custom pagination component
- **Empty States**: Contextual empty state components

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (with App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Redux Toolkit
- **Charting**: Recharts
- **Icons**: Lucide React

### Architecture
- **Server Components**: React Server Components for optimal performance
- **Client Components**: Strategic client-side rendering for interactivity
- **API Routes**: Next.js API routes for backend logic
- **Type Safety**: Full TypeScript support

## Project Structure

```
app/
├── (app)/                    # Protected app routes
│   ├── dashboard/           # Role-based dashboards
│   ├── users/              # User management
│   ├── hackathons/         # Hackathon listing
│   ├── projects/           # Project management
│   ├── teams/              # Team management
│   ├── profile/            # User profile
│   ├── messages/           # Messaging system
│   ├── settings/           # User settings
│   └── layout.tsx          # App layout with sidebar
├── api/
│   └── auth/               # Authentication endpoints
├── login/                  # Login page
├── signup/                 # Signup page
├── page.tsx               # Landing page
├── layout.tsx             # Root layout
└── globals.css            # Global styles

components/
├── dashboards/            # Role-specific dashboards
├── layout/               # Layout components
├── shared/               # Shared UI components
└── ui/                   # shadcn/ui components

hooks/
├── useAuth.ts            # Authentication hook
└── useUI.ts              # UI state hook

lib/
├── store.ts              # Redux store configuration
└── utils.ts              # Utility functions
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Install dependencies**:
```bash
pnpm install
```

2. **Run development server**:
```bash
pnpm dev
```

3. **Open in browser**:
Navigate to `http://localhost:3000`

### Demo Credentials

**Admin Account**:
- Email: `demo@example.com`
- Password: `demo123`
- Role: Admin

**Student Account**:
- Email: `student@example.com`
- Password: `demo123`
- Role: Student

**Judge Account**:
- Email: `judge@example.com`
- Password: `demo123`
- Role: Judge

## Key Pages & Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page

### Protected Routes (Require Authentication)
- `/dashboard` - Role-based dashboard
- `/users` - User management
- `/hackathons` - Hackathon listing
- `/projects` - Project management
- `/teams` - Team management
- `/profile` - User profile
- `/messages` - Messaging
- `/settings` - Settings

## Redux Store Structure

### Auth Slice
```typescript
{
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
```

### UI Slice
```typescript
{
  sidebarOpen: boolean
  darkMode: boolean
  notificationCount: number
}
```

## Component Examples

### Using the Data Table
```typescript
import { DataTable, Column } from '@/components/shared/data-table';

interface User {
  id: string;
  name: string;
  email: string;
}

const columns: Column<User>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
];

<DataTable columns={columns} data={users} />
```

### Using the Form Builder
```typescript
import { FormBuilder } from '@/components/shared/form-builder';

const fields = [
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'message', label: 'Message', type: 'textarea' },
];

<FormBuilder
  fields={fields}
  onSubmit={handleSubmit}
  submitLabel="Send"
/>
```

### Using Modals
```typescript
import { Modal } from '@/components/shared/modal';

<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Create User"
  size="md"
>
  {/* Modal content */}
</Modal>
```

## Customization

### Theme
Modify the design tokens in `/app/globals.css` to customize colors:
- Primary: `#7c3aed` (Purple)
- Accent: `#7c3aed` (Purple)
- Dark mode enabled by default

### Navigation
Edit the menu items in `/components/layout/sidebar.tsx`:
```typescript
const MENU_ITEMS = [
  { icon: Home, label: 'Home', href: '/' },
  // Add more items here
];
```

## Next Steps for Production

1. **Database Integration**: Replace mock data with real database (Supabase, PostgreSQL, etc.)
2. **Authentication**: Implement real authentication (NextAuth.js, Auth0, etc.)
3. **Image Upload**: Add file storage (Vercel Blob, AWS S3, etc.)
4. **Email Notifications**: Implement email service
5. **Analytics**: Add analytics tracking
6. **Testing**: Add unit and integration tests
7. **Deployment**: Deploy to Vercel or your hosting platform

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - feel free to use this project for your hackathon!

## Support

For issues, questions, or suggestions, please open an issue in the repository or contact the development team.

---

Built with ❤️ for the hackathon community
