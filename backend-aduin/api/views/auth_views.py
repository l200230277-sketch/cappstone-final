from django.http import JsonResponse

import re

from api.decorators import api_view
from api.models import Role, User
from api.services.admin_bootstrap import sanitize_user

GMAIL_COM_RE = re.compile(r'^[^\s@]+@gmail\.com$', re.IGNORECASE)


@api_view(['POST'])
def register(request):
    try:
        body = request.json_body
        username = str(body.get('username', '')).strip()
        email = str(body.get('email', '')).strip()
        password = body.get('password')
        nama = body.get('nama')

        if not username or not password or not email:
            return JsonResponse(
                {'message': 'Username, email, dan password wajib diisi'},
                status=400,
            )

        if len(str(password)) < 6:
            return JsonResponse(
                {'message': 'Password minimal 6 karakter'},
                status=400,
            )

        if not GMAIL_COM_RE.match(email):
            return JsonResponse(
                {
                    'message': 'Email harus berakhiran @gmail.com (contoh: nama@gmail.com)',
                },
                status=400,
            )

        if User.objects.filter(username=username).exists():
            return JsonResponse(
                {'message': 'Username sudah digunakan'},
                status=409,
            )
        if User.objects.filter(email=email).exists():
            return JsonResponse(
                {'message': 'Email sudah digunakan'},
                status=409,
            )

        user = User.objects.create(
            username=username,
            nama=(nama or username).strip() if nama else username,
            email=email,
            password=str(password),
            role=Role.MASYARAKAT,
        )

        return JsonResponse(
            {
                'message': 'Pendaftaran berhasil',
                'user': sanitize_user(user),
            },
            status=201,
        )
    except Exception as exc:
        print(f'Error di register: {exc}')
        return JsonResponse({'message': 'Gagal mendaftarkan akun'}, status=500)


@api_view(['POST'])
def login(request):
    try:
        body = request.json_body
        username = str(body.get('username', '')).strip()
        password = body.get('password')

        if not username or not password:
            return JsonResponse(
                {'message': 'Username dan password wajib diisi'},
                status=400,
            )

        user = User.objects.filter(username=username).first()
        if not user or user.password != str(password):
            return JsonResponse(
                {'message': 'Username atau password salah'},
                status=401,
            )

        return JsonResponse(
            {
                'message': 'Login berhasil',
                'user': sanitize_user(user),
            },
            status=200,
        )
    except Exception as exc:
        print(f'Error di login: {exc}')
        return JsonResponse({'message': 'Gagal login'}, status=500)
