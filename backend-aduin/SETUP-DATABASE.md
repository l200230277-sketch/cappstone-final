# Setup Database ADUIN (Django + Supabase)

Backend ini memakai **Django** dengan database **PostgreSQL di Supabase**. API tetap di prefix `/api` dan port default **8001** agar frontend tidak perlu diubah.

## 1. Buat proyek Supabase

1. Buka [https://supabase.com](https://supabase.com) dan buat proyek baru.
2. Buka **Project Settings → Database**.
3. Salin **Connection string → URI** (mode **Transaction** / pooler port `6543` disarankan).

## 2. File `.env`

Salin `.env.example` menjadi `.env` di folder `backend-aduin`:

```env
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
PORT=8001
API_PUBLIC_URL=http://127.0.0.1:8001
DJANGO_DEBUG=true
DJANGO_SECRET_KEY=string-rahasia-anda
```

Ganti `[PROJECT-REF]`, `[PASSWORD]`, dan `[REGION]` sesuai dashboard Supabase.

> Tanpa `DATABASE_URL`, Django memakai SQLite lokal (`db.sqlite3`) hanya untuk uji cepat di mesin development.

## 3. Instal dependensi & migrasi

```powershell
cd backend-aduin
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
py manage.py migrate
py manage.py ensure_admin
```

## 4. Jalankan server

```powershell
py runserver.py
```

atau:

```powershell
py manage.py runserver 127.0.0.1:8001
```

Backend siap di `http://127.0.0.1:8001`.

## Akun admin default

| Field    | Nilai           |
|----------|-----------------|
| Username | `admin`         |
| Password | `1234`          |
| Email    | `admin@gmail.com` |

## Gambar laporan

Gambar disimpan sebagai **file** di `backend-aduin/uploads/` (bukan base64 panjang di database).

- URL publik: `/api/files/nama-file.jpg`
- Variabel `API_PUBLIC_URL` dipakai agar URL gambar benar di frontend production.

## Frontend

Proxy Vite sudah mengarah ke port `8001`. Jalankan seperti biasa:

```powershell
cd frontend/public
npm run dev
```

```powershell
cd frontend/admin
npm run dev
```
