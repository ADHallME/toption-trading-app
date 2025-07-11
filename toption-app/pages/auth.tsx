import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/router'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function AuthPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      
      if (user) {
        router.push('/dashboard')
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.push('/dashboard')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Or create a new account to get started
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <Auth
              supabaseClient={supabase}
              view="magic_link"
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#3b82f6',
                      brandAccent: '#2563eb',
                      brandButtonText: 'white',
                      defaultButtonBackground: '#374151',
                      defaultButtonBackgroundHover: '#4b5563',
                      defaultButtonBorder: '#6b7280',
                      defaultButtonText: '#f3f4f6',
                      dividerBackground: '#374151',
                      inputBackground: '#1f2937',
                      inputBorder: '#374151',
                      inputBorderHover: '#4b5563',
                      inputBorderFocus: '#3b82f6',
                      inputText: '#f3f4f6',
                      inputLabelText: '#9ca3af',
                      inputPlaceholder: '#6b7280',
                      messageText: '#f87171',
                      messageTextDanger: '#f87171',
                      anchorTextColor: '#60a5fa',
                      anchorTextHoverColor: '#93c5fd',
                    }
                  }
                },
                className: {
                  anchor: 'text-blue-400 hover:text-blue-300',
                  button: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150',
                  container: 'space-y-4',
                  divider: 'border-slate-600',
                  input: 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500',
                  label: 'text-slate-300 font-medium',
                  loader: 'text-blue-400',
                  message: 'text-red-400',
                }
              }}
              providers={['google']}
              redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
              onlyThirdPartyProviders={false}
              magicLink={true}
              showLinks={true}
              localization={{
                variables: {
                  sign_up: {
                    email_label: 'Email address',
                    password_label: 'Create a password',
                    button_label: 'Sign up',
                    loading_button_label: 'Signing up...',
                    social_provider_text: 'Sign up with {{provider}}',
                    link_text: "Don't have an account? Sign up",
                    confirmation_text: 'Check your email for the confirmation link'
                  },
                  sign_in: {
                    email_label: 'Email address',
                    password_label: 'Your password',
                    button_label: 'Sign in',
                    loading_button_label: 'Signing in...',
                    social_provider_text: 'Sign in with {{provider}}',
                    link_text: 'Already have an account? Sign in'
                  },
                  magic_link: {
                    email_input_label: 'Email address',
                    email_input_placeholder: 'Your email address',
                    button_label: 'Send magic link',
                    loading_button_label: 'Sending magic link...',
                    link_text: 'Send a magic link email',
                    confirmation_text: 'Check your email for the magic link'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
