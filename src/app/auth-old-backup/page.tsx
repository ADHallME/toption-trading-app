'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import AuthForm from '@/components/auth/AuthForm'

export default function AuthPage() {
  const router = useRouter()
  const supabase = createBrowserClient()
  
  useEffect(() => {
    const checkAuth = async () => {
      // If there's a hash with access_token, we just came from OAuth
      if (window.location.hash && window.location.hash.includes('access_token')) {
        // Wait a moment for Supabase to process the token
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
        return
      }
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    
    checkAuth()
  }, [router, supabase.auth])
  
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