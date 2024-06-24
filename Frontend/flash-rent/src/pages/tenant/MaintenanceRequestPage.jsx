import { useState } from "react";
import { Link } from "react-router-dom";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import PrimaryButton from "../../components/PrimaryButton";
import Pagination from "../../components/Pagination";
import { usePagination } from "../../hooks/usePagination";
import MaintenaceRequestForm from "../../components/forms/MaintenanceRequestForm";

const maintenanceRequests = [
    {
        id: 1,
        title: "Leaked drainage",
        reportedDate: "2024-10-20",
        completedDate: "2023-10-30"
    },
    {
        id: 2,
        title: "Broken pipe",
        reportedDate: "2024-01-15",
        completedDate: "2023-02-28"
    },
];

export default function MaintenanceRequestPage () {
    const [makingRequest, setMakingRequest] = useState(false);
    const [currentPage, totalPages, handlePageChange, displayedItems] = usePagination({ items: maintenanceRequests });

    const closeModal = () => {
        setMakingRequest(false);
    };
    const makeRequest = () => {
        setMakingRequest(true);
    };
    
    return (
        <AuthenticatedLayout>
            <div className="mt-4">
                <div className="flex justify-start">
                    <PrimaryButton onClick={makeRequest}>
                        Make request
                    </PrimaryButton>
                </div>
                <div className="flex flex-col md:col-span-2 md:row-span-2 mt-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                    <div className="p-4 flex-grow overflow-y-auto">
                        <div className="p-4 flex-grow overflow-y-auto">
                            <ul className="divide-y divide-gray-200">
                                {displayedItems.map((maintenanceRequest) => (
                                    <li key={maintenanceRequest.id} className="py-4 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md">
                                        <Link to={`/tenant/maintenance/${maintenanceRequest.id}/`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex-shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{maintenanceRequest.title}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Reported: {maintenanceRequest.reportedDate}</div>
                                                </div>
                                                <div className="flex items-center mr-2">
                                                    <span className="text-gray-500 dark:text-gray-200">Completed: {maintenanceRequest.completedDate}</span>
                                                    <div className="rounded-full h-3 w-3 ml-2 bg-green-500"></div>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex item-center justify-center p-2">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                </div>
                <MaintenaceRequestForm makingRequest={makingRequest} closeModal={closeModal} />
            </div>
        </AuthenticatedLayout>
    );
};

