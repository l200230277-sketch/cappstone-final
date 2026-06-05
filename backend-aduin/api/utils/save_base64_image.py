import base64
import re
import uuid
from pathlib import Path

from django.conf import settings

UPLOAD_DIR = settings.UPLOAD_DIR


def ensure_upload_dir():
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def save_base64_to_file(input_value):
    if not input_value or not isinstance(input_value, str):
        return None

    trimmed = input_value.strip()
    if not trimmed:
        return None

    if trimmed.startswith('/api/files/'):
        return trimmed

    if trimmed.startswith('http://') or trimmed.startswith('https://'):
        return trimmed

    base64_data = trimmed
    ext = 'jpg'

    data_match = re.match(r'^data:image/(\w+);base64,(.+)$', trimmed)
    if data_match:
        ext = 'png' if data_match.group(1) == 'png' else 'jpg'
        base64_data = data_match.group(2)

    try:
        ensure_upload_dir()
        buffer = base64.b64decode(base64_data)
        if not buffer:
            return None

        filename = f'report-{uuid.uuid4()}.{ext}'
        file_path = UPLOAD_DIR / filename
        file_path.write_bytes(buffer)
        return f'/api/files/{filename}'
    except Exception as exc:
        print(f'Gagal menyimpan gambar: {exc}')
        return None


def delete_stored_file(foto_path):
    if not foto_path or not isinstance(foto_path, str):
        return
    match = re.search(r'/api/files/([^/?#]+)', foto_path)
    if not match:
        return
    file_path = UPLOAD_DIR / match.group(1)
    try:
        if file_path.is_file():
            file_path.unlink()
    except Exception as exc:
        print(f'Gagal menghapus file gambar: {exc}')
