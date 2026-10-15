export type Streak = {
  id: string
  userId: string
  currentCount: number
  longestCount: number
  lastActivityDate: string | null
  freezesAvailable: number
  freezesUsedThisWeek: number
  updatedAt: string
}

export type StreakUpdateResult = {
  streak: Streak
  bonusTokens: number
  isNewRecord: boolean
}
