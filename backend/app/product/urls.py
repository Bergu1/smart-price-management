from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, update_distance  # dodaj ten import

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('update-distance/', update_distance),  # <-- DODAJ TO
]