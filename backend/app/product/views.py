from rest_framework import viewsets
from core.models import Product
from .serializers import ProductSerializer
import requests
import time
from rest_framework.parsers import MultiPartParser, FormParser

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser, FormParser] 

    def get_serializer_context(self):
        return {'request': self.request}
    
    
    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        print("DEBUG - request.data:", request.data)
        return super().update(request, *args, **kwargs)


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
            "country" : product.product_country,
            "price": float(product.price)
        }

        url = f"http://192.168.147.15/update{product.id}"

        try:
            requests.post(url, json=data, timeout=5)  # Zwiększony timeout
            time.sleep(2)  # DODAJ TO: daje czas ESP na przetworzenie
        except Exception as e:
            print("Błąd wysyłania danych do ESP:", e)
