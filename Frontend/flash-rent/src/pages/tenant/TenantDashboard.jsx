import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import PrimaryButton from "../../components/PrimaryButton";
import TransactionCard from "../../components/TransactionCard";
import PropertyList from "../../components/PropertyList";
import { useToken } from "../../hooks/useToken";
import MaintenanceRequestForm from "../../components/forms/MaintenanceRequestForm";

export default function TenantDashboard() {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [makingRequest, setMakingRequest] = useState(false);
  const [tenantName, setTenantName] = useState();
  const [tenantProperties, setTenantProperties] = useState([]);
  const {token} = useToken();
  const height = 0;

  const closeModal = () => {
    setMakingRequest(false);
  };
  const makeRequest = () => {
    setMakingRequest(true);
  };

  useEffect(() => {
    const fetchTenantName = async () => {
      try{
        const response = await axios.get('http://localhost:8000/api/tenant-profiles/', {
          headers: {
            'Authorization': `token ${token}`
          }
        });
        setTenantName(response.data[0].tenant_name)
      } catch (error) {
        console.log("Error fetching tenant name")
      };
    };
    const fetchMaintenanceRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/maintenance-requests/', {
          headers: {
            'Authorization': `token ${token}`
          }
        });
        setMaintenanceRequests(response.data);
      } catch (error) {
        console.log("Error fetching maintenance requests: ", error);
      }
    };
    const fetchTenantProperties = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/tenant-properties/', {
          headers: {
            'Authorization': `token ${token}`
          }
        });
        setTenantProperties(response.data);
      } catch (error) {
        console.log("Error fetching property data:", error);
      }
    };
    fetchTenantName();
    fetchMaintenanceRequests();
    fetchTenantProperties();
  },[token]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500';
      case 'In Progress':
        return 'bg-blue-500';
      case 'Completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  const groupedRequests = maintenanceRequests.reduce((acc, request) => {
    const status = request.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(request);
    return acc;
  }, {});
  return (
    <AuthenticatedLayout>
      <section className="mb-8 w-full">
        {tenantName && (
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Welcome, {tenantName}</h2>
        )}
        <div className="inline-flex gap-6">
          <div className="flex flex-col items-center">
            <Link>
              <span className="inline-flex flex-col items-center justify-center w-10 h-10 text-sm font-semibold text-gray-900 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300 hover:dark:bg-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-4 w-4 text-gray-900 dark:text-gray-100 mb-1" viewBox="0 0 576 512">
                  <path d="M535 41c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l64 64c4.5 4.5 7 10.6 7 17s-2.5 12.5-7 17l-64 64c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l23-23L384 112c-13.3 0-24-10.7-24-24s10.7-24 24-24l174.1 0L535 41zM105 377l-23 23L256 400c13.3 0 24 10.7 24 24s-10.7 24-24 24L81.9 448l23 23c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L7 441c-4.5-4.5-7-10.6-7-17s2.5-12.5 7-17l64-64c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM96 64H337.9c-3.7 7.2-5.9 15.3-5.9 24c0 28.7 23.3 52 52 52l117.4 0c-4 17 .6 35.5 13.8 48.8c20.3 20.3 53.2 20.3 73.5 0L608 169.5V384c0 35.3-28.7 64-64 64H302.1c3.7-7.2 5.9-15.3 5.9-24c0-28.7-23.3-52-52-52l-117.4 0c4-17-.6-35.5-13.8-48.8c-20.3-20.3-53.2-20.3-73.5 0L32 342.5V128c0-35.3 28.7-64 64-64zm64 64H96v64c35.3 0 64-28.7 64-64zM544 320c-35.3 0-64 28.7-64 64h64V320zM320 352a96 96 0 1 0 0-192 96 96 0 1 0 0 192z"/>
                </svg>
              </span>
              <div className="text-xs text-center text-gray-900 dark:text-white">Pay Rent</div>
            </Link>
          </div>
          <button className="flex flex-col items-center" onClick={makeRequest}>
            <span className="inline-flex flex-col items-center justify-center w-10 h-10 text-sm font-semibold text-gray-900 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300 hover:dark:bg-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-4 w-4 text-gray-900 dark:text-gray-100 mb-1" fill="currentColor">
                <path d="M78.6 5C69.1-2.4 55.6-1.5 47 7L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4h54.1l109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3l-109-109V104c0-7.5-3.5-14.5-9.4-19L78.6 5zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L233.7 374.3c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7L19.9 396.1zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7H352c-8.8 0-16-7.2-16-16V102.6c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0C288.5 0 224 64.5 224 144l0 .8 85.3 85.3c36-9.1 75.8 .5 104 28.7L429 274.5c49-23 83-72.8 83-130.5zM56 432a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/>
              </svg>
            </span>
            <div className="text-xs text-center text-gray-900 dark:text-white">Request Maintenance</div>
          </button>
        </div>
      </section>
      <section className="bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 h-96 mb-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between px-6 py-5 font-semibold border-b border-gray-100">
          <span>
            <h5 className="text-gray-900 dark:text-gray-100">Recent Maintenance Requests</h5>
          </span>
          <span>
            <PrimaryButton>
              <Link to="/tenant/maintenance-requests">View All</Link>
            </PrimaryButton>
          </span>
        </div>
      <div className="p-4 flex-grow overflow-y-auto">
        {Object.keys(groupedRequests).map((status, index) => (
          <div key={index}>
            <h6 className={`text-lg font-semibold ${getStatusClass(status)}`}>{status}</h6>
            <ul className="divide-y divide-gray-400">
              {groupedRequests[status].map((maintenanceRequest, idx) => (
                <li key={idx} className="py-4 hover:bg-gray-100 dark:hover:bg-gray-900">
                  <Link to={`/tenant/maintenance/${maintenanceRequest.id}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{maintenanceRequest.issue}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Reported: {maintenanceRequest.reportedDate}</div>
                      </div>
                      <div className="flex items-center mr-2">
                        <span className="text-gray-500 dark:text-gray-200">Completed: {maintenanceRequest.completedDate}</span>
                        <div className={`rounded-full h-3 w-3 ml-2 ${getStatusClass(status)}`}></div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      </section>
      {/* <section className="grid lg:grid-cols-4 gap-6 mb-4">
        <div className="flex flex-col lg:col-span-3 lg:row-span-2 bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-md rounded-lg">
          <div className="flex items-center justify-between px-6 py-5 font-semibold border-b border-gray-100">
            <span>
                <h5 className="text-gray-900 dark:text-gray-100">
                    My Transactions
                </h5>
            </span> 
            <span>
                <PrimaryButton>
                    <Link to="/tenant/payment" >
                        View All
                    </Link>
                </PrimaryButton>
            </span>
          </div>
          <div className="overflow-y-auto w-full" style={{ maxHeight: height + '24rem' }}>
              <div className="p-6 space-y-6">
                {transactions.map((transaction, index) => (
                    <TransactionCard
                        key={index}
                        isDeposit={transaction.isDeposit}
                        refNo={transaction.refNo}
                        transactionDate={transaction.transactionDate}
                        amount={transaction.amount}
                    />
                ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:col-span-1 lg:row-span-2 bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-md rounded-lg">
          <div className="px-6 py-5 font-semibold border-b border-gray-100">
            <h5 className="text-gray-100">
              Important Dates
            </h5>
          </div>
          <div className="p-4 flex-grow">
            <div className="flex items-center justify-center h-full px-4 py-16 text-gray-400 text-3xl font-semibold rounded-md">
              Calendar
            </div>
          </div>
        </div>
      </section> */}
      <section className="grid lg:grid-cols-6 gap-6 mb-4">
        <div className="flex flex-col lg:col-span-4 lg:row-span-2 bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-md rounded-lg">
          <div className="px-6 py-5 font-semibold border-b border-gray-100">
            <h1 className="text-gray-900 dark:text-gray-100">Property Details</h1>
          </div>
          <div className="overflow-x-auto h-96" style={{ maxHeight: height + '24rem' }}>
              <PropertyList properties={tenantProperties} />
          </div>
        </div>
        <div className="flex flex-col lg:col-span-2 lg:row-span-2 bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-md rounded-lg">
          <div className="px-6 py-5 font-semibold border-b border-gray-100">
            <h1 className="text-gray-900 dark:text-gray-100">Recent Announcements</h1>
          </div>
          <div className="overflow-y-auto p-4 h-96" style={{ maxHeight: height + '24rem' }}>
          </div>
        </div>
      </section>
      <MaintenanceRequestForm makingRequest={makingRequest} closeModal={closeModal} />
    </AuthenticatedLayout>
  );
};
