export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { getAuthenticatedUser } from "@/lib/auth"
import { HomeClient } from "@/modules/home/components/home-client"

export default async function HomePage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect("/login")

  return <HomeClient />
}
