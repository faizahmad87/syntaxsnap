"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Failed to sign out.")
      return
    }
    router.push("/login")
    router.refresh()
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSignOut}
      className="w-10 h-10 text-muted-foreground"
      aria-label="Sign out"
    >
      <LogOut className="w-4 h-4" />
    </Button>
  )
}
