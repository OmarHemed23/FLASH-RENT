import { useState, useEffect } from 'react';
import axios from 'axios';
import { MenuItem } from '@headlessui/react';
import GuestLayout from "../layout/GuestLayout";
import SearchInput from "../components/SearchInput";
import SearchFilter from "../components/SearchFilter";
import PropertyCard from "../components/PropertyCard";
import Pagination from "../components/Pagination";
import { usePagination } from "../hooks/usePagination";
import Spinner from "../components/Spinner";
import Checkbox from '../components/Checkbox';
import FormField from '../components/FormField';
import Label from '../components/Label';

export default function HomePage() {
    const [properties, setProperties] = useState([]);
    const [currentPage, totalPages, handlePageChange, displayedItems] = usePagination({ items: properties });
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); 
    const [minRent, setMinRent] = useState('');
    const [maxRent, setMaxRent] = useState('');

    const debounce = (func, delay) => {
        let debounceTimer;
        return (...args) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const fetchProperties = async (params) => {
        try {
            const response = await axios.get('http://localhost:8000/api/properties/', { params });
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchProperties = debounce(fetchProperties, 300);

    const handleSearchChange = (term) => {
        setSearchTerm(term);
        debouncedFetchProperties({ search: term, property_type: selectedTypes.join(',')});
    };

    const handleCheckboxChange = (type) => {
        const updatedTypes = selectedTypes.includes(type)
            ? selectedTypes.filter((t) => t !== type)
            : [...selectedTypes, type];
        setSelectedTypes(updatedTypes);
        debouncedFetchProperties({ search: searchTerm, property_type: updatedTypes.join(',')});
    };

    const handleRentChange = (min, max) => {
        setMinRent(min);
        setMaxRent(max);
        debouncedFetchProperties({ search: searchTerm,  min_rent: min, max_rent: max });
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchProperties({});
            setLoading(false);
        };
        fetchData();
        const fetchPropertyTypes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/property-types/');
                setPropertyTypes(response.data);
            } catch (error) {
                console.error('Error fetching property types:', error);
            }
        };
        fetchPropertyTypes();
    }, []);

    return (
        <GuestLayout>
            {loading ? (
                <Spinner className="bg-gray-50 dark:bg-gray-900" />
            ) : (
                <section className="relative h-full p-4">
                    <div className="max-w-screen px-4">
                        <div className="bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 relative shadow-md rounded-lg overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                                <div className="flex-1 flex items-center space-x-2">
                                    <h5>
                                        <span className="text-gray-500 dark:text-gray-100">Available Properties:</span>
                                        <span className="dark:text-white">{properties.length}</span>
                                    </h5>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between w-full px-4 py-4 dark:border-gray-700 border-t">
                                <div className="w-full">
                                    <SearchInput name="search-properties" id="search-properties" onSearch={handleSearchChange} placeholder="Search for properties" />
                                </div>
                                <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                                    <SearchFilter 
                                        title="Rent Amount" 
                                        items={[
                                            { id: 'minRent', label: 'Min:', value: minRent, onChange: (e) => handleRentChange(e.target.value, maxRent) },
                                            { id: 'maxRent', label: 'Max:', value: maxRent, onChange: (e) => handleRentChange(minRent, e.target.value) }
                                        ]}
                                        renderItem={(item) => (
                                            <li key={item.id}>
                                                <div className="flex items-center p-2">
                                                    <Label className="block text-gray-700 dark:text-gray-300 mr-2">{item.label}</Label>
                                                    <FormField
                                                        type="number"
                                                        value={item.value}
                                                        onChange={item.onChange}
                                                        className="p-2"
                                                    />
                                                </div>
                                            </li>
                                        )}
                                    />
                                    <SearchFilter 
                                        title="Property type" 
                                        items={propertyTypes}
                                        renderItem={(propertyType) => (
                                            <MenuItem as="li" key={propertyType.id}>
                                                {({ active }) => (
                                                    <div
                                                        className={`flex items-center rounded-lg p-2 ${active ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Checkbox
                                                            className="p-2"
                                                            checked={selectedTypes.includes(propertyType.property_type)}
                                                            onChange={() => handleCheckboxChange(propertyType.property_type)}
                                                        />
                                                        <Label className="ml-2 text-sm font-medium dark:text-gray-100">
                                                            {propertyType.property_type}
                                                        </Label>
                                                    </div>
                                                )}
                                            </MenuItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {displayedItems.map((property) => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        </div>
                    </div>
                </section>
            )}
        </GuestLayout>
    );
};






























