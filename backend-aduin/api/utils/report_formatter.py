from django.utils import timezone

from api.utils.image_src import foto_to_urls, normalize_foto

BULAN = [
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


def _local_dt(date_input):
    if timezone.is_naive(date_input):
        date_input = timezone.make_aware(
            date_input,
            timezone.get_current_timezone(),
        )
    return timezone.localtime(date_input)


def pad2(n):
    return str(n).zfill(2)


def format_tanggal_waktu(date_input):
    d = _local_dt(date_input)
    tanggal = d.date().isoformat()
    tanggal_label = f'{d.day} {BULAN[d.month - 1]} {d.year}'
    waktu_label = f'{pad2(d.hour)}:{pad2(d.minute)} WIB'
    return {'tanggal': tanggal, 'tanggalLabel': tanggal_label, 'waktuLabel': waktu_label}


def format_tanggal_update(date_input):
    parts = format_tanggal_waktu(date_input)
    return {
        'tanggalUpdate': _local_dt(date_input).date().isoformat(),
        'tanggalUpdateLabel': f"{parts['tanggalLabel']} • {parts['waktuLabel']}",
    }


def map_pengaduan_to_admin(item):
    parts = format_tanggal_waktu(item.created_at)
    created = item.created_at.timestamp()
    updated = item.updated_at.timestamp()
    update_fields = (
        format_tanggal_update(item.updated_at) if updated - created > 1 else {}
    )

    pelapor = getattr(item, 'user', None)
    return {
        'id': str(item.id),
        'tanggal': parts['tanggal'],
        'tanggalLabel': parts['tanggalLabel'],
        'waktuLabel': parts['waktuLabel'],
        'pelapor': pelapor.nama if pelapor else 'Pengguna Anonim',
        'usernamePelapor': pelapor.username if pelapor else '',
        'alamat': item.alamat,
        'judul': item.judul,
        'deskripsi': item.deskripsi,
        'status': item.status,
        'kategori': item.kategori,
        'catatan': item.catatan,
        'foto': normalize_foto(item.foto),
        'fotoUrls': foto_to_urls(item.foto),
        'fotoLabel': '[Preview]' if item.foto else '-',
        **update_fields,
    }


def map_pengaduan_to_public(item):
    parts = format_tanggal_waktu(item.created_at)
    pelapor = getattr(item, 'user', None)
    return {
        'id': str(item.id),
        'user': pelapor.username if pelapor else '',
        'title': item.judul,
        'place': item.alamat,
        'description': item.deskripsi,
        'category': item.kategori,
        'date': f"{parts['tanggalLabel']} • {parts['waktuLabel']}",
        'status': item.status,
        'image': normalize_foto(item.foto) or '',
        'note': item.catatan or '',
    }
