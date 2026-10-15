export type BadgeType =
  | "first_perfect_day"
  | "week_warrior"
  | "iron_dev"

export type Badge = {
  id: string
  userId: string
  type: BadgeType
  earnedAt: string
}

export type UserRewards = {
  userId: string
  totalTokens: number
  badges: Badge[]
}

export type TokenTransaction = {
  id: string
  userId: string
  amount: number
  reason: string
  createdAt: string
}
