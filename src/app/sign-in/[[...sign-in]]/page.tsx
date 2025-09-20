import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1b]">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-gray-900 border border-gray-800",
            socialButtonsBlockButton: "bg-white hover:bg-gray-100 text-gray-900 border-gray-200"
          }
        }}
        forceRedirectUrl="/dashboard"
        signUpUrl="/sign-up"
      />
    </div>
  )
}
