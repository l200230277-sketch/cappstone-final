"""Jalankan Django development server di port yang sama dengan backend Express (8001)."""
import os

import django
from django.core.management import execute_from_command_line

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aduin.settings')

if __name__ == '__main__':
    django.setup()
    port = os.environ.get('PORT', '8001')
    execute_from_command_line(['manage.py', 'runserver', f'127.0.0.1:{port}', '--noreload'])
