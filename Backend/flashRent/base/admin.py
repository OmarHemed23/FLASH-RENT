from django.contrib import admin
from .models import User, PropertyType, Property, Tenant, RentalApplication, MaintenanceRequest, Document
from . import emails
from django.utils.crypto import get_random_string
from django.utils.timezone import now
from datetime import timedelta


@admin.action(description='Accept selected applications')
def accept_applications(modeladmin, request, queryset):
    for application in queryset:
        if application.status != 'Pending':
            continue

        user = application.applicant
        lease_start = now()
        lease_end = lease_start + timedelta(days=365) 

        if user:
            # Existing tenant
            Tenant.objects.create(
                tenant=user,
                property=application.property,
                lease_start=lease_start,
                lease_end=lease_end,
            )
            emails.send_application_accepted_email(user.email, application.property.name)
        else:
            # New guest
            username = f"{application.guest_first_name.lower()}{application.guest_last_name.lower()}{application.id}"
            password = get_random_string(8)
            new_user = User.objects.create_user(
                username=username,
                email=application.guest_email,
                first_name=application.guest_first_name,
                last_name=application.guest_last_name,
                password=password,
                role="Tenant"
            )
            Tenant.objects.create(
                tenant=new_user,
                property=application.property,
                lease_start=lease_start,
                lease_end=lease_end,
            )
            emails.send_application_accepted_email(new_user.email, application.property.name, username, password)

        application.status = 'Accepted'
        application.save()

@admin.action(description='Decline selected applications')
def decline_applications(modeladmin, request, queryset):
    for application in queryset:
        if application.status == 'Pending':
            emails.send_application_rejected_email(application.guest_email)
            application.delete()

class RentalApplicationAdmin(admin.ModelAdmin):
    list_display = ['id', 'guest_first_name', 'guest_last_name', 'guest_email', 'property', 'status']
    list_filter = ['status']
    actions = [accept_applications, decline_applications]

@admin.action(description='Schedule selected maintenance requests')
def schedule_maintenance_requests(modeladmin, request, queryset):
    for maintenance_request in queryset:
        if maintenance_request.status == 'Pending':
            maintenance_request.status = 'In Progress'
            maintenance_request.schedule_date = now() + timedelta(days=1)
            maintenance_request.save()
            emails.send_schedule_email(maintenance_request)

@admin.action(description='Complete selected maintenance requests')
def complete_maintenance_requests(modeladmin, request, queryset):
    for maintenance_request in queryset:
        if maintenance_request.status == 'In Progress':
            maintenance_request.status = 'Completed'
            maintenance_request.completed_date = now()
            maintenance_request.save()
            emails.send_completion_email(maintenance_request)

class MaintenanceRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'property', 'issue', 'status', 'tenant', 'reported_date', 'completed_date', 'image1', 'image2']
    list_filter = ['status', 'property']
    actions = [schedule_maintenance_requests, complete_maintenance_requests]

class PropertyAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'property_type', 'address', 'rent_amount', 'image1', 'status']
    list_filter = ['name', 'property_type', 'status', 'rent_amount']
    readonly_fields = ['id']
    fieldsets = (
        (None, {
            'fields': ('id', 'name', 'property_type', 'address', 'description', 'rent_amount', 'image1', 'image2', 'image3', 'status')
        }),
    )
    # Optionally, add search fields to quickly find properties
    search_fields = ['name', 'address', 'rent_amount']
    ordering = ['name']

class DocumentAdmin(admin.ModelAdmin):
    list_display = ['name', 'tenant', 'publication_date', 'file', 'created_at']
    search_fields = ['name', 'tenant__user__username']
    list_filter = ['publication_date']
    readonly_fields = ['created_at']

# Register your models here.
admin.site.register(RentalApplication, RentalApplicationAdmin)
# admin.site.register(User)
admin.site.register(PropertyType)
admin.site.register(Property, PropertyAdmin)
admin.site.register(Tenant)
admin.site.register(Document, DocumentAdmin)
admin.site.register(MaintenanceRequest, MaintenanceRequestAdmin)


admin.site.site_header = "FLASH RENT"
admin.site.site_title = "FLASH RENT PROPERTY MANAGER PORTAL"
admin.site.index_title = "Welcome to Flash Rent Property Manager Portal"


