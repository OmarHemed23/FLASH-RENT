from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from base.models import Property, PropertyType, Tenant, RentalApplication, MaintenanceRequest, Document
from base import serializers
from address.models import Address, Country, State, Locality
from base import emails
from django.utils import timezone
from django.http import HttpResponse
from django.views import View
from base import pdfs
from django.core.files.base import ContentFile
import io
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

class PropertyTypeView(APIView):
    def get(self, request):
        property_type = request.query_params.get('property_type', None)
        queryset = PropertyType.objects.all()
        
        if property_type:
            property_types = property_type.split(',')
            queryset = queryset.filter(property_type__in=property_types)
        
        serializer = serializers.PropertyTypeSerializer(queryset, many=True)
        return Response(serializer.data)

class PropertyTypeDetailView(APIView):
    def get(self, request, pk):
        try:
            property_type = PropertyType.objects.get(pk=pk)
            serializer = serializers.PropertyTypeSerializer(property_type)
            return Response(serializer.data)
        except PropertyType.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

class PropertyView(APIView):
    def get(self, request):
        search_query = request.query_params.get('search', '')
        property_type = request.query_params.get('property_type', '')
        min_rent = request.query_params.get('min_rent', None)
        max_rent = request.query_params.get('max_rent', None)
        queryset = Property.objects.all()

        if search_query:
            try:
                search_amount = float(search_query)
                queryset = queryset.filter(rent_amount=search_amount)
            except ValueError:
                queryset = queryset.filter(name__icontains=search_query)
    
        if property_type:
            property_types = property_type.split(',')
            queryset = queryset.filter(property_type__property_type__in=property_types)
        if min_rent is not None:
            queryset = queryset.filter(rent_amount__gte=min_rent)
        if max_rent is not None:
            queryset = queryset.filter(rent_amount__lte=max_rent)

        serializer = serializers.PropertySerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)
    
class PropertyDetailView(APIView):
    def get(self, request, name):
        try:
            property = Property.objects.get(name)
            serializer = serializers.PropertySerializer(property)
            return Response(serializer.data)
        except Property.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = serializers.AddressSerializer

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = serializers.CountrySerializer

class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all()
    serializer_class = serializers.StateSerializer

class LocalityViewSet(viewsets.ModelViewSet):
    queryset = Locality.objects.all()
    serializer_class = serializers.LocalitySerializer
    
class RentalApplicationView(APIView):
    def post(self, request, format=None):
        data = request.data
        applicant = None
    
        if 'applicant_id' in data:
            try:
                applicant = Tenant.objects.get(id=data['applicant_id'])
            except Tenant.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            property_instance = Property.objects.get(id=data['property_id'])
        except Property.DoesNotExist:
            return Response({"error": "Property not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            rental_application = RentalApplication.objects.create(
                applicant=applicant,
                guest_first_name=data.get('guest_first_name'),
                guest_last_name=data.get('guest_last_name'),
                guest_email=data.get('guest_email'),
                property=property_instance,
                personal_details=data['personal_details'],
                business_details=data['business_details'],
                declaration=data['declaration'],
                status="Pending",
            )
        except Exception as e:
            return Response({"error": f"Failed to create rental application: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if emails.send_rental_application_received_email(data.get('guest_email'), property_instance.name):
            return Response({"message": "Application submitted successfully"}, status=status.HTTP_201_CREATED)
        else:
            rental_application.delete()
            return Response({"error": "Failed to send email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CustomAuthToken(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ObtainAuthToken.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        if user.role != "Tenant":
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'first_time_login': user.first_time_login
        })

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        password = request.data.get('password')

        if not password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)

        user.password = make_password(password)
        user.first_time_login = False
        user.save()
        
        emails.send_password_change_email(user)
        
        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)

class TenantProfileViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = serializers.TenantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Tenant.objects.filter(tenant=user)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'], url_path='upload-profile-picture', url_name='upload_profile_picture')
    def upload_profile_picture(self, request, pk=None):
        tenant = self.get_object()
        file = request.data.get('file')
        if file:
            tenant.profile_picture = file
            tenant.save()
            return Response({'status': 'Profile picture uploaded'}, status=status.HTTP_200_OK)
        return Response({'status': 'File not provided'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='delete-profile-picture', url_name='delete_profile_picture')
    def delete_profile_picture(self, request, pk=None):
        tenant = self.get_object()
        tenant.profile_picture.delete()
        tenant.save()
        return Response({'status': 'Profile picture deleted'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='change-password', url_name='change_password')
    def change_password(self, request):
        user = request.user
        serializer = serializers.PasswordChangeSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({'status': 'Password updated'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='delete-account', url_name='delete_account')
    def delete_account(self, request):
        user = request.user
        user.delete()
        return Response({'status': 'Account deleted'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='upload-lease', url_name='upload_lease')
    def upload_lease(self, request, pk=None):
        tenant = self.get_object()
        file = request.data.get('file')
        if file:
            tenant.lease_file = file
            tenant.save()
            return Response({'status': 'Lease file uploaded'}, status=status.HTTP_200_OK)
        return Response({'status': 'File not provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='renew-lease', url_name='renew_lease')
    def renew_lease(self, request, pk=None):
        tenant = self.get_object()
        tenant.lease_status = 'Renewed'
        tenant.lease_start = timezone.now()
        tenant.lease_end = timezone.now() + timezone.timedelta(days=365)
        tenant.save()
        return Response({'status': 'Lease renewed'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], url_path='terminate-lease', url_name='terminate_lease')
    def terminate_lease(self, request, pk=None):
        tenant = self.get_object()
        tenant.lease_status = 'Terminated'
        tenant.save()
        return Response({'status': 'Lease terminated'}, status=status.HTTP_200_OK)

class TenantPropertiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        tenant_properties = Tenant.objects.filter(tenant=user)
        serializer = serializers.TenantPropertiesSerializer(tenant_properties, many=True, context={'request': request})
        return Response(serializer.data)

class MaintenanceRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tenant = request.user.tenants.first()
        if tenant:
            maintenance_requests = MaintenanceRequest.objects.filter(tenant=tenant)
            serializer = serializers.MaintenanceRequestSerializer(maintenance_requests, many=True, context={'request': request})
            return Response(serializer.data)
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        tenant = request.user.tenants.first()
        if tenant:
            serializer = serializers.MaintenanceRequestSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                property_id = request.data.get('property')
                if not property_id:
                    return Response({"detail": "Property is required."}, status=status.HTTP_400_BAD_REQUEST)

                try:
                    property_instance = Property.objects.get(id=property_id)
                except Property.DoesNotExist:
                    return Response({"detail": "Property not found."}, status=status.HTTP_404_NOT_FOUND)

                maintenance_request = serializer.save(tenant=tenant, property=property_instance)

                if 'image1' in request.FILES:
                    maintenance_request.image1 = request.FILES['image1']
                if 'image2' in request.FILES:
                    maintenance_request.image2 = request.FILES['image2']
                maintenance_request.save()

                emails.send_request_received_email(maintenance_request)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Tenant not found."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk=None):
        try:
            instance = MaintenanceRequest.objects.get(pk=pk)
        except MaintenanceRequest.DoesNotExist:
            return Response({"detail": "Maintenance request not found."}, status=status.HTTP_404_NOT_FOUND)

        if 'completed_date' in request.data:
            instance.completed_date = request.data['completed_date']
            instance.status = 'Completed'
            instance.save()
            emails.send_completion_email(instance)
        
        serializer = serializers.MaintenanceRequestSerializer(instance, context={'request': request})
        return Response(serializer.data)

class MaintenanceRequestDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            maintenance_request = MaintenanceRequest.objects.get(pk=pk)
            serializer = serializers.MaintenanceRequestSerializer(maintenance_request, context={'request': request})
            return Response(serializer.data)
        except MaintenanceRequest.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = serializers.DocumentSerializer
    permission_classes = [IsAuthenticated]
        
class LeaseAgreementView(View):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, tenant_id):
        try:
            tenant = Tenant.objects.get(id=tenant_id)
        except Tenant.DoesNotExist:
            return HttpResponse("Tenant not found.", status=404)

        pdf_buffer = pdfs.generate_lease_agreement(tenant)
        document_name = f'lease_agreement_{tenant_id}.pdf'
        
        document = Document(
            name=document_name,
            tenant=tenant,
            publication_date=timezone.now().date(),
            file=ContentFile(pdf_buffer, name=document_name)
        )
        document.save()

        response = JsonResponse({
            'message': 'Document generated and saved successfully',
            'document_id': document.id,
            'file_url': document.file.url
        })
        return response

class LeaseReportView(View):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, tenant_id):
        try:
            tenant = Tenant.objects.get(id=tenant_id)
        except Tenant.DoesNotExist:
            return HttpResponse("Tenant not found", status=404)

        pdf_buffer = pdfs.generate_lease_report(tenant)
        document_name = f'lease_report_{tenant_id}.pdf'
        
        document = Document(
            name=document_name,
            tenant=tenant,
            publication_date=timezone.now().date(),
            file=ContentFile(pdf_buffer, name=document_name)
        )
        document.save()

        response = JsonResponse({
            'message': 'Document generated and saved successfully',
            'document_id': document.id,
            'file_url': document.file.url
        })
        return response

class TenantPropertiesReportView(View):
    def get(self, request, tenant_id):
        try:
            tenant = Tenant.objects.get(id=tenant_id)
        except Tenant.DoesNotExist:
            return HttpResponse("Tenant not found.", status=404)

        pdf_buffer = pdfs.generate_tenant_properties_report(tenant)
        document_name = f'tenant_properties_report_{tenant_id}.pdf'
        
        document = Document(
            name=document_name,
            tenant=tenant,
            publication_date=timezone.now().date(),
            file=ContentFile(pdf_buffer, name=document_name)
        )
        document.save()

        response = JsonResponse({
            'message': 'Document generated and saved successfully',
            'document_id': document.id,
            'file_url': document.file.url
        })
        return response
    













