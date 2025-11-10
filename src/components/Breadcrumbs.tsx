import { Link, useLocation } from 'react-router-dom';

type Props = {
  className?: string;
};

const labelMap: Record<string, string> = {
  '': 'Home',
  employee: 'Employee',
  customer: 'Customer',
  services: 'Services',
  projects: 'Projects',
  appointments: 'Appointments',
  timelogs: 'Time Logs',
  profile: 'Profile',
  users: 'Users',
  login: 'Login',
  signup: 'Sign Up',
  dashboard: 'Dashboard',
  modifications: 'Modifications',
  chatbot: 'Chatbot',
  'add': 'Add',
};

function pretty(segment: string) {
  if (!segment) return labelMap[''];
  const s = segment.toLowerCase();
  if (labelMap[s]) return labelMap[s];
  return segment.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function Breadcrumbs({ className }: Props) {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);

  const crumbs = parts.map((p, idx) => {
    const to = '/' + parts.slice(0, idx + 1).join('/');
    return { label: pretty(p), to };
  });

  return (
    <nav aria-label="Breadcrumb" className={`${className ?? ''} text-sm text-gray-400`}>
      <ol className="flex items-center gap-2">
        <li>
          <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
        </li>
        {crumbs.map((c, i) => (
          <li key={c.to} className="flex items-center">
            <span className="mx-1 text-gray-600">/</span>
            {i < crumbs.length - 1 ? (
              <Link to={c.to} className="text-gray-400 hover:text-white">{c.label}</Link>
            ) : (
              <span className="text-gray-300">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
