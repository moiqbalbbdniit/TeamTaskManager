'use client';

import Link from 'next/link';

const cards = [
  {
    title: 'Member signup',
    description: 'Join an existing team, manage assigned tasks, and collaborate on projects.',
    href: '/signup/member',
    accent: 'from-slate-800 to-slate-600',
  },
  {
    title: 'Admin signup',
    description: 'Create an admin account for project oversight and team management.',
    href: '/signup/admin',
    accent: 'from-blue-700 to-cyan-500',
  },
];

export default function SignupChooserPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
            Team Task Manager
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Choose the account type you want to create.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            The project now has a clear onboarding flow: members sign up normally, while admins use a separate invite-key protected flow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/60 backdrop-blur transition-transform duration-200 hover:-translate-y-1"
            >
              <div className={`mb-6 h-2 w-24 rounded-full bg-gradient-to-r ${card.accent}`} />
              <h2 className="text-2xl font-bold text-gray-900">{card.title}</h2>
              <p className="mt-3 text-gray-600">{card.description}</p>
              <span className="mt-6 inline-flex items-center font-medium text-blue-700 group-hover:text-blue-800">
                Continue
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="text-sm text-gray-500">
          Already registered? <Link href="/login" className="font-medium text-blue-700 hover:text-blue-800">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
