'use client'

import AuthForm from '@/components/auth/AuthForm'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Toption</h1>
          <p className="text-gray-400">Sign in to access your trading dashboard</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
} 