import { useState, useEffect } from "react";
import axios from "axios";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import FormField from "../../components/FormField";
import PrimaryButton from "../../components/PrimaryButton";
import { useToken } from "../../hooks/useToken";
import Alert from "../../components/Alert";

export default function PaymentCenterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({property: '',tenant_name: '',email: '',mpesaNumber: '',leaseStart: '',leaseEnd: '',totalAmount: 0});
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [leasedPropertyData, setLeasedPropertyData] = useState({});
  const [tenantData, setTenantData] = useState({});
  const [proratedRent, setProratedRent] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const {token} = useToken();

  const steps = [
    { id: "personal information" },
    { id: "payment information" },
    { id: "confirm payment" },
  ];

  useEffect(() => {
    const fetchLeasedProperties = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/tenant-properties/', {
          headers: {
            'Authorization': `token ${token}`
          }
        });
        setPropertyOptions(
          response.data.map(property => ({
            value: property.property_id,
            label: property.property_name
          }))
        );
        response.data.length > 0 ? setLeasedPropertyData(response.data[0]) : console.error("Error");
      } catch (error) {
        console.log("Error fetching properties:", error);
      }
    }
    const fetchTenantData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/tenant-profiles/', {
          headers: {
            'Authorization': `token ${token}`
          }
        });
        response.data.length > 0 ? setTenantData(response.data[0]) : console.error("Error fetching tenant data");
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchLeasedProperties();
    fetchTenantData();
  }, [token]);

  useEffect(() => {
    if (formData.leaseStart && formData.leaseEnd && formData.property && leasedPropertyData) {
      const startDate = new Date(formData.leaseStart);
      const endDate = new Date(formData.leaseEnd);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const monthlyRent = parseFloat(leasedPropertyData.property_rentAmount);
  
      if (!isNaN(monthlyRent)) {
        const totalProratedRent = (days * (monthlyRent / 30));
        setProratedRent(totalProratedRent);
        const fixedFee = 299;
        const totalAmount = totalProratedRent + fixedFee;
        setFormData({ ...formData, totalAmount });
      }
    }
  }, [formData.leaseStart, formData.leaseEnd, formData.property, leasedPropertyData]);

  const handleNextStep = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      initiatePayment();
    }
  };

  const handlePreviousStep = (e) => {
    e.preventDefault();
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const initiatePayment = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/initiate-payment/', {
        tenant_id: tenantData.id,
        property_id: formData.property,
        amount: formData.totalAmount,
        phone_number: formData.mpesaNumber,
      }, {
        headers: {
          'Authorization': `token ${token}`
        }
      });

      if (response.status === 200 && response.data.response.ResponseCode === '0') {
        setSuccessMessage('Payment initiated successfully. Please complete the payment on your M-Pesa phone.');
      } else {
        setErrorMessage('Payment initiation failed. Please try again.');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      setErrorMessage('Error initiating payment. Please try again.');
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            <div className="md:col-span-2">
              <FormField label="Property" name="property" id="property" type="select" options={propertyOptions} value={formData.property} onChange={handleInputChange} />
            </div>
            {tenantData && (
              <>
                <FormField label="Full Name" type="text" name="tenant_name" id="tenant_name" placeholder="Full Name" value={tenantData.tenant_name} readOnly />
                <FormField label="Email" type="email" name="email" id="email" placeholder="Your Email" value={tenantData.email} readOnly />
              </>
            )}
            <div className="md:col-span-2">
              <FormField label="M-Pesa Account Number" type="text" name="mpesaNumber" id="mpesaNumber" placeholder="Your M-Pesa number" onChange={handleInputChange} value={formData.mpesaNumber} />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            <FormField label="Lease Start Date" type="date" name="leaseStart" id="leaseStart" placeholder="Lease start date" onChange={handleInputChange} value={formData.leaseStart} />
            <FormField label="Lease End Date" type="date" name="leaseEnd" id="leaseEnd" placeholder="Lease end date" onChange={handleInputChange} value={formData.leaseEnd} />
            {leasedPropertyData && (
              <div className="md:col-span-2">
                <FormField label="Total Amount" type="text" name="totalAmount" id="totalAmount" placeholder="Total amount" readOnly value={formData.totalAmount} />
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="mx-auto">
            <div className="flex flex-col items-center justify-center gap-12">
              <div className="w-full sm:mt-8 lg:mt-0 shadow-md rounded-lg">
                <div className="space-y-4 border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                  <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Rent</dt>
                      <dd className="text-base font-medium text-gray-900 dark:text-white">{proratedRent}</dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Security Price</dt>
                      <dd className="text-base font-medium text-green-500">-299.00</dd>
                    </dl>
                  </div>
                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">{formData.totalAmount.toFixed(2)}</dd>
                  </dl>
                </div>
              </div>
              <div className="w-full rounded-lg border border-gray-200 bg-gray-100 p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
                <PrimaryButton type="submit" className="flex w-full items-center justify-center">
                  Pay now
                </PrimaryButton>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AuthenticatedLayout>
      <section className="bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-md rounded-lg">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Lipa Na M-Pesa</h2>
          {errorMessage && <Alert type="error" message={errorMessage}/>}
          {successMessage && <Alert type="success" message={successMessage}/>}
          <form onSubmit={handleNextStep}>
            {renderStepContent(activeStep)}
            <div className="flex justify-between mt-3">
              {activeStep > 0 && (
                <PrimaryButton type="button" className="px-5 py-2.5" onClick={handlePreviousStep}>
                  Previous Step
                </PrimaryButton>
              )}
              {activeStep < steps.length - 1 ? (
                <PrimaryButton type="submit" className="px-5 py-2.5">
                  Next Step
                </PrimaryButton>
              ) : (
                <PrimaryButton type="submit" className="px-5 py-2.5">
                  Confirm Payment
                </PrimaryButton>
              )}
            </div>
          </form>
        </div>
      </section>
    </AuthenticatedLayout>
  );
}





