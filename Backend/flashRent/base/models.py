from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField
from address.models import AddressField
from PIL import Image
from django.utils import timezone
from django.core.exceptions import ValidationError
from decimal import Decimal

# Create your models here.
class User(AbstractUser):
    USER_ROLES = [
        ("Tenant", "Tenant"),
        ("Property Manager", "Property Manager"),
    ]

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    phone_number = PhoneNumberField(blank=True, region="KE")
    role = models.CharField(max_length=20, choices=USER_ROLES, default="Tenant")
    first_time_login = models.BooleanField(default=True)

    def __str__(self):
        return self.username

class PropertyType(models.Model):
    property_type = models.CharField(max_length=255, null=False, unique=True)

    def __str__(self):
        return self.property_type
    
class Property(models.Model):
    PROPERTY_STATUS = [
        ("Available", "Available"),
        ("Occupied", "Occupied"),
        ("Under Renovation", "Under Renovation"),
    ]
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
                    
    def __str__(self):
        return self.name

class Tenant(models.Model):
    LEASE_STATUS_CHOICES = [
        ("Active", "Active"),
        ("Expired", "Expired"),
        ("Cancelled", "Cancelled"),
    ]
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tenants")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, verbose_name="Property Leased", related_name="properties_leased")
    lease_start = models.DateTimeField()
    lease_end = models.DateTimeField()
    lease_status = models.CharField(max_length=20, choices=LEASE_STATUS_CHOICES, default="Active")
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    class Meta:
        ordering = ['tenant']

    def save(self, *args, **kwargs):
        if self.tenant.role != "Tenant":
            raise ValidationError("The user must have the role of 'Tenant' to be associated as a tenant.")
        
        super().save(*args, **kwargs)
        
        if self.profile_picture:
            img = Image.open(self.profile_picture.path)
            if img.height > 300 or img.width > 300:
                output_size = (300, 300)
                img.thumbnail(output_size)
                img.save(self.profile_picture.path)

    def __str__(self):
        return f"{self.tenant.first_name} {self.tenant.last_name}"

    def update_lease_status(self):
        if self.lease_end < timezone.now():
            self.lease_status = "Expired"
        elif self.lease_status != "Cancelled":
            self.lease_status = "Active"
        self.save()

class RentalApplication(models.Model):
    APPLICATION_STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
    ]

    applicant = models.ForeignKey(Tenant, null=True, blank=True, on_delete=models.SET_NULL)
    guest_first_name = models.CharField(max_length=255, blank=True, null=True)
    guest_last_name = models.CharField(max_length=255, blank=True, null=True )
    guest_email = models.EmailField(blank=True, null=True)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    personal_details = models.JSONField()
    business_details = models.JSONField()
    declaration = models.JSONField()
    status = models.CharField(max_length=20, choices=APPLICATION_STATUS_CHOICES, default="Pending")
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        applicant_info = self.applicant.username if self.applicant else f"Guest {self.guest_email}"
        return f"Application for {self.property.name} by {applicant_info}"

class MaintenanceRequest(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("In Progress", "In Progress"),
        ("Completed", "Completed"),
    ]

    property = models.ForeignKey('Property', on_delete=models.CASCADE)
    issue = models.CharField(max_length=255)
    description = models.TextField()
    image1 = models.ImageField(upload_to='maintenance_requests/', blank=True, null=True)
    image2 = models.ImageField(upload_to='maintenance_requests/', blank=True, null=True)
    reported_date = models.DateTimeField(auto_now_add=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    schedule_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        for field_name in ['image1', 'image2',]:
            image = getattr(self, field_name)
            if image:
                img = Image.open(image.path)
                if img.height > 300 or img.width > 300:
                    output_size = (300, 300)
                    img.thumbnail(output_size)
                    img.save(image.path)
    class Meta:
        ordering = ['status', 'schedule_date']

    def __str__(self):
        return f"Request by {self.tenant} for {self.property} - {self.status}"

class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Completed", "Completed"),
        ("Failed", "Failed"),
    ]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="payments")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default="Pending")
    payment_date = models.DateTimeField(default=timezone.now)
    confirmation_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-payment_date']

    def __str__(self):
        return f"Payment of {self.amount} by {self.tenant} for {self.property}"

    def save(self, *args, **kwargs):
        if self.amount <= Decimal('0.00'):
            raise ValidationError("The payment amount must be greater than zero.")
        super().save(*args, **kwargs)

    def confirm_payment(self, transaction_id, status):
        self.transaction_id = transaction_id
        self.status = status
        if status == "Completed":
            self.confirmation_date = timezone.now()
        self.save()

class Document(models.Model):
    name = models.CharField(max_length=100)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='documents')
    publication_date = models.DateField()
    file = models.FileField(upload_to='documents/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.tenant}"

 







    

