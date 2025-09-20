import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1b]">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-gray-900 border border-gray-800"
          }
        }}
        redirectUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </div>
  )
}
