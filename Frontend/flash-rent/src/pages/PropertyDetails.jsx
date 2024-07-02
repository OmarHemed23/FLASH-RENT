import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import GuestLayout from '../layout/GuestLayout';
import PrimaryButton from '../components/PrimaryButton';
import Spinner from '../components/Spinner';

export default function PropertyDetails () {
    const [property, setProperty] = useState(null);
    const [propertyType, setPropertyType] = useState(null);
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true); 
    const { name } = useParams();

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/properties/`, {
                    params: { search: name }
                });
                if (response.data.length > 0) {
                    const fetchedProperty = response.data[0];
                    setProperty(fetchedProperty);
                    
                    const propertyTypeResponse = await axios.get(`http://localhost:8000/api/property-types/${fetchedProperty.property_type}/`);
                    setPropertyType(propertyTypeResponse.data);
    
                    const addressResponse = await axios.get(`http://localhost:8000/api/addresses/${fetchedProperty.address}/`);
                    setAddress(addressResponse.data);
                } else {
                    console.error('No property found with name:', name);
                }
            } catch (error) {
                console.error('Error fetching property:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProperty();
    }, [name]);

    if (loading || !property || !propertyType || !address) {
        return <Spinner className="bg-white dark:bg-gray-900"/>;
    }

    return (
        <GuestLayout>
            <section className="py-8 mt-4 bg-white dark:bg-gray-800 rounded-lg md:py-16 antialiased shadow-md overflow-auto">
                <div className="max-w-screen-xl px-4 mx-auto">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                        <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                            <img className="w-full block" src={property.image1} alt="" />
                        </div>
                        <div className="mt-6 sm:mt-8 lg:mt-0">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {property.name}
                            </h1>
                            <div className="mt-4 items-center gap-4 flex-col">
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    Monthly Rent: {property.rent_amount}
                                </p>
                                <p className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                                    Status: {property.status}
                                </p>
                                <p className="text-lg font-bold text-gray-500 dark:text-gray-400">
                                    Location: {address.formatted}
                                </p>
                            </div>
                            <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                                <Link to={`/property/${property.name}/apply`}>
                                    <PrimaryButton>
                                        Apply Rental
                                    </PrimaryButton>
                                </Link>
                            </div>
                            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
                            <h5 className="mb-6 text-gray-500 dark:text-gray-400">
                                Type: {propertyType.property_type}
                            </h5>
                            <div className="text-gray-500 dark:text-gray-400">
                                {property.description}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
};

