from api.models import Pengaduan

STATUS_SELESAI = 'Selesai'
STATUS_DIPROSES = 'Diproses'


def get_pengaduan_statistik_counts():
    total = Pengaduan.objects.count()
    selesai = Pengaduan.objects.filter(status=STATUS_SELESAI).count()
    dalam_proses = Pengaduan.objects.filter(status=STATUS_DIPROSES).count()
    return {'total': total, 'selesai': selesai, 'dalamProses': dalam_proses}
