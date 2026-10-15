import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AnswerOption as AnswerOptionType } from "../../types/question"

export type OptionState = "idle" | "selected" | "correct" | "incorrect" | "disabled"

const OPTION_LABELS = ["A", "B", "C", "D"]

interface AnswerOptionProps {
  option: AnswerOptionType
  index: number
  state: OptionState
  onClick: () => void
}

export function AnswerOption({ option, index, state, onClick }: AnswerOptionProps) {
  const isDisabled = state === "disabled" || state === "correct" || state === "incorrect"

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "w-full flex items-center gap-4 rounded-2xl border p-4 text-left text-sm font-medium min-h-[64px] transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        {
          "border-border bg-card cursor-pointer active:scale-[0.99]":
            state === "idle",
          "border-primary/70 bg-primary/10 cursor-pointer":
            state === "selected",
          "border-success/60 bg-success/10 cursor-default":
            state === "correct",
          "border-destructive/60 bg-destructive/10 cursor-default":
            state === "incorrect",
          "border-border/40 bg-card/50 opacity-50 cursor-default":
            state === "disabled",
        },
      )}
    >
      <div
        className={cn(
          "w-9 h-9 shrink-0 rounded-xl border flex items-center justify-center text-xs font-bold transition-all",
          {
            "border-border/60 text-muted-foreground": state === "idle",
            "border-primary/60 text-primary bg-primary/10": state === "selected",
            "border-success/50 text-success bg-success/10": state === "correct",
            "border-destructive/50 text-destructive bg-destructive/10":
              state === "incorrect",
            "border-border/30 text-muted-foreground/40": state === "disabled",
          },
        )}
      >
        {state === "correct" ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : state === "incorrect" ? (
          <XCircle className="w-4 h-4" />
        ) : (
          OPTION_LABELS[index]
        )}
      </div>

      <span
        className={cn("leading-snug flex-1", {
          "text-foreground": state === "idle" || state === "selected",
          "text-success font-semibold": state === "correct",
          "text-destructive": state === "incorrect",
          "text-muted-foreground": state === "disabled",
        })}
      >
        {option.text}
      </span>
    </button>
  )
}
