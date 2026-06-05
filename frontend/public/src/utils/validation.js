/** Email wajib berakhiran @gmail.com (bukan hanya @gmail). */
const GMAIL_COM_REGEX = /^[^\s@]+@gmail\.com$/i

export function isValidGmailCom(email) {
  return GMAIL_COM_REGEX.test(String(email || '').trim())
}

export function normalizeGmailCom(email) {
  return String(email || '').trim().toLowerCase()
}
