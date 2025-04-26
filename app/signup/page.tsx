import Link from "next/link"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary/20" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/">TradeWave</Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              Join our community of creators, developers, and artists. Share your work,
              collaborate on projects, and earn tokens.
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details to sign up for TradeWave
            </p>
          </div>
          <SignupForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="hover:text-brand underline underline-offset-4"
            >
              Already have an account? Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
