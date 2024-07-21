import { useState, useEffect } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import axios from "axios";
import { useToken } from "../../hooks/useToken";
import Pagination from "../../components/Pagination";
import { usePagination } from "../../hooks/usePagination";

export default function LeaseAgreementPage() {
  const [leaseData, setLeaseData] = useState([]);
  const [activeLease, setActiveLease] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const {token} = useToken();
  const [currentPage, totalPages, handlePageChange, displayedItems] = usePagination({ items: leaseData });

  useEffect(() => {
    fetchLeaseData();
  }, []);

  const fetchLeaseData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tenant-profiles/', {
        headers: {
          'Authorization': `token ${token}`,
        },
      });
      setLeaseData(response.data);
      const activeLease = response.data.find((lease) => lease.lease_status === "Active");
      setActiveLease(activeLease);
    } catch (error) {
      console.error("Error fetching lease data:", error);
    }
  };

  const handleDownload = async () => {
    if (activeLease) {
      try {
        const response = await axios({
          url: `http://localhost:8000/lease-agreement/${activeLease.id}/`,
          method: 'GET',
          responseType: 'blob',
          headers: {
            'Authorization': `token ${token}`,
          },
        });

        const file = new Blob([response.data], { type: 'application/pdf' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = `lease_agreement_${activeLease.id}.pdf`;
        link.click();
      } catch (error) {
        console.error("Error downloading lease agreement:", error);
      }
    }
  };

  return (
    <AuthenticatedLayout>
      {leaseData.length > 0 && (
        <div className="w-full mt-6 px-4 py-4 bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-md overflow-hidden rounded-lg">
            <div>
              <div className="overflow-x-auto mb-2">
                <table className="text-sm text-left text-gray-500 mt-4 shadow-md">
                  <thead className="text-xs text-gray-900 dark:text-white uppercase bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3">Property Leased</th>
                      <th scope="col" className="px-6 py-3">Tenant</th>
                      <th scope="col" className="px-6 py-3">Start Date</th>
                      <th scope="col" className="px-6 py-3">End Date</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeLease ? (
                      <tr className="bg-gray-100 dark:bg-gray-900 border-b">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {activeLease.property_name || "N/A"}
                        </th>
                        <td className="px-6 py-4">
                          {activeLease.tenant_name || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(activeLease.lease_start).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(activeLease.lease_end).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {activeLease.lease_status}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <PrimaryButton onClick={handleDownload}>Download</PrimaryButton>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          No active lease found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
        </div>
      )}
    </AuthenticatedLayout>
  );
}



