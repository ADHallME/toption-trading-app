import { redirect } from 'next/navigation'

export default function AuthPage() {
  // Just immediately redirect to dashboard
  // This page only exists to catch Clerk's redirect
  redirect('/dashboard')
}
