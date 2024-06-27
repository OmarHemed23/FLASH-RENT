import { useState } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import LeaseActionStepper from "../../components/LeaseActionStepper";
import Alert from "../../components/Alert";

export default function LeaseAgreementPage () {
  const [leaseData, setLeaseData] = useState([
    {
      propertyLeased: '123ABC',
      tenant: 'Omar Hemed',
      startDate: '2022-01-01',
      endDate: '2022-12-31',
      status: 'Pending'
    }
  ]);

  const [isNewTenant, setIsNewTenant] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const activeLease = leaseData.find(lease => lease.status === 'Active');

  const handleFileUpload = (event) => {
    console.log("File uploaded:", event.target.files[0]);
    setIsUploaded(true);
    setLeaseData([...leaseData, {
      propertyLeased: '456DEF',
      tenant: 'Omar Hemed',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      status: 'Active'
    }]);
  };

  return (
    <AuthenticatedLayout>
      <div className="w-full mt-6 px-4 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden rounded-lg">
        {!activeLease && !isNewTenant && !isUploaded && (
          <div className="ml-10">
            <h2 className="text-white text-lg font-semibold mb-4">New Tenant</h2>
            <p className="text-white mb-4">Please download the lease agreement, sign it, and upload the signed document.</p>
            <LeaseActionStepper handleFileUpload={handleFileUpload} />
          </div>
        )}
        {activeLease && (
          <div>
            <PrimaryButton>
              Renew Lease
            </PrimaryButton>
            <div className="mt-8">
                <Alert type="error" message="Please ensure all lease agreements are signed and returned by the specified deadline."/>
            </div>
            <div className="overflow-x-auto mb-2">
              <table className="text-sm text-left text-gray-500 mt-4 shadow-md">
                <thead className="text-xs text-gray-900 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th scope='col' className="px-6 py-3">
                      Property Leased
                    </th>
                    <th scope='col' className="px-6 py-3">
                      Tenant
                    </th>
                    <th scope='col' className="px-6 py-3">
                      Start Date
                    </th>
                    <th scope='col' className="px-6 py-3">
                      End Date
                    </th>
                    <th scope='col' className="px-6 py-3">
                      Status
                    </th>
                    <th scope='col' className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-100 dark:bg-gray-900 border-b">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {activeLease.propertyLeased}
                    </th>
                    <td className="px-6 py-4">
                      {activeLease.tenant}
                    </td>
                    <td className="px-6 py-4">
                      {activeLease.startDate}
                    </td>
                    <td className="px-6 py-4">
                      {activeLease.endDate}
                    </td>
                    <td className="px-6 py-4">
                      {activeLease.status}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <PrimaryButton>
                          Download
                        </PrimaryButton>
                        <PrimaryButton>
                          Renew
                        </PrimaryButton>
                        <PrimaryButton className="bg-red-800">
                          Terminate
                        </PrimaryButton>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
};
