from rest_framework import serializers
from base import models
from address.models import Address, Country, State, Locality, Address

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = models.User
        fields = ['username', 'email', 'password', 'role']

class PropertyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PropertyType
        fields = '__all__'

class PropertySerializer(serializers.ModelSerializer):
    image1_url = serializers.SerializerMethodField()
    image2_url = serializers.SerializerMethodField()
    image3_url = serializers.SerializerMethodField()

    class Meta:
        model = models.Property
        fields = ['id', 'name', 'property_type', 'address', 'rent_amount', 'description', 'status', 
                  'image1_url', 'image2_url', 'image3_url']

    def get_image1_url(self, obj):
        request = self.context.get('request')
        if obj.image1:
            return request.build_absolute_uri(obj.image1.url)
        return None

    def get_image2_url(self, obj):
        request = self.context.get('request')
        if obj.image2:
            return request.build_absolute_uri(obj.image2.url)
        return None

    def get_image3_url(self, obj):
        request = self.context.get('request')
        if obj.image3:
            return request.build_absolute_uri(obj.image3.url)
        return None

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = '__all__'

class LocalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Locality
        fields = '__all__'

class RentalApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RentalApplication
        fields = '__all__'

class TenantSerializer(serializers.ModelSerializer):
    tenant_name = serializers.SerializerMethodField()
    first_name = serializers.CharField(source='tenant.first_name', required=False)
    last_name = serializers.CharField(source='tenant.last_name', required=False)
    username = serializers.CharField(source='tenant.username', required=False)
    email = serializers.EmailField(source='tenant.email', required=False)
    phone_number = serializers.CharField(source='tenant.phone_number', required=False)
    property_name = serializers.CharField(source='property.name', read_only=True)

    class Meta:
        model = models.Tenant
        fields = ['id', 'tenant_name', 'first_name', 'last_name', 'username', 'phone_number',
                  'property_name', 'email', 'lease_start', 'lease_end', 'lease_status', 'profile_picture']

    def get_tenant_name(self, obj):
        return f"{obj.tenant.first_name} {obj.tenant.last_name}"
    
    def update(self, instance, validated_data):
        tenant_data = validated_data.pop('tenant', {})
        tenant = instance.tenant

        for attr, value in tenant_data.items():
            if value is not None:
                setattr(tenant, attr, value)
        
        tenant.save()
        for attr, value in validated_data.items():
            if value is not None:
                setattr(instance, attr, value)
        
        instance.save()
        return instance

class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError({"current_password": "Current password is not correct."})
        return value

class TenantPropertiesSerializer(serializers.ModelSerializer):
    property_name = serializers.CharField(source='property.name')
    property_rentAmount = serializers.CharField(source='property.rent_amount')
    property_type = serializers.CharField(source='property.property_type')
    property_address = serializers.CharField(source='property.address')
    property_description = serializers.CharField(source='property.description')
    property_status = serializers.CharField(source='property.status')
    property_image_url = serializers.SerializerMethodField()

    class Meta:
        model = models.Tenant
        fields = ['property_id', 'property_name', 'property_rentAmount', 'property_type', 'property_address', 'property_description', 'property_status',
                    'property_image_url']
    
    def get_property_image_url(self, obj):
        request = self.context.get('request')
        if obj.property.image1 and request:
            return request.build_absolute_uri(obj.property.image1.url)
        return None
class MaintenanceRequestSerializer(serializers.ModelSerializer):
    image1_url = serializers.SerializerMethodField()
    image2_url = serializers.SerializerMethodField()

    class Meta:
        model = models.MaintenanceRequest
        fields = ['id', 'issue', 'description', 'reported_date', 'status', 'completed_date', 'schedule_date', 'image1', 'image2', 'image1_url', 'image2_url']

    def get_image1_url(self, obj):
        request = self.context.get('request')
        if obj.image1 and request:
            return request.build_absolute_uri(obj.image1.url)
        return None

    def get_image2_url(self, obj):
        request = self.context.get('request')
        if obj.image2 and request:
            return request.build_absolute_uri(obj.image2.url)
        return None
    
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Document
        fields = ['id', 'name', 'tenant', 'publication_date', 'file', 'created_at']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Payment
        fields = '__all__'


