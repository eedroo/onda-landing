import { DateTime } from 'luxon'

export const TIMEZONE = process.env.TIMEZONE || 'Europe/Lisbon'
export const MEETING_DURATION_MINUTES = Number(process.env.MEETING_DURATION_MINUTES || 30)

const WORKING_HOURS_START = process.env.WORKING_HOURS_START || '09:00'
const WORKING_HOURS_END = process.env.WORKING_HOURS_END || '18:00'
// Luxon weekday: 1 = segunda ... 7 = domingo
const WORKING_DAYS = (process.env.WORKING_DAYS || '1,2,3,4,5').split(',').map(Number)
const BOOKING_WINDOW_DAYS = Number(process.env.BOOKING_WINDOW_DAYS || 14)
const MIN_NOTICE_HOURS = Number(process.env.MIN_NOTICE_HOURS || 12)

export function generateCandidateSlots() {
  const now = DateTime.now().setZone(TIMEZONE)
  const earliestStart = now.plus({ hours: MIN_NOTICE_HOURS })
  const [startH, startM] = WORKING_HOURS_START.split(':').map(Number)
  const [endH, endM] = WORKING_HOURS_END.split(':').map(Number)

  const slots = []
  for (let dayOffset = 0; dayOffset <= BOOKING_WINDOW_DAYS; dayOffset++) {
    const day = now.plus({ days: dayOffset }).startOf('day')
    if (!WORKING_DAYS.includes(day.weekday)) continue

    let slotStart = day.set({ hour: startH, minute: startM })
    const dayEnd = day.set({ hour: endH, minute: endM })

    while (slotStart.plus({ minutes: MEETING_DURATION_MINUTES }) <= dayEnd) {
      const slotEnd = slotStart.plus({ minutes: MEETING_DURATION_MINUTES })
      if (slotStart >= earliestStart) {
        slots.push({ start: slotStart, end: slotEnd })
      }
      slotStart = slotEnd
    }
  }
  return slots
}

export function filterFreeSlots(candidateSlots, busyPeriods) {
  return candidateSlots.filter((slot) => {
    return !busyPeriods.some((busy) => {
      const busyStart = DateTime.fromISO(busy.start)
      const busyEnd = DateTime.fromISO(busy.end)
      return slot.start < busyEnd && slot.end > busyStart
    })
  })
}
