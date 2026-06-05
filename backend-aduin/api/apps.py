from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        import sys

        if 'runserver' not in sys.argv and 'runserver.py' not in sys.argv[0]:
            return

        from api.services.admin_bootstrap import ensure_admin_user

        try:
            ensure_admin_user()
        except Exception as exc:
            print(f'Gagal menyiapkan akun admin: {exc}')
