import { useEffect, useMemo, useState } from 'react'

const STYLES = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  .agendar {
    min-height: 100vh;
    background: #0b0b0d;
    color: #f2f2f2;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    display: flex;
    justify-content: center;
    padding: 48px 20px;
  }
  .agendar__card {
    width: 100%;
    max-width: 640px;
  }
  .agendar__title {
    font-size: 28px;
    font-weight: 600;
    margin: 0 0 8px;
  }
  .agendar__subtitle {
    color: #a3a3a3;
    margin: 0 0 32px;
    font-size: 15px;
  }
  .agendar__day-list {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 8px;
    margin-bottom: 20px;
  }
  .agendar__day {
    flex: 0 0 auto;
    padding: 10px 16px;
    border-radius: 10px;
    border: 1px solid #2a2a2e;
    background: #151517;
    color: #f2f2f2;
    cursor: pointer;
    font-size: 14px;
    text-transform: capitalize;
  }
  .agendar__day--active {
    background: #f2f2f2;
    color: #0b0b0d;
    border-color: #f2f2f2;
  }
  .agendar__slots {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 10px;
    margin-bottom: 32px;
  }
  .agendar__slot {
    padding: 10px 8px;
    border-radius: 8px;
    border: 1px solid #2a2a2e;
    background: #151517;
    color: #f2f2f2;
    cursor: pointer;
    font-size: 14px;
  }
  .agendar__slot--active {
    background: #f2f2f2;
    color: #0b0b0d;
    border-color: #f2f2f2;
  }
  .agendar__field {
    display: block;
    margin-bottom: 16px;
  }
  .agendar__label {
    display: block;
    font-size: 13px;
    color: #a3a3a3;
    margin-bottom: 6px;
  }
  .agendar__input, .agendar__textarea {
    width: 100%;
    padding: 12px 14px;
    border-radius: 8px;
    border: 1px solid #2a2a2e;
    background: #151517;
    color: #f2f2f2;
    font-size: 15px;
    font-family: inherit;
  }
  .agendar__textarea { min-height: 80px; resize: vertical; }
  .agendar__submit {
    width: 100%;
    padding: 14px;
    border-radius: 8px;
    border: none;
    background: #f2f2f2;
    color: #0b0b0d;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }
  .agendar__submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .agendar__error {
    color: #ff6b6b;
    font-size: 14px;
    margin-bottom: 16px;
  }
  .agendar__empty {
    color: #a3a3a3;
    font-size: 14px;
  }
  .agendar__confirm {
    text-align: center;
    padding: 32px 0;
  }
  .agendar__confirm a {
    color: #f2f2f2;
  }
`

function groupByDay(slots) {
  const groups = new Map()
  for (const slot of slots) {
    const day = new Date(slot.start)
    const key = day.toDateString()
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(slot)
  }
  return groups
}

export default function Agendar() {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [slots, setSlots] = useState([])
  const [timezone, setTimezone] = useState('')
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmation, setConfirmation] = useState(null)

  useEffect(() => {
    fetch('/api/availability')
      .then((r) => r.json())
      .then((data) => {
        if (!data.slots) throw new Error('resposta inválida')
        setSlots(data.slots)
        setTimezone(data.timezone)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  const groups = useMemo(() => groupByDay(slots), [slots])
  const days = useMemo(() => Array.from(groups.keys()), [groups])

  useEffect(() => {
    if (!selectedDay && days.length > 0) setSelectedDay(days[0])
  }, [days, selectedDay])

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')

    if (!selectedSlot) {
      setFormError('Escolhe um horário.')
      return
    }
    if (!name.trim() || !email.trim()) {
      setFormError('Preenche o teu nome e email.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start: selectedSlot.start, name, email, notes }),
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || 'Não foi possível agendar. Tenta outro horário.')
        setSubmitting(false)
        return
      }
      setConfirmation(data)
    } catch {
      setFormError('Falha de rede. Tenta novamente.')
      setSubmitting(false)
    }
  }

  if (confirmation) {
    return (
      <div className="agendar">
        <style>{STYLES}</style>
        <div className="agendar__card agendar__confirm">
          <h1 className="agendar__title">Reunião marcada ✅</h1>
          <p className="agendar__subtitle">
            {new Date(confirmation.start).toLocaleString('pt-PT', { dateStyle: 'full', timeStyle: 'short' })}
          </p>
          {confirmation.meetLink && (
            <p>
              Link do Google Meet: <a href={confirmation.meetLink}>{confirmation.meetLink}</a>
            </p>
          )}
          <p className="agendar__subtitle">Enviámos a confirmação para o teu email.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="agendar">
      <style>{STYLES}</style>
      <div className="agendar__card">
        <h1 className="agendar__title">Agendar reunião</h1>
        <p className="agendar__subtitle">
          Escolhe um horário disponível{timezone ? ` (fuso horário: ${timezone})` : ''}.
        </p>

        {status === 'loading' && <p className="agendar__empty">A carregar horários…</p>}
        {status === 'error' && <p className="agendar__error">Não foi possível carregar a disponibilidade. Tenta recarregar a página.</p>}

        {status === 'ready' && days.length === 0 && (
          <p className="agendar__empty">Sem horários disponíveis nos próximos dias.</p>
        )}

        {status === 'ready' && days.length > 0 && (
          <>
            <div className="agendar__day-list">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`agendar__day ${day === selectedDay ? 'agendar__day--active' : ''}`}
                  onClick={() => {
                    setSelectedDay(day)
                    setSelectedSlot(null)
                  }}
                >
                  {new Date(day).toLocaleDateString('pt-PT', { weekday: 'short', day: '2-digit', month: 'short' })}
                </button>
              ))}
            </div>

            <div className="agendar__slots">
              {(groups.get(selectedDay) || []).map((slot) => (
                <button
                  key={slot.start}
                  type="button"
                  className={`agendar__slot ${selectedSlot?.start === slot.start ? 'agendar__slot--active' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {new Date(slot.start).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <label className="agendar__field">
                <span className="agendar__label">Nome</span>
                <input className="agendar__input" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="agendar__field">
                <span className="agendar__label">Email</span>
                <input className="agendar__input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label className="agendar__field">
                <span className="agendar__label">Notas (opcional)</span>
                <textarea className="agendar__textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </label>

              {formError && <p className="agendar__error">{formError}</p>}

              <button className="agendar__submit" type="submit" disabled={submitting}>
                {submitting ? 'A agendar…' : 'Confirmar reunião'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
