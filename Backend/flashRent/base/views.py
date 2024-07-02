from rest_framework import viewsets
from .models import Property, PropertyType
from .serializers import PropertySerializer, PropertyTypeSerializer, AddressSerializer, CountrySerializer, StateSerializer, LocalitySerializer
from address.models import Address, Country, State, Locality

class PropertyTypeViewSet(viewsets.ModelViewSet):
    queryset = PropertyType.objects.all()
    serializer_class = PropertyTypeSerializer

    def get_queryset(self):
        queryset = self.queryset
        property_type = self.request.query_params.get('property_type', None)

        if property_type:
            property_types = property_type.split(',')
            queryset = queryset.filter(property_type__in=property_types)
        return queryset
    
class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

    def get_queryset(self):
        queryset = self.queryset
        search_query = self.request.query_params.get('search', '')
        property_type = self.request.query_params.get('property_type', '')
        min_rent = self.request.query_params.get('min_rent', None)
        max_rent = self.request.query_params.get('max_rent', None)

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

        return queryset

class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer

class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all()
    serializer_class = StateSerializer

class LocalityViewSet(viewsets.ModelViewSet):
    queryset = Locality.objects.all()
    serializer_class = LocalitySerializer


