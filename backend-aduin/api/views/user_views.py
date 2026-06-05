from django.db import transaction
from django.http import JsonResponse

from api.decorators import api_view
from api.models import Role, User
from api.services.admin_bootstrap import sanitize_user


@api_view(['GET'])
def get_all_users(request):
    try:
        users = (
            User.objects.filter(role=Role.MASYARAKAT)
            .order_by('-created_at')
            .values('id', 'nama', 'username', 'email', 'telepon', 'created_at')
        )
        payload = [
            {
                'id': str(u['id']),
                'nama': u['nama'],
                'username': u['username'],
                'email': u['email'],
                'telepon': u['telepon'],
                'createdAt': u['created_at'].isoformat(),
            }
            for u in users
        ]
        return JsonResponse(payload, safe=False, status=200)
    except Exception as exc:
        print(f'Error di getAllUsers: {exc}')
        return JsonResponse(
            {'message': 'Terjadi kesalahan saat mengambil data user'},
            status=500,
        )


@api_view(['DELETE', 'PATCH'])
def user_detail(request, id):
    if request.method == 'DELETE':
        return _delete_user(request, id)
    return _update_profile(request, id)


def _delete_user(request, id):
    try:
        with transaction.atomic():
            user = User.objects.filter(id=id).first()
            if not user:
                return JsonResponse({'message': 'User tidak ditemukan'}, status=404)
            user.delete()

        return JsonResponse(
            {'message': 'User dan seluruh laporannya berhasil dihapus tanpa sisa'},
            status=200,
        )
    except Exception as exc:
        print(f'Error di deleteUser: {exc}')
        return JsonResponse(
            {'message': 'Terjadi kesalahan saat menghapus user'},
            status=500,
        )


def _update_profile(request, id):
    try:
        body = request.json_body
        user = User.objects.filter(id=id).first()
        if not user:
            return JsonResponse({'message': 'User tidak ditemukan'}, status=404)

        if 'telepon' in body:
            user.telepon = str(body['telepon'])
        if 'nama' in body:
            user.nama = str(body['nama']).strip()
        user.save()

        alamat = body.get('alamat', '')

        return JsonResponse(
            {
                'message': 'Profil berhasil diperbarui',
                'user': sanitize_user(user),
                'address': alamat if alamat is not None else '',
            },
            status=200,
        )
    except Exception as exc:
        print(f'Error di updateProfile: {exc}')
        return JsonResponse({'message': 'Gagal memperbarui profil'}, status=500)
