'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase'

export default function AuthDebugPage() {
  const [status, setStatus] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if Supabase client is initialized
        setStatus(prev => ({ ...prev, client: 'Supabase client created' }))
        
        // Check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        setStatus(prev => ({ 
          ...prev, 
          session: session ? 'Session found' : 'No session',
          sessionError: sessionError?.message || 'None',
          user: session?.user?.email || 'Not logged in'
        }))
        
        // Check Supabase URL is set
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        setStatus(prev => ({ 
          ...prev, 
          supabaseUrl: supabaseUrl ? 'Set' : 'NOT SET - THIS IS THE PROBLEM'
        }))
        
        // Check auth state
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          setStatus(prev => ({ 
            ...prev, 
            authEvent: event,
            authSession: session ? 'Active' : 'None'
          }))
        })
        
        setLoading(false)
        
        return () => subscription.unsubscribe()
      } catch (error) {
        setStatus(prev => ({ ...prev, error: error?.toString() }))
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [supabase.auth])
  
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Auth System Debug</h1>
        
        {loading ? (
          <p className="text-gray-400">Checking auth system...</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(status).map(([key, value]) => (
              <div key={key} className="bg-slate-900 p-4 rounded">
                <span className="text-gray-400 font-semibold">{key}:</span>
                <span className={`ml-2 ${
                  value?.toString().includes('NOT SET') || value?.toString().includes('Error') 
                    ? 'text-red-400' 
                    : 'text-green-400'
                }`}>
                  {value?.toString()}
                </span>
              </div>
            ))}
            
            <div className="mt-8 space-y-4">
              <a 
                href="/auth" 
                className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded font-semibold"
              >
                Go to Login Page
              </a>
              <a 
                href="/" 
                className="block w-full text-center bg-gray-700 hover:bg-gray-600 text-white py-3 rounded font-semibold"
              >
                Back to Home
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}