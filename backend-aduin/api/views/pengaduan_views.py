from django.http import JsonResponse

from api.decorators import api_view
from api.models import Pengaduan, Role, User
from api.utils.pengaduan_statistik import get_pengaduan_statistik_counts
from api.utils.report_formatter import map_pengaduan_to_admin, map_pengaduan_to_public
from api.utils.save_base64_image import delete_stored_file, save_base64_to_file


def _admin_queryset():
    return Pengaduan.objects.select_related('user').order_by('-created_at')


@api_view(['GET'])
def get_statistik_pengaduan(request):
    try:
        counts = get_pengaduan_statistik_counts()
        return JsonResponse(counts, status=200)
    except Exception as exc:
        print(f'getStatistikPengaduan: {exc}')
        return JsonResponse(
            {'message': 'Gagal mengambil statistik pengaduan'},
            status=500,
        )


@api_view(['GET', 'POST'])
def pengaduan_list(request):
    if request.method == 'GET':
        return _get_all_pengaduan(request)
    return _create_pengaduan(request)


def _get_all_pengaduan(request):
    try:
        data = [map_pengaduan_to_admin(item) for item in _admin_queryset()]
        return JsonResponse(data, safe=False, status=200)
    except Exception as exc:
        print(f'Error di getAllPengaduan: {exc}')
        return JsonResponse(
            {'message': 'Gagal mengambil data laporan'},
            status=500,
        )


def _create_pengaduan(request):
    try:
        body = request.json_body
        user_id = body.get('userId')
        pelapor_username = body.get('pelapor_username')
        pelapor_nama = body.get('pelapor_nama')
        judul = body.get('judul')
        deskripsi = body.get('deskripsi')
        kategori = body.get('kategori')
        alamat = body.get('alamat')
        foto = body.get('foto')

        user_db = None
        if user_id:
            user_db = User.objects.filter(id=user_id).first()
        elif pelapor_username:
            user_db = User.objects.filter(
                username=str(pelapor_username).strip(),
            ).first()

        if not user_db:
            return JsonResponse(
                {
                    'message': 'Akun tidak ditemukan. Silakan login terlebih dahulu.',
                },
                status=401,
            )

        if user_db.role != Role.MASYARAKAT:
            return JsonResponse(
                {'message': 'Hanya warga yang dapat mengirim laporan'},
                status=403,
            )

        if not judul or not deskripsi or not kategori or not alamat:
            return JsonResponse(
                {'message': 'Data laporan belum lengkap'},
                status=400,
            )

        if pelapor_nama and user_db.nama != pelapor_nama:
            user_db.nama = str(pelapor_nama).strip()
            user_db.save(update_fields=['nama', 'updated_at'])

        laporan = Pengaduan.objects.create(
            judul=judul,
            deskripsi=deskripsi,
            kategori=kategori,
            alamat=alamat,
            foto=save_base64_to_file(foto),
            status='Belum diterima',
            user=user_db,
        )
        laporan = Pengaduan.objects.select_related('user').get(pk=laporan.pk)

        return JsonResponse(
            {
                'message': 'Laporan berhasil dikirim',
                'data': map_pengaduan_to_public(laporan),
            },
            status=201,
        )
    except Exception as exc:
        print(f'Gagal membuat laporan: {exc}')
        return JsonResponse(
            {'message': 'Terjadi kesalahan saat mengirim laporan'},
            status=500,
        )


@api_view(['PUT', 'DELETE'])
def pengaduan_detail(request, id):
    if request.method == 'PUT':
        return _update_pengaduan(request, id)
    return _delete_pengaduan(request, id)


def _update_pengaduan(request, id):
    try:
        body = request.json_body
        pengaduan = Pengaduan.objects.select_related('user').filter(id=id).first()
        if not pengaduan:
            return JsonResponse({'message': 'Laporan tidak ditemukan'}, status=404)

        for field, attr in (
            ('status', 'status'),
            ('kategori', 'kategori'),
            ('catatan', 'catatan'),
        ):
            if field in body:
                setattr(pengaduan, attr, body[field])
        pengaduan.save()

        return JsonResponse(
            {
                'message': 'Laporan berhasil diupdate',
                'data': map_pengaduan_to_admin(pengaduan),
            },
            status=200,
        )
    except Exception as exc:
        print(f'Error di updatePengaduan: {exc}')
        return JsonResponse(
            {'message': 'Gagal mengupdate laporan'},
            status=500,
        )


def _delete_pengaduan(request, id):
    try:
        body = request.json_body
        user_id = body.get('userId')

        if user_id:
            return _delete_my_pengaduan(request, id, user_id)

        pengaduan = Pengaduan.objects.filter(id=id).first()
        if not pengaduan:
            return JsonResponse({'message': 'Laporan tidak ditemukan'}, status=404)

        if pengaduan.foto:
            delete_stored_file(pengaduan.foto)
        pengaduan.delete()
        return JsonResponse(
            {'message': 'Laporan berhasil dihapus permanen'},
            status=200,
        )
    except Exception as exc:
        print(f'Error di deletePengaduan: {exc}')
        return JsonResponse(
            {'message': 'Gagal menghapus laporan'},
            status=500,
        )


def _delete_my_pengaduan(request, id, user_id):
    try:
        laporan = Pengaduan.objects.filter(id=id).first()
        if not laporan:
            return JsonResponse({'message': 'Laporan tidak ditemukan'}, status=404)

        if str(laporan.user_id) != str(user_id):
            return JsonResponse(
                {'message': 'Tidak boleh menghapus laporan orang lain'},
                status=403,
            )

        if laporan.foto:
            delete_stored_file(laporan.foto)
        laporan.delete()
        return JsonResponse({'message': 'Laporan berhasil dihapus'}, status=200)
    except Exception as exc:
        print(f'Error di deleteMyPengaduan: {exc}')
        return JsonResponse({'message': 'Gagal menghapus laporan'}, status=500)


@api_view(['GET'])
def get_my_pengaduan(request, user_id):
    try:
        if not user_id:
            return JsonResponse({'message': 'userId wajib diisi'}, status=400)

        if not User.objects.filter(id=user_id).exists():
            return JsonResponse({'message': 'User tidak ditemukan'}, status=404)

        data = Pengaduan.objects.filter(user_id=user_id).select_related('user').order_by(
            '-created_at'
        )
        return JsonResponse(
            [map_pengaduan_to_public(item) for item in data],
            safe=False,
            status=200,
        )
    except Exception as exc:
        print(f'Error di getMyPengaduan: {exc}')
        return JsonResponse(
            {'message': 'Gagal mengambil riwayat laporan'},
            status=500,
        )
