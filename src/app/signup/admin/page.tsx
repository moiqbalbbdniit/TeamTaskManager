import { SignupForm } from '@/components/auth/SignupForm';

export default function AdminSignupPage() {
  return (
    <SignupForm
      role="admin"
      title="Create an admin account"
      description="Admins manage projects, assign work, and control team access. This flow requires the invite key from your environment."
      submitLabel="Create admin account"
      accentClassName="from-blue-700 to-cyan-500"
      showAdminKey
    />
  );
}