from rest_framework import viewsets
from core.models import Product
from .serializers import ProductSerializer
import requests
import time 

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
        if product.id not in [1, 2]:
            return

        data = {
            "name": product.name_product,
            "quantity": product.quantity_available,
            "expiry": str(product.expiry_date),
            "price": float(product.price)
        }

        url = f"http://192.168.147.15/update{product.id}"

        try:
            requests.post(url, json=data, timeout=5)  # Zwiększony timeout
            time.sleep(2)  # DODAJ TO: daje czas ESP na przetworzenie
        except Exception as e:
            print("Błąd wysyłania danych do ESP:", e)
