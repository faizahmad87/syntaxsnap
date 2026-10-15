import { db } from "./index"
import { questions } from "./schema"
import javascriptQuestions from "../data/questions/javascript.json"
import pythonQuestions from "../data/questions/python.json"

type QuestionSeedRecord = {
  id: string
  language: "javascript" | "python"
  difficulty: "easy" | "medium" | "hard"
  prompt: string
  options: Array<{ id: string; text: string }>
  correctOptionId: string
  explanation: string
}

async function seed() {
  const allQuestions = [
    ...javascriptQuestions,
    ...pythonQuestions,
  ] as QuestionSeedRecord[]

  await db
    .insert(questions)
    .values(
      allQuestions.map((q) => ({
        id: q.id,
        language: q.language,
        difficulty: q.difficulty,
        prompt: q.prompt,
        options: q.options,
        correctOptionId: q.correctOptionId,
        explanation: q.explanation,
      })),
    )
    .onConflictDoNothing()

  console.log(`Seeded ${allQuestions.length} questions.`)
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err)
    process.exit(1)
  })
  .finally(() => process.exit(0))
