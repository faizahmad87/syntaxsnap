import { startOfDay, differenceInCalendarDays } from "date-fns"

export function todayUTC(): Date {
  return startOfDay(new Date())
}

export function daysBetween(a: Date, b: Date): number {
  return Math.abs(differenceInCalendarDays(a, b))
}

export function isSameUTCDay(a: Date, b: Date): boolean {
  return differenceInCalendarDays(a, b) === 0
}

export function isYesterdayUTC(date: Date): boolean {
  return differenceInCalendarDays(new Date(), date) === 1
}
