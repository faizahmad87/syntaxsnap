import { notFound } from "next/navigation"
import { z } from "zod"
import { ResultsClient } from "@/modules/quiz/components/widgets/results-client"
import type { Language } from "@/modules/quiz/types/question"

const querySchema = z.object({
  lang: z.enum(["javascript", "python"]),
  tokens: z.coerce.number().int().min(0),
  correct: z.coerce.number().int().min(0),
  total: z.coerce.number().int().min(1),
})

interface ResultsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams
  const parsed = querySchema.safeParse(params)
  if (!parsed.success) notFound()

  const { lang, tokens, correct, total } = parsed.data

  return (
    <ResultsClient
      lang={lang as Language}
      tokens={tokens}
      correct={correct}
      total={total}
    />
  )
}
