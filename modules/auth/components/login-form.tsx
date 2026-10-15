"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Mail } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

const emailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
})

type EmailInput = z.infer<typeof emailSchema>

export function LoginForm() {
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
  })

  const handleMagicLink = async ({ email }: EmailInput) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
      return
    }

    setMagicLinkSent(true)
  }

  if (magicLinkSent) {
    return (
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
          <Mail className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Check your inbox</h2>
        <p className="text-sm text-muted-foreground">
          We sent a magic link to your email. Tap it to sign in.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(handleMagicLink)} className="space-y-3">
      <div>
        <input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border/60 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          autoComplete="email"
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-12 gap-2 font-medium"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Mail className="w-4 h-4" />
        )}
        Send magic link
      </Button>
    </form>
  )
}
