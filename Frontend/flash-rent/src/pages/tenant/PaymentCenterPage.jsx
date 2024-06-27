import { useState } from "react";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import FormField from "../../components/FormField";
import PrimaryButton from "../../components/PrimaryButton";

export default function PaymentCenterPage() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: "personal information" },
    { id: "payment information" },
    { id: "confirm payment" },
  ];

  const handleNextStep = (e) => {
    e.preventDefault();
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePreviousStep = (e) => {
    e.preventDefault();
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              <div className="md:col-span-2">
                <FormField label="Property" type="select" name="property-name" id="property-name" placeholder="Property" />
              </div>
              <FormField label="Full Name" type="text" name="full-name" id="full-name" placeholder="Full Name" />
              <FormField label="Email" type="email" name="email" id="email" placeholder="Your Email" />
              <div className="md:col-span-2">
                <FormField label="M-Pesa Account Number" type="text" name="mpesa-number" id="mpesa-number" placeholder="Your M-Pesa number" />
              </div>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              <FormField label="Lease Start Date" type="date" name="lease-start" id="lease-start" placeholder="Lease start date" />
              <FormField label="Lease End Date" type="date" name="lease-end" id="lease-end" placeholder="Lease end date" />
              <div className="md:col-span-2">
                <FormField label="Total Amount" type="text" name="total-amount" id="total-amount" placeholder="Total amount" />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="mx-auto">
              <div className="flex flex-col items-center justify-center gap-12">
                <div className="w-full sm:mt-8 lg:mt-0 shadow-md rounded-lg">
                  <div className="space-y-4 border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="space-y-2">
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Monthly Price</dt>
                        <dd className="text-base font-medium text-gray-900 dark:text-white">$6,592.00</dd>
                      </dl>

                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Secuirty Price</dt>
                        <dd className="text-base font-medium text-green-500">-$299.00</dd>
                      </dl>
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Tax</dt>
                        <dd className="text-base font-medium text-gray-900 dark:text-white">$799</dd>
                      </dl>
                    </div>
                    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                      <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                      <dd className="text-base font-bold text-gray-900 dark:text-white">$7,191.00</dd>
                    </dl>
                  </div>
                </div>
                <div className="w-full rounded-lg border border-gray-200 bg-gray-100 p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
                  <PrimaryButton className="flex w-full items-center justify-center">
                    Pay now
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <AuthenticatedLayout>
      <section className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Pay with M-Pesa
          </h2>
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
};
