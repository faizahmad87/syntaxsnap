import { LoginForm } from "@/modules/auth/components/login-form"

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
          <span className="text-3xl">⚡</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">SyntaxSnap</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          5 questions a day. Keep your syntax sharp.
        </p>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-xl shadow-black/20">
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        By signing in, you agree to our{" "}
        <span className="text-primary cursor-pointer hover:underline">Terms</span>{" "}
        and{" "}
        <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
      </p>
    </div>
  )
}
