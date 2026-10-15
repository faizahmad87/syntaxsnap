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
        "border-t p-4 space-y-4 animate-in slide-in-from-bottom-4 duration-300",
        isCorrect ? "bg-success/8 border-success/30" : "bg-destructive/8 border-destructive/30",
      )}
    >
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
        <div className="flex-1">
          <p
            className={cn("font-semibold text-sm", isCorrect ? "text-success" : "text-destructive")}
          >
            {isCorrect ? "Correct!" : "Not quite"}
          </p>
          {tokensEarned > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              +{tokensEarned} 🪙 tokens earned
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>

      <Button
        onClick={onNext}
        className="w-full h-14 font-semibold text-base"
        variant={isCorrect ? "default" : "secondary"}
      >
        {isLast ? "See results" : "Next →"}
      </Button>
    </div>
  )
}
