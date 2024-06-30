from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, PropertyType, Property

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(PropertyType)
admin.site.register(Property)

