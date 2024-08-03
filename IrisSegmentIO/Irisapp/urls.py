from django.urls import path
from . import views
from .views import upload_images

urlpatterns = [
    path('', views.index, name='index'),
    path('upload/', upload_images, name='upload_images'),
]
