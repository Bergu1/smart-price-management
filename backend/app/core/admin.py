from django.contrib import admin

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from core import models
from django.utils.translation import gettext_lazy as _

class UserAdmin(BaseUserAdmin):
  ordering = ['id']
  list_display = ['email', 'name', 'is_employee']
  fieldsets = (
    (None, {'fields': ('email', 'password')}),
    (_('Status'), {'fields': ('is_employee',)}),
    (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser')})
  )

  readonly_fields = ['last_login']
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
