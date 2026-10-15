"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/molecules/progress-bar"
import { SessionHeader } from "@/components/organisms/session-header"
import { useSubmitAnswer } from "../../hooks/use-submit-answer"
import { QuestionCard } from "../presentation/question-card"
import { AnswerOption } from "../presentation/answer-option"
import { WhyCard } from "../presentation/why-card"
import type { QuizQuestion, AnswerResult, Language } from "../../types/question"
import type { OptionState } from "../presentation/answer-option"

interface QuizSessionProps {
  questions: QuizQuestion[]
  language: Language
  initialStreak: number
  initialTokens: number
  initialIndex?: number
}

export function QuizSession({
  questions,
  language,
  initialStreak,
  initialTokens,
  initialIndex = 0,
}: QuizSessionProps) {
  const router = useRouter()
  const { submit, isSubmitting } = useSubmitAnswer()

  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [result, setResult] = useState<AnswerResult | null>(null)
  const [sessionResults, setSessionResults] = useState<AnswerResult[]>([])
  const [tokenBalance, setTokenBalance] = useState(initialTokens)

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  const handleCheck = useCallback(async () => {
    if (!selectedId || isSubmitting || result) return

    const answerResult = await submit({
      questionId: currentQuestion.id,
      selectedOptionId: selectedId,
      language,
    })

    if (!answerResult) {
      toast.error("Failed to submit answer. Please try again.")
      setSelectedId(null)
      return
    }

    setResult(answerResult)
    setSessionResults((prev) => [...prev, answerResult])
    setTokenBalance((prev) => prev + answerResult.tokensEarned)
  }, [selectedId, isSubmitting, result, currentQuestion, language, submit])

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      const totalTokensEarned = sessionResults.reduce((s, r) => s + r.tokensEarned, 0)
      const params = new URLSearchParams({
        lang: language,
        tokens: totalTokensEarned.toString(),
        correct: sessionResults.filter((r) => r.isCorrect).length.toString(),
        total: questions.length.toString(),
      })
      router.push(`/results?${params}`)
      return
    }

    setCurrentIndex((i) => i + 1)
    setSelectedId(null)
    setResult(null)
  }, [isLastQuestion, language, sessionResults, questions.length, router])

  const getOptionState = useCallback(
    (optionId: string): OptionState => {
      if (!result) {
        if (optionId === selectedId) return "selected"
        return "idle"
      }
      if (optionId === result.correctOptionId) return "correct"
      if (optionId === result.selectedOptionId && !result.isCorrect) return "incorrect"
      return "disabled"
    },
    [result, selectedId],
  )

  return (
    <div className="flex flex-col min-h-svh">
      {/* Top bar */}
      <SessionHeader
        backHref="/"
        streakCount={initialStreak}
        tokenBalance={tokenBalance}
      />

      {/* Scrollable content */}
      <div className={`flex-1 px-4 space-y-4 ${result ? "pb-[240px]" : "pb-[96px]"}`}>
        {/* Progress */}
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        {/* Question */}
        <QuestionCard
          prompt={currentQuestion.prompt}
          language={currentQuestion.language}
          difficulty={currentQuestion.difficulty}
        />

        {/* Options */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((option, i) => (
            <AnswerOption
              key={option.id}
              option={option}
              index={i}
              state={getOptionState(option.id)}
              onClick={() => !result && setSelectedId((prev) => prev === option.id ? null : option.id)}
            />
          ))}
        </div>
      </div>

      {/* Fixed bottom action area */}
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md">
        {result ? (
          <WhyCard result={result} isLast={isLastQuestion} onNext={handleNext} />
        ) : (
          <div className="border-t border-border bg-background px-4 pt-4 pb-action">
            <Button
              onClick={handleCheck}
              disabled={!selectedId || isSubmitting}
              className="w-full h-14 font-semibold text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Checking…
                </>
              ) : (
                "Check Answer"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
