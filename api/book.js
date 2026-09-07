import { DateTime } from 'luxon'
import { getCalendarClient, CALENDAR_ID } from '../lib/googleCalendar.js'
import { filterFreeSlots, TIMEZONE, MEETING_DURATION_MINUTES } from '../lib/availability.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { start, name, email, notes } = req.body || {}

  if (!start || !name || !email) {
    res.status(400).json({ error: 'Campos obrigatórios em falta: nome, email e horário' })
    return
  }
  if (!EMAIL_PATTERN.test(email)) {
    res.status(400).json({ error: 'Email inválido' })
    return
  }

  const slotStart = DateTime.fromISO(start, { zone: TIMEZONE })
  if (!slotStart.isValid) {
    res.status(400).json({ error: 'Horário inválido' })
    return
  }
  const slotEnd = slotStart.plus({ minutes: MEETING_DURATION_MINUTES })

  try {
    const calendar = getCalendarClient()

    // revalida que o horário continua livre (evita corrida entre dois utilizadores)
    const freebusy = await calendar.freebusy.query({
      requestBody: {
        timeMin: slotStart.toUTC().toISO(),
        timeMax: slotEnd.toUTC().toISO(),
        items: [{ id: CALENDAR_ID }],
      },
    })
    const busy = freebusy.data.calendars[CALENDAR_ID].busy || []
    const stillFree = filterFreeSlots([{ start: slotStart, end: slotEnd }], busy)
    if (stillFree.length === 0) {
      res.status(409).json({ error: 'Este horário acabou de ser reservado. Escolhe outro.' })
      return
    }

    const event = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      requestBody: {
        summary: `Reunião Onda — ${name}`,
        description: notes ? `Notas do lead: ${notes}` : undefined,
        start: { dateTime: slotStart.toISO(), timeZone: TIMEZONE },
        end: { dateTime: slotEnd.toISO(), timeZone: TIMEZONE },
        attendees: [{ email }],
        conferenceData: {
          createRequest: {
            requestId: `onda-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
    })

    res.status(200).json({
      meetLink: event.data.hangoutLink,
      eventLink: event.data.htmlLink,
      start: slotStart.toISO(),
      end: slotEnd.toISO(),
    })
  } catch (err) {
    console.error('book error', err)
    res.status(500).json({ error: 'Não foi possível criar a reunião' })
  }
}
