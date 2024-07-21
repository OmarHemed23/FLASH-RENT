from django.urls import path, include
from rest_framework import routers
from base import views

router = routers.DefaultRouter()
router.register(r'addresses', views.AddressViewSet, basename='address')
router.register(r'countries', views.CountryViewSet, basename='country')
router.register(r'states', views.StateViewSet, basename='state')
router.register(r'localities', views.LocalityViewSet, basename='locality')
router.register(r'tenant-profiles', views.TenantProfileViewSet, basename='tenant-profile')
router.register(r'documents', views.DocumentViewSet, basename='document')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/properties/', views.PropertyView.as_view(), name='property'),
    path('api/properties/<str:name>/', views.PropertyView.as_view(), name='property-detail'),
    path('api/property-types/', views.PropertyTypeView.as_view(), name='propertytype'),
    path('api/property-types/<int:pk>/', views.PropertyTypeDetailView.as_view(), name='propertytype-detail'),
    path('api/tenant-properties/', views.TenantPropertiesView.as_view(), name='tenant-property'),
    path('api/maintenance-requests/', views.MaintenanceRequestView.as_view(), name='maintenance-request'),
    path('api/maintenance-requests/<int:pk>/', views.MaintenanceRequestDetailView.as_view(), name='maintenance-request'),
    path('api/rental-applications/', views.RentalApplicationView.as_view(), name='rental-applications'),
    path('api-token-auth/', views.CustomAuthToken.as_view(), name='api-token-auth'),
    path('api/change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('lease-agreement/<int:tenant_id>/', views.LeaseAgreementView.as_view(), name='lease_agreement'),
    path('lease-report/<int:tenant_id>/', views.LeaseReportView.as_view(), name='lease-report'),
    path('tenant-properties-report/<int:tenant_id>/', views.TenantPropertiesReportView.as_view(), name='tenant_properties_report'),
]


# router = routers.DefaultRouter()
# router.register(r'properties', views.PropertyViewSet, basename='property')
# router.register(r'property-types', views.PropertyTypeViewSet, basename='propertytype')

# router.register(r'tenant-properties', views.TenantPropertiesViewSet, basename='tenant-property')
# router.register(r'maintenance-requests', views.MaintenanceRequestViewSet, basename='maintenance-request'),

# urlpatterns = [
    
#     path('api/rental-applications/', views.RentalApplicationView.as_view(), name='rental-applications'),
#     path('api-token-auth/', views.CustomAuthToken.as_view()),
#     path('api/change-password/', views.ChangePasswordView.as_view(), name='change-password'),
# ]

