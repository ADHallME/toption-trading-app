// Stub for Supabase client - we're using Clerk now
// This is just to prevent import errors in legacy components

export function createBrowserClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      signOut: async () => ({ error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => ({ data: null, error: null })
        })
      }),
      upsert: () => ({ error: null })
    })
  }
}
