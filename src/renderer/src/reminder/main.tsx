import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReminderApp } from './ReminderApp'
import '../styles/reminder.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReminderApp />
  </StrictMode>,
)
