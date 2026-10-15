import { notFound } from "next/navigation"
import { z } from "zod"
import { QuizClient } from "@/modules/quiz/components/widgets/quiz-client"
import type { Language } from "@/modules/quiz/types/question"

const querySchema = z.object({
  lang: z.enum(["javascript", "python"]),
})

interface QuizPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const params = await searchParams
  const parsed = querySchema.safeParse({ lang: params.lang })
  if (!parsed.success) notFound()

  return <QuizClient language={parsed.data.lang as Language} />
}
