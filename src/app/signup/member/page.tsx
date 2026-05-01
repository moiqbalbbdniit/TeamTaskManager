import { SignupForm } from '@/components/auth/SignupForm';

export default function MemberSignupPage() {
  return (
    <SignupForm
      role="member"
      title="Create a member account"
      description="Members can join projects, work on assigned tasks, and keep their status updated in one place."
      submitLabel="Create member account"
      accentClassName="from-slate-800 to-slate-600"
    />
  );
}