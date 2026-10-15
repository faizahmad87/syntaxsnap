export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { getAuthenticatedUser } from "@/lib/auth"
import { BottomNav } from "@/components/organisms/bottom-nav"
import { Toaster } from "sonner"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthenticatedUser()
  if (!user) redirect("/login")

  return (
    <div className="min-h-svh">
      <main className="mx-auto w-full max-w-md safe-top">
        {children}
      </main>
      <BottomNav />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "oklch(0.145 0.004 258)",
            border: "1px solid oklch(0.21 0.006 258)",
            color: "oklch(0.985 0 0)",
          },
        }}
      />
    </div>
  )
}
