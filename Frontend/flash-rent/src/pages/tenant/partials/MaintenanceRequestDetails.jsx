import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";
import { useToken } from "../../../hooks/useToken";

export default function MaintenanceRequestDetails() {
    const { id } = useParams();
    const [maintenanceRequest, setMaintenanceRequest] = useState(null);
    const { token } = useToken();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMaintenanceRequest = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/maintenance-requests/${id}/`, {
                    headers: {
                        'Authorization': `token ${token}`,
                    },
                });
                setMaintenanceRequest(response.data);
            } catch (error) {
                setError('Error fetching maintenance request');
                console.error('Error fetching maintenance request:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMaintenanceRequest();
    }, [id, token]);

    if (error) {
        return <div>{error}</div>;
    }

    const renderField = (label, value) => (
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <p className="text-sm font-medium leading-6 text-gray-900 dark:text-white">{label}:</p>
            <p className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-200 sm:col-span-2 sm:mt-0">{value}</p>
        </div>
    );

    const renderAttachment = (label, url) => (
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <p className="text-sm font-medium leading-6 text-gray-900 dark:text-white">{label}:</p>
            <div className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-200 sm:col-span-2 sm:mt-0">
                <Link to={url} download className="text-indigo-600 hover:text-indigo-500">Download</Link>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout>
            {maintenanceRequest && (
                <div className="flex flex-col mt-6 px-4 py-4 md:col-span-2 md:row-span-2 bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-md rounded-lg">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">{maintenanceRequest.issue}</h3>
                    </div>
                    <div className="mt-6 border-t border-gray-100">
                        <div className="divide-y divide-gray-100">
                            {renderField('Maintenance Issue', maintenanceRequest.issue)}
                            {renderField('Description', maintenanceRequest.description)}
                            {renderField('Reported Date', new Date(maintenanceRequest.reported_date).toLocaleDateString())}
                            {renderField('Status', maintenanceRequest.status)}
                            {renderField('Maintenance Scheduled Date', new Date(maintenanceRequest.schedule_date).toLocaleDateString())}
                            {maintenanceRequest.completed_date && renderField('Completed Date', new Date(maintenanceRequest.completed_date).toLocaleDateString())}
                            {maintenanceRequest.image1_url && renderAttachment('Image 1', maintenanceRequest.image1_url)}
                            {maintenanceRequest.image2_url && renderAttachment('Image 2', maintenanceRequest.image2_url)}
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}



