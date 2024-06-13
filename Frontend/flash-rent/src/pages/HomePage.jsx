import React, { useState } from 'react';
import GuestLayout from "../layout/GuestLayout";
import SearchInput from "../components/SearchInput";
import SearchFilter from "../components/SearchFilter";
import PropertyCard from "../components/PropertyCard";
import Pagination from "../components/Pagination";
import image1 from "../images/image1.jpg";

const menuItems = [
    { label: "Mall" },
    { label: "Office" },
    { label: "Industrial" },
    { label: "Retail" },
    { label: "Land" },
    { label: "Hall" }
];

const properties = [
    {
        id: 'mwembe-tayari-mall',
        name: "Mwembe Tayari Mall",
        location: "Mombasa, MSA",
        rent: "$10,000,000",
        size: "500,000 sqft",
        image: image1,
        link: "/property/mwembe-tayari-mall"
    },
];


export default function HomePage() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(properties.length / itemsPerPage);

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const searchTerm = event.target.elements['search-input'].value;
        console.log('Searching for:', searchTerm);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedProperties = properties.slice(startIndex, startIndex + itemsPerPage);

    return (
        <GuestLayout>
            <section className="relative h-full p-4">
                <div className="max-w-screen px-4">
                    <div className="bg-white dark:bg-gray-800 relative shadow-md rounded-lg overflow-hidden">
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
                                <SearchInput onSubmit={handleSearchSubmit} />
                            </div>
                            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                                <SearchFilter value="Properties" menuItems={menuItems} />
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-6">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Search Results</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {displayedProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
};






























