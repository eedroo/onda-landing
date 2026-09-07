import http from 'node:http'
import { google } from 'googleapis'

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = 'http://localhost:3000/oauth2callback'

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Define GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no ambiente antes de correr este script.')
  console.error('Exemplo: GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/get-refresh-token.mjs')
  process.exit(1)
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/calendar'],
})

console.log('\nAbre este link no browser e autoriza com a conta Google da tua agenda:\n')
console.log(authUrl, '\n')

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/oauth2callback')) {
    res.end('ok')
    return
  }

  const url = new URL(req.url, REDIRECT_URI)
  const code = url.searchParams.get('code')

  if (!code) {
    res.end('Faltou o código de autorização.')
    return
  }

  try {
    const { tokens } = await oauth2Client.getToken(code)
    res.end('Autorizado! Podes fechar esta aba e voltar ao terminal.')
    console.log('\nGuarda este valor como variável de ambiente GOOGLE_REFRESH_TOKEN na Vercel:\n')
    console.log(tokens.refresh_token, '\n')
  } catch (err) {
    console.error(err)
    res.end('Erro ao trocar o código pelo token.')
  } finally {
    server.close()
  }
})

server.listen(3000, () => {
  console.log('À espera da autorização em http://localhost:3000 ...')
})
