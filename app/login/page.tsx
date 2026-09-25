import Image from "next/image"
import { login } from "./login.actions"
import { WreathPattern } from "@/components/shared/WreathPattern"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Brand panel */}
      <div className="relative md:w-[45%] bg-sage flex flex-col items-center justify-center px-10 py-16 overflow-hidden">
        <WreathPattern />
        <div className="relative z-10 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="RM Rice Mill"
            width={248}
            height={248}
            className="object-contain"
            priority
            unoptimized
          />
          <h1 className="font-serif text-ink text-2xl">Apeksha Rice Mill</h1>
          <p className="text-muted text-sm mt-2 max-w-[20rem] leading-relaxed">
            From paddy intake to dispatch, tracked in one place.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 bg-paper flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="flex gap-1.5 mb-6">
            <span className="h-1 w-8 rounded-full bg-paddy" />
            <span className="h-1 w-8 rounded-full bg-ink" />
            <span className="h-1 w-8 rounded-full bg-accent-red" />
          </div>

          <h2 className="font-serif text-ink text-2xl mb-1">Sign in</h2>
          <p className="text-muted text-sm mb-8">Enter your credentials to continue.</p>

          <form action={login} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-s font-medium text-ink mb-1.5 tracking-tight">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoFocus
                className="w-full bg-transparent border-0 border-b-2 border-line focus:border-paddy outline-none py-2.5 text-ink placeholder:text-muted/40 placeholder:text-sm transition-colors duration-200"
                placeholder="your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-s font-medium text-ink mb-1.5 tracking-tight">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-transparent border-0 border-b-2 border-line focus:border-paddy outline-none py-2.5 text-ink placeholder:text-muted/40 placeholder:text-sm transition-colors duration-200"
                placeholder="••••••••"
              />
            </div>

            {searchParams?.error && (
              <p className="text-accent-red text-sm">
                Incorrect username or password.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-paddy text-paper py-3 rounded-md hover:-translate-y-0.5 hover:shadow-lg hover:shadow-paddy/20 transition-all duration-200 text-sm font-medium mt-2"
            >
              Sign in
            </button>
          </form>

          <p className="text-muted text-xs mt-6">
            Access is set up by the mill administrator.
          </p>
        </div>
      </div>
    </div>
  )
}