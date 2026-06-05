from django.conf import settings


def normalize_foto(foto):
    if not foto or not isinstance(foto, str):
        return None
    s = foto.strip()
    if not s:
        return None

    if s.startswith('/api/files/'):
        return f'{settings.API_PUBLIC_URL}{s}'

    if s.startswith('data:') or s.startswith('http://') or s.startswith('https://'):
        return s

    return f'data:image/jpeg;base64,{s}'


def foto_to_urls(foto):
    src = normalize_foto(foto)
    return [src] if src else []


def foto_link_for_export(foto, max_len=32000):
    src = normalize_foto(foto)
    if not src:
        return ''
    if src.startswith('data:') and len(src) > max_len:
        return f'{settings.API_PUBLIC_URL}/api/files/… [lampiran — buka detail laporan]'
    return src
