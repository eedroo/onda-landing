import { google } from 'googleapis'

// Calendário onde as reuniões marcadas por clientes são criadas (e onde
// verificamos conflitos para não haver dupla marcação).
export const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary'

// Calendário onde TU marcas blocos de disponibilidade — cada evento aqui
// representa um período em que estás livre para reuniões. Tem de ser um
// calendário diferente do CALENDAR_ID para não haver conflito entre o
// bloco de disponibilidade e as reuniões marcadas dentro dele.
export const AVAILABILITY_CALENDAR_ID = process.env.GOOGLE_AVAILABILITY_CALENDAR_ID

export function getCalendarClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })
  return google.calendar({ version: 'v3', auth: oauth2Client })
}
