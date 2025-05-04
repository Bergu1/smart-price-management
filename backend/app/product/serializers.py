from rest_framework import serializers
from core.models import Product

class ProductSerializer(serializers.ModelSerializer):
    product_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'  # albo ['id', 'name_product', ... , 'product_image_url']

    def get_product_image_url(self, obj):
        request = self.context.get('request')
        if obj.product_image and request:
            return request.build_absolute_uri(obj.product_image.url)
        return None