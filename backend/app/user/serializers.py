from django.contrib.auth import (
  get_user_model,
  authenticate
)

from django.utils.translation import gettext as _

from rest_framework import serializers


from django.contrib.auth import (
  get_user_model,
  authenticate
)

from django.utils.translation import gettext as _
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
  verification_code = serializers.CharField(write_only=True, required=False)

  class Meta:
    model = get_user_model()
    fields = ['email', 'password', 'name', 'is_employee', 'verification_code']
    extra_kwargs = {'password': {'write_only': True, 'min_length': 5}}

  def create(self, validated_data):
    is_employee = validated_data.get('is_employee', False)
    code = validated_data.pop('verification_code', None)

    if is_employee:
      if code != "ABC123":  
        raise serializers.ValidationError({"verification_code": "Nieprawidłowy kod pracownika."})

    return get_user_model().objects.create_user(**validated_data)
  
  def update(self, instance, validated_data):
    password = validated_data.pop('password', None)
    user = super().update(instance, validated_data)

    if password:
      user.set_password(password)
      user.save()
    
    return user

  

class AuthTokenSerializer(serializers.Serializer):
    
    email = serializers.EmailField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False,
    )

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password,
        )
        if not user:
            msg = _('Unable to authenticate with provided credentials.')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs