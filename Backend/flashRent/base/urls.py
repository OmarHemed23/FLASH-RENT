from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'properties', views.PropertyViewSet, basename='property')
router.register(r'property-types', views.PropertyTypeViewSet, basename='propertytype')
router.register(r'addresses', views.AddressViewSet, basename='address')
router.register(r'countries', views.CountryViewSet, basename='country')
router.register(r'states', views.StateViewSet, basename='state')
router.register(r'localities', views.LocalityViewSet, basename='locality')

urlpatterns = [
    path('api/', include(router.urls)),
]
