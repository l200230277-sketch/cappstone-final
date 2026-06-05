from django.urls import path

from api.views import auth_views, pengaduan_views, user_views

urlpatterns = [
    path('auth/register', auth_views.register),
    path('auth/login', auth_views.login),
    path('pengaduan/statistik', pengaduan_views.get_statistik_pengaduan),
    path('pengaduan/user/<uuid:user_id>', pengaduan_views.get_my_pengaduan),
    path('pengaduan/<uuid:id>', pengaduan_views.pengaduan_detail),
    path('pengaduan', pengaduan_views.pengaduan_list),
    path('users/<uuid:id>', user_views.user_detail),
    path('users', user_views.get_all_users),
]
