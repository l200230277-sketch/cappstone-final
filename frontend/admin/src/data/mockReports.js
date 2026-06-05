import { REPORT_CATEGORIES } from './categories.js'

const [infra, pelayanan, keamanan, lingkungan] = REPORT_CATEGORIES

const foto = (seed) =>
  `https://picsum.photos/seed/aduin-${seed}/400/400`

/** Beberapa laporan punya lebih dari satu gambar untuk uji ekspor link. */
const fotoUrlsFor = (id) => [foto(id), foto(`${id}-2`)]

/** Data awal — statistik dan daftar mengikuti konteks aplikasi */
export const initialReports = [
  {
    id: '1',
    tanggal: '2026-05-10',
    tanggalLabel: '10 Mei 2026',
    waktuLabel: '09:12 WIB',
    pelapor: 'Santo',
    usernamePelapor: 'santo_warga',
    alamat: 'Jl. Merdeka No. 11',
    judul: 'Kondisi jalan rt 01=5/rw 04 banyak lubang dan membahayakan pengendara',
    deskripsi:
      'Jalan berlubang di depan balai RT sehingga mengganggu akses warga dan rawan kecelakaan saat hujan. Mohon penanganan segera karena aku ingin jalannya tu baik dan benar dan juga agar enak untuk di.',
    status: 'Belum diterima',
    kategori: infra,
    fotoLabel: '[Preview]',
    fotoUrls: fotoUrlsFor('r1'),
  },
  {
    id: '2',
    tanggal: '2026-04-29',
    tanggalLabel: '29 April 2026',
    waktuLabel: '14:30 WIB',
    pelapor: 'Andi',
    usernamePelapor: 'andi_rt3',
    alamat: 'Jl. Merdeka No. 10',
    judul: 'Kondisi jalan rt 01/rw 04 banyak lubang dan membahayakan pengendara',
    deskripsi:
      'Jalan berlubang di depan balai RT sehingga mengganggu akses warga dan rawan kecelakaan saat hujan. Mohon penanganan segera.',
    status: 'Diterima',
    kategori: infra,
    fotoLabel: '[Preview]',
    fotoUrls: fotoUrlsFor('r2'),
  },
  {
    id: '3',
    tanggal: '2026-04-28',
    tanggalLabel: '28 April 2026',
    waktuLabel: '20:45 WIB',
    pelapor: 'Budi',
    usernamePelapor: 'budi_canden',
    alamat: 'Jl. Sudirman No. 5',
    judul: 'lampu PJU mati',
    deskripsi:
      'Lampu penerangan jalan umum di blok C tidak menyala sejak seminggu lalu.',
    status: 'Diproses',
    kategori: infra,
    fotoLabel: '[Preview]',
    fotoUrls: fotoUrlsFor('r3'),
  },
  {
    id: '4',
    tanggal: '2026-04-27',
    tanggalLabel: '27 April 2026',
    waktuLabel: '08:00 WIB',
    pelapor: 'Citra',
    usernamePelapor: 'citra_m',
    alamat: 'Jl. Diponegoro No. 3',
    judul: 'antrian layanan lambat',
    deskripsi:
      'Antrian di loket administrasi desa terlalu panjang dan tidak ada nomor antrian yang jelas.',
    status: 'Selesai',
    kategori: pelayanan,
    fotoLabel: '[Preview]',
    fotoUrls: fotoUrlsFor('r4'),
  },
  {
    id: '5',
    tanggal: '2026-04-26',
    tanggalLabel: '26 April 2026',
    waktuLabel: '16:22 WIB',
    pelapor: 'Dedi',
    usernamePelapor: 'dedi_pasar',
    alamat: 'Pasar Tradisional',
    judul: 'kebersihan pasar',
    deskripsi:
      'Sampah menumpuk di area belakang pasar tradisional dan berbau tidak sedap.',
    status: 'Ditolak',
    kategori: lingkungan,
    fotoLabel: '[Preview]',
    fotoUrls: fotoUrlsFor('r5'),
  },
  {
    id: '6',
    tanggal: '2026-04-25',
    tanggalLabel: '25 April 2026',
    waktuLabel: '11:05 WIB',
    pelapor: 'Eka',
    usernamePelapor: 'eka_25',
    alamat: 'Jl. Gajah Mada No. 8',
    judul: 'keributan malam hari',
    deskripsi:
      'Keributan dari warung hingga larut malam mengganggu warga sekitar.',
    status: 'Diterima',
    kategori: keamanan,
    fotoLabel: '[Preview]',
    fotoUrls: fotoUrlsFor('r6'),
  },
  {
    id: '7',
    tanggal: '2026-04-24',
    tanggalLabel: '24 April 2026',
    waktuLabel: '07:40 WIB',
    pelapor: 'Fajar',
    usernamePelapor: 'fajar_hijau',
    alamat: 'Jl. Pahlawan No. 12',
    judul: 'sumur bor ilegal',
    deskripsi:
      'Diduga ada pengeboran sumur tanpa izin yang mempengaruhi sumber air tetangga.',
    status: 'Diproses',
    kategori: lingkungan,
    fotoLabel: '[Preview]',
    fotoUrls: fotoUrlsFor('r7'),
  },
]
