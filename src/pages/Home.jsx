import { Link } from 'react-router-dom';
import { Boxes, Lock, Plug, Zap } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

const FEATURES = [
  { icon: Zap, title: 'Vite + React', text: 'Instant dev server and fast production builds.' },
  { icon: Lock, title: 'Auth built in', text: 'Context-based auth, protected routes and role checks.' },
  { icon: Plug, title: 'API layer', text: 'One Fetch wrapper handles base URL, tokens, refresh and errors.' },
  { icon: Boxes, title: 'Clear structure', text: 'Pages, layouts, components, hooks and api each have a home.' },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <section className="max-w-2xl">
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">Starter template</span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Your app is running.
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          This is the baseline React project. Edit <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">src/pages/Home.jsx</code> and
          the page reloads instantly. Log in with any email and password to see the protected dashboard.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to={ROUTES.LOGIN} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
            Try the login flow
          </Link>
          <a href="#features" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            What's included
          </a>
        </div>
      </section>

      <section id="features" className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-slate-200 bg-white p-5">
            <Icon className="text-brand-600" size={22} />
            <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
