import { DateTime } from 'luxon'

export const TIMEZONE = process.env.TIMEZONE || 'Europe/Lisbon'
export const MEETING_DURATION_MINUTES = Number(process.env.MEETING_DURATION_MINUTES || 30)

const BOOKING_WINDOW_DAYS = Number(process.env.BOOKING_WINDOW_DAYS || 14)
const MIN_NOTICE_HOURS = Number(process.env.MIN_NOTICE_HOURS || 12)

export function getAvailabilityWindow() {
  const now = DateTime.now().setZone(TIMEZONE)
  return {
    timeMin: now.toUTC().toISO(),
    timeMax: now.plus({ days: BOOKING_WINDOW_DAYS }).toUTC().toISO(),
  }
}

function roundUpToSlotBoundary(dateTime) {
  const totalMinutes = dateTime.hour * 60 + dateTime.minute
  const remainder = totalMinutes % MEETING_DURATION_MINUTES
  const rounded = remainder === 0 ? dateTime : dateTime.plus({ minutes: MEETING_DURATION_MINUTES - remainder })
  return rounded.set({ second: 0, millisecond: 0 })
}

// Cada evento no calendário de disponibilidade representa um período em
// que o dono da agenda está livre. Fatiamos esse período em slots de
// MEETING_DURATION_MINUTES. Eventos de dia inteiro são ignorados (não têm
// hora de início/fim definida).
export function slotsFromAvailabilityEvents(events) {
  const now = DateTime.now().setZone(TIMEZONE)
  const earliestStart = now.plus({ hours: MIN_NOTICE_HOURS })
  const slots = []

  for (const event of events) {
    if (!event.start?.dateTime || !event.end?.dateTime) continue

    let slotStart = roundUpToSlotBoundary(DateTime.fromISO(event.start.dateTime).setZone(TIMEZONE))
    const eventEnd = DateTime.fromISO(event.end.dateTime).setZone(TIMEZONE)

    while (slotStart.plus({ minutes: MEETING_DURATION_MINUTES }) <= eventEnd) {
      const slotEnd = slotStart.plus({ minutes: MEETING_DURATION_MINUTES })
      if (slotStart >= earliestStart) {
        slots.push({ start: slotStart, end: slotEnd })
      }
      slotStart = slotEnd
    }
  }

  return slots.sort((a, b) => a.start.toMillis() - b.start.toMillis())
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
