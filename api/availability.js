import { getCalendarClient, CALENDAR_ID, AVAILABILITY_CALENDAR_ID } from '../lib/googleCalendar.js'
import { getAvailabilityWindow, slotsFromAvailabilityEvents, filterFreeSlots, TIMEZONE, MEETING_DURATION_MINUTES } from '../lib/availability.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!AVAILABILITY_CALENDAR_ID) {
    res.status(500).json({ error: 'GOOGLE_AVAILABILITY_CALENDAR_ID não está configurado' })
    return
  }

  try {
    const { timeMin, timeMax } = getAvailabilityWindow()
    const calendar = getCalendarClient()

    const eventsResponse = await calendar.events.list({
      calendarId: AVAILABILITY_CALENDAR_ID,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    })

    const candidateSlots = slotsFromAvailabilityEvents(eventsResponse.data.items || [])

    if (candidateSlots.length === 0) {
      res.status(200).json({ timezone: TIMEZONE, durationMinutes: MEETING_DURATION_MINUTES, slots: [] })
      return
    }

    // exclui slots que já coincidem com reuniões já marcadas no calendário de reservas
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
