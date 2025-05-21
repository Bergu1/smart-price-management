from rest_framework import viewsets
from core.models import Product
from .serializers import ProductSerializer
import requests
import time
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

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

        print("Proba laczenia")
        url = f"http://192.168.201.15/update{product.id}"
        print("polaczono")

        try:
            requests.post(url, json=data, timeout=10)  # Zwiększony timeout
            time.sleep(2)  # DODAJ TO: daje czas ESP na przetworzenie
        except Exception as e:
            print("Błąd wysyłania danych do ESP:", e)
        

@api_view(['POST'])
def update_distance(request):
    product_id = request.data.get('product_id')
    distance = request.data.get('distance')

    if product_id is None or distance is None:
        return Response({'error': 'Brakuje danych'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        product = Product.objects.get(id=product_id)
        product.distance = distance
        product.save()
        return Response({'message': 'Zaktualizowano odległość'}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({'error': 'Nie znaleziono produktu'}, status=status.HTTP_404_NOT_FOUND)
