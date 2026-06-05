import uuid

from django.db import models


class Role(models.TextChoices):
    MASYARAKAT = 'MASYARAKAT', 'Masyarakat'
    ADMIN = 'ADMIN', 'Admin'


class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, unique=True)
    nama = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    telepon = models.CharField(max_length=50, blank=True, null=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.MASYARAKAT,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'User'


class Pengaduan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    judul = models.CharField(max_length=500)
    deskripsi = models.TextField()
    kategori = models.CharField(max_length=100)
    alamat = models.CharField(max_length=500)
    foto = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=100, default='Belum diterima')
    catatan = models.TextField(blank=True, null=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='laporan',
        db_column='userId',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Pengaduan'
