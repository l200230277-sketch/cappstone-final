from api.models import Role, User

ADMIN_DEFAULT = {
    'username': 'admin',
    'password': '1234',
    'email': 'admin@gmail.com',
    'nama': 'Admin',
    'role': Role.ADMIN,
}


def ensure_admin_user():
    existing = User.objects.filter(username=ADMIN_DEFAULT['username']).first()
    if existing:
        return existing
    return User.objects.create(**ADMIN_DEFAULT)


def sanitize_user(user):
    return {
        'id': str(user.id),
        'username': user.username,
        'nama': user.nama,
        'email': user.email,
        'telepon': user.telepon or '',
        'role': user.role,
    }
