const BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

/** Label tanggal & jam untuk tanggal update status (WIB, jam lokal browser). */
export function labelTanggalUpdateSekarang() {
  const d = new Date()
  const tgl = `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`
  const jam = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} WIB`
  return {
    tanggalUpdate: d.toISOString().slice(0, 10),
    tanggalUpdateLabel: `${tgl} • ${jam}`,
  }
}
