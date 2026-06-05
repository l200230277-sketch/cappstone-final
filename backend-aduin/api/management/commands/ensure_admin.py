from django.core.management.base import BaseCommand

from api.services.admin_bootstrap import ensure_admin_user


class Command(BaseCommand):
    help = 'Buat akun admin default jika belum ada'

    def handle(self, *args, **options):
        user = ensure_admin_user()
        self.stdout.write(self.style.SUCCESS(f'Admin siap: {user.username}'))
