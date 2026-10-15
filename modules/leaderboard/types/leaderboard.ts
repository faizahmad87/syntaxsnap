export type LeaderboardPeriod = "weekly" | "all_time"

export type LeaderboardEntry = {
  rank: number
  userId: string
  displayName: string
  avatarUrl: string | null
  tokens: number
  streakCount: number
}

export type Leaderboard = {
  period: LeaderboardPeriod
  entries: LeaderboardEntry[]
  currentUserEntry: LeaderboardEntry | null
}
