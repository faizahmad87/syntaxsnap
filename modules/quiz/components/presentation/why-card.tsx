"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { AnswerResult } from "../../types/question"

interface WhyCardProps {
  result: AnswerResult
  isLast: boolean
  onNext: () => void
}

export function WhyCard({ result, isLast, onNext }: WhyCardProps) {
  const { isCorrect, tokensEarned, explanation } = result

  return (
    <div
      className={cn(
        "bg-card px-4 pt-3 pb-action space-y-4 animate-in slide-in-from-bottom-4 duration-300",
      )}
    >
      {/* Status row */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            isCorrect ? "bg-success/15" : "bg-destructive/15",
          )}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <XCircle className="w-5 h-5 text-destructive" />
          )}
        </div>
        <div>
          <p className={cn("font-bold", isCorrect ? "text-success" : "text-destructive")}>
            {isCorrect ? "Correct!" : "Not quite"}
          </p>
          {tokensEarned > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">+{tokensEarned} 🪙 tokens earned</p>
          )}
        </div>
      </div>

      {/* Explanation */}
      <div className={cn(
        "rounded-xl px-4 py-3",
        isCorrect ? "bg-success/10" : "bg-destructive/10",
      )}>
        <p className="text-sm leading-relaxed text-foreground">{explanation}</p>
      </div>

      {/* CTA */}
      <Button
        onClick={onNext}
        className="w-full h-13 font-semibold text-base cursor-pointer"
        variant={isCorrect ? "default" : "secondary"}
      >
        {isLast ? "See results →" : "Next →"}
      </Button>
    </div>
  )
}
