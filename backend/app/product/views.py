from rest_framework import viewsets
from core.models import Product
from .serializers import ProductSerializer
import requests

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        self.send_to_esp(instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        self.send_to_esp(instance)

    def send_to_esp(self, product):
        if product.id != 1:
            return  # tylko produkt o ID 1 ma być wysyłany

        data = {
            "name": product.name_product,
            "quantity": product.quantity_available,
            "expiry": str(product.expiry_date),
            "price": float(product.price)
        }

        try:
            requests.post("http://192.168.212.15/update", json=data, timeout=2)
        except Exception as e:
            print("Błąd wysyłania danych do ESP:", e)
