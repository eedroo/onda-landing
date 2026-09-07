import { getCalendarClient, CALENDAR_ID } from '../lib/googleCalendar.js'
import { generateCandidateSlots, filterFreeSlots, TIMEZONE, MEETING_DURATION_MINUTES } from '../lib/availability.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const candidateSlots = generateCandidateSlots()
    if (candidateSlots.length === 0) {
      res.status(200).json({ timezone: TIMEZONE, durationMinutes: MEETING_DURATION_MINUTES, slots: [] })
      return
    }

    const timeMin = candidateSlots[0].start.toUTC().toISO()
    const timeMax = candidateSlots[candidateSlots.length - 1].end.toUTC().toISO()

    const calendar = getCalendarClient()
    const freebusy = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        items: [{ id: CALENDAR_ID }],
      },
    })

    const busy = freebusy.data.calendars[CALENDAR_ID].busy || []
    const freeSlots = filterFreeSlots(candidateSlots, busy)

    res.status(200).json({
      timezone: TIMEZONE,
      durationMinutes: MEETING_DURATION_MINUTES,
      slots: freeSlots.map((s) => ({ start: s.start.toISO(), end: s.end.toISO() })),
    })
  } catch (err) {
    console.error('availability error', err)
    res.status(500).json({ error: 'Não foi possível carregar a disponibilidade' })
  }
}
