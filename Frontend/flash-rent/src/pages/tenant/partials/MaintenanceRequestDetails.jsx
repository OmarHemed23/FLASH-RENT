import { Link, useParams } from "react-router-dom";
import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";

const maintenanceRequests = [
    {
        id: 1,
        title: "Leaked drainage",
        description: "Lorem Ipsum",
        reportedDate: "2024-10-20",
        status: "In Progress",
        maintenanceScheduledDate: "2024-11-1",
        attachments: [
            {
                name: "leaked_drainage_photo.jpg",
                size: "1.2mb"
            }
        ]
    },
    {
        id: 2,
        title: "Broken pipe",
        description: "Lorem Ipsum",
        reportedDate: "2024-01-15",
        status: "Completed",
        maintenanceScheduledDate: "2024-11-1",
        completedDate: "2024-03-28",
        attachments: [
            {
                name: "broken_pipe_photo.jpg",
                size: "2.4mb"
            }
        ]
    },
];

export default function MaintenanceRequestDetails() {
    const { id } = useParams();
    const maintenanceRequest = maintenanceRequests.find((request) => request.id === parseInt(id, 10));

    if (!maintenanceRequest) {
        return <div>Not found</div>;
    }

    const renderField = (label, value) => (
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <p className="text-sm font-medium leading-6 text-gray-900 dark:text-white">{label}:</p>
            <p className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-200 sm:col-span-2 sm:mt-0">{value}</p>
        </div>
    );

    return (
        <AuthenticatedLayout>
            <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">{maintenanceRequest.title}</h3>
            </div>
            <div className="mt-6 border-t border-gray-100">
                <div className="divide-y divide-gray-100">
                    {renderField('Maintenance Issue', maintenanceRequest.title)}
                    {renderField('Description', maintenanceRequest.description)}
                    {renderField('Reported Date', maintenanceRequest.reportedDate)}
                    {renderField('Status', maintenanceRequest.status)}
                    {renderField('Maintenance scheduled date', maintenanceRequest.maintenanceScheduledDate)}
                    {maintenanceRequest.completedDate && renderField('Completed date', maintenanceRequest.completedDate)}

                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <div className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Attachments
                        </div>
                        <div className="mt-2 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                            <ul className="divide-y divide-gray-900 rounded-md border border-gray-900 dark:border-gray-100">
                                {maintenanceRequest.attachments.map((attachment, index) => (
                                    <li key={index} className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                        <div className="flex w-0 flex-1 items-center">
                                            <svg className="h-5 w-5 flex-shrink-0 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clipRule="evenodd" />
                                            </svg>
                                            <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                <span className="truncate font-medium text-gray-900 dark:text-white">{attachment.name}</span>
                                                <span className="flex-shrink-0 dark:text-gray-400">{attachment.size}</span>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            <Link to="#" className="font-medium text-indigo-600 hover:text-indigo-500">Download</Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};
