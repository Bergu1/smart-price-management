from rest_framework import serializers
from core.models import Product

class ProductSerializer(serializers.ModelSerializer):
    product_image_url = serializers.SerializerMethodField()
    product_image = serializers.ImageField(required=False, allow_null=True)  # 👈 dodaj to
    distance = serializers.IntegerField(required=False, default=0)           # 👈 jak wcześniej

    class Meta:
        model = Product
        fields = '__all__'

    def get_product_image_url(self, obj):
        request = self.context.get('request')
        if obj.product_image and request:
            return request.build_absolute_uri(obj.product_image.url)
        return None

