from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField
from address.models import AddressField
from PIL import Image


# Create your models here.
class User (AbstractUser):
    USER_ROLES = {
        "Tenant": "Tenant",
        "Property Manager": "Property Manager",
    }

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    phone_number = PhoneNumberField(blank=True, region="KE")
    role = models.CharField(max_length=20, choices=USER_ROLES)

    def __str__(self):
        return self.username

class PropertyType (models.Model):
    property_type = models.CharField(max_length=255, null=False, unique=True)

    def __str__(self):
        return self.property_type
    
class Property (models.Model):
    PROPERTY_STATUS = {
        "Available": "Available",
        "Occupied": "Occupied",
        "Under Renovation": "Under Renovation",
    }
    name = models.CharField(max_length=255, unique=True)
    property_type = models.ForeignKey(PropertyType, on_delete=models.CASCADE)
    address = AddressField(on_delete=models.CASCADE)
    rent_amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(null=True, blank=True)
    image1 = models.ImageField(upload_to='images/', blank=True, null=True)
    image2 = models.ImageField(upload_to='images/', blank=True, null=True)
    image3 = models.ImageField(upload_to='images/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=PROPERTY_STATUS, default="Available")

    class Meta: 
        verbose_name_plural = "Properties"
        ordering = ['name']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        for field_name in ['image1', 'image2', 'image3']:
            image = getattr(self, field_name)
            if image:
                img = Image.open(image.path)
                if img.height > 300 or img.width > 300:
                    output_size = (300, 300)
                    img.thumbnail(output_size)
                    img.save(image.path)
                    
    def __str__ (self):
        return self.name

    

