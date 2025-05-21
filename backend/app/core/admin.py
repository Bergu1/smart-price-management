from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from core import models

# ---- Użytkownik ----
class UserAdmin(BaseUserAdmin):
    ordering = ['id']
    list_display = ['email', 'name', 'is_employee']
    readonly_fields = ['last_login']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Status'), {'fields': ('is_employee',)}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'password1',
                'password2',
                'name',
                'is_employee',
                'is_active',
                'is_staff',
                'is_superuser'
            )
        }),
    )

admin.site.register(models.User, UserAdmin)

# ---- Produkty ----
class ProductAdmin(admin.ModelAdmin): 
    fields = [
        'name_product',
        'product_country',
        'price',
        'distance',
        'product_description',
        'product_image',
    ]

    list_display = [
        'id',
        'name_product',
        'product_country',
        'price',
        'distance',
    ]

admin.site.register(models.Product, ProductAdmin)
