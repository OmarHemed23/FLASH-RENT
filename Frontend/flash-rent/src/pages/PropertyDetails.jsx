import React from 'react';
import { Link, useParams } from 'react-router-dom';
import GuestLayout from '../layout/GuestLayout';
import PrimaryButton from '../components/PrimaryButton';
import image1 from '../images/image1.jpg';

const properties = [
    {
        id: 'mwembe-tayari-mall',
        name: "mwembe-tayari-mall",
        type: "mall",
        location: "Mombasa, MSA",
        rent: "$10,000,000",
        size: "500,000 sqft",
        image: "image1",
        link: "/property/mwembe-tayari-mall"
    },
];

export default function PropertyDetails () {
  const { id } = useParams();
  const property = properties.find((prop) => prop.id === id);

  if (!property) {
    return <div>Property not found</div>;
  }
  
  return (
    <GuestLayout>
        <section className="py-8 mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg md:py-16 antialiased shadow-md">
            <div className="max-w-screen-xl px-4 mx-auto">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                    <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                        <img className="w-full block" src={image1} alt="" />
                    </div>
                    <div className="mt-6 sm:mt-8 lg:mt-0">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            {property.name}
                        </h1>
                        <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                Monthly Rent: {property.rent}
                            </p>
                            <div className="flex-row md:flex items-center gap-2 mt-2 sm:mt-0">
                                <div className="flex items-center gap-1">
                                    <p className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                                        Size: {property.size}
                                    </p>
                                </div>
                                <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                                    Location: {property.location}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                            <Link to={`/property/${property.id}/apply`}>
                                <PrimaryButton>
                                    Apply Rental
                                </PrimaryButton>
                            </Link>
                        </div>
                        <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
                        <h5 className="mb-6 text-gray-500 dark:text-gray-400">
                            Type: {property.type}
                        </h5>
                        <div className="text-gray-500 dark:text-gray-400">
                         
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </GuestLayout>
  );
};
