import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GuestLayout from "../layout/GuestLayout";
import PersonalDetailsForm from "../components/forms/PersonalDetailsForm";
import PrimaryButton from "../components/PrimaryButton";
import BusinessDetailsForm from '../components/forms/BusinessDetailsForm';
import DeclarationForm from '../components/forms/DeclarationForm';
import Modal from '../components/Modal';
import CloseButton from '../components/CloseButton';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

export default function RentalApplication() {
    const [activeStep, setActiveStep] = useState(0);
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        personalDetails: {},
        businessDetails: {},
        declaration: {}
    });
    const [showModal, setShowModal] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const history = useNavigate();
    const { name } = useParams();

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/properties/`, {
                    params: { search: name }
                });
                if (response.data.length > 0) {
                    const fetchedProperty = response.data[0];
                    setProperty(fetchedProperty);
                } else {
                    console.error('No property found with name:', name);
                }
            } catch (error) {
                console.error('Error fetching property:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [name]);

    if (loading || !property) {
        return <Spinner className="bg-white dark:bg-gray-900" />;
    }

    const updatePersonalData = (data) => {
        setFormData(prevData => ({
            ...prevData,
            personalDetails: {
                ...prevData.personalDetails,
                ...data
            }
        }));
    };

    const updateBusinessData = (data) => {
        setFormData(prevData => ({
            ...prevData,
            businessDetails: {
                ...prevData.businessDetails,
                ...data
            }
        }));
    };

    const updateDeclarationData = (data) => {
        setFormData(prevData => ({
            ...prevData,
            declaration: {
                ...prevData.declaration,
                ...data
            }
        }));
    };

    const steps = [
        { id: "personal-details", component: <PersonalDetailsForm propertyName={property.name} updateFormData={updatePersonalData} /> },
        { id: "business-details", component: <BusinessDetailsForm updateFormData={updateBusinessData} /> },
        { id: "declaration", component: <DeclarationForm updateFormData={updateDeclarationData} /> }
    ];

    const handleSubmit = async () => {
        const data = {
            personal_details: formData.personalDetails,
            business_details: formData.businessDetails,
            declaration: formData.declaration,
            property_id: property.id,
            guest_first_name: formData.personalDetails.guest_first_name,
            guest_last_name: formData.personalDetails.guest_last_name,
            guest_email: formData.personalDetails.email,
        };

        try {
            const response = await axios.post('http://localhost:8000/api/rental-applications/', data);
            console.log(response.data);
            setAlert({ show: true, type: 'success', message: response.data.message });
            setTimeout(() => {
                history('/');
            }, 3000);
        } catch (error) {
            console.error('Error submitting application:', error);
            if (error.response && error.response.data && error.response.data.error) {
                setAlert({ show: true, type: 'error', message: error.response.data.error });
            } else {
                setAlert({ show: true, type: 'error', message: 'Error sending application, try again.' });
            }
        }
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        } else {
            setShowModal(true);
        }
    };

    const handlePreviousStep = (e) => {
        e.preventDefault();
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };

    const handleAccept = () => {
        handleSubmit();
        setShowModal(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <GuestLayout>
            <section className="bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 mt-5 md:mt-0 rounded-lg shadow-md">
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    {alert.show && <Alert type={alert.type} message={alert.message} />}
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        FILL THE APPLICATION FORM
                    </h2>
                    <form onSubmit={handleNextStep}>
                        {steps[activeStep].component}
                        <div className="flex justify-between mt-3">
                            {activeStep > 0 && (
                                <PrimaryButton type="button" className="px-5 py-2.5" onClick={handlePreviousStep}>
                                    Previous Step
                                </PrimaryButton>
                            )}
                            <PrimaryButton type="submit" className="px-5 py-2.5">
                                {activeStep === steps.length - 1 ? "Submit Application" : "Next Step"}
                            </PrimaryButton>
                        </div>
                    </form>
                    <Modal show={showModal} onClose={handleCloseModal}>
                        <div className="relative">
                            <div className="relative rounded-lg shadow-md bg-white dark:bg-gray-900">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Application Declaration
                                    </h3>
                                    <CloseButton onClick={handleCloseModal} />
                                </div>
                                <div className="p-4 md:p-5 space-y-4">
                                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        The undersigned Applicant hereby declares that the representations of fact contained in the
                                        foregoing application are true and correct. If any such representation is false, any lease
                                        hereinafter entered into between Landlord and Applicant will have been made in reliance
                                        upon such representation and may, at the option of the Landlord, be terminated at any time.
                                    </p>
                                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        I/We hereby authorize the verification of all above information by the Landlord. This
                                        application does not constitute a contract, lease or agreement for space.
                                    </p>
                                </div>
                                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                    <PrimaryButton type="button" className="px-5 py-2.5" onClick={handleAccept}>
                                        I accept
                                    </PrimaryButton>
                                    <PrimaryButton type="button" className="py-2.5 px-5 ms-3 bg-red-500 hover:bg-red-700 hover:text-white" onClick={handleCloseModal}>
                                        Decline
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </section>
        </GuestLayout>
    );
}







// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import GuestLayout from "../layout/GuestLayout";
// import PersonalDetailsForm from "../components/forms/PersonalDetailsForm";
// import PrimaryButton from "../components/PrimaryButton";
// import BusinessDetailsForm from '../components/forms/BusinessDetailsForm';
// import DeclarationForm from '../components/forms/DeclarationForm';
// import Modal from '../components/Modal';
// import CloseButton from '../components/CloseButton';
// import Spinner from '../components/Spinner';

// export default function RentalApplication() {
//     const [activeStep, setActiveStep] = useState(0);
//     const [property, setProperty] = useState(null);
//     const [loading, setLoading] = useState(null);
//     const [formData, setFormData] = useState({
//         personalDetails: {},
//         businessDetails: {},
//         declaration: {}
//     });
//     const [showModal, setShowModal] = useState(false);

//     const { name } = useParams();

//     useEffect(() => {
//         const fetchProperty = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8000/api/properties/`, {
//                     params: { search: name }
//                 });
//                 if (response.data.length > 0) {
//                     const fetchedProperty = response.data[0];
//                     setProperty(fetchedProperty);
//                 } else {
//                     console.error('No property found with name:', name);
//                 }
//             } catch (error) {
//                 console.error('Error fetching property:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
        
//         fetchProperty();
//     }, [name]);

//     if (loading || !property) {
//         return <Spinner className="bg-white dark:bg-gray-900"/>;
//     }

//     const updatePersonalData = (data) => {
//         setFormData(prevData => ({
//             ...prevData,
//             personalDetails: {
//                 ...prevData.personalDetails,
//                 ...data
//             }
//         }));
//     };

//     const updateBusinessData = (data) => {
//         setFormData(prevData => ({
//             ...prevData,
//             businessDetails: {
//                 ...prevData.businessDetails,
//                 ...data
//             }
//         }));
//     };

//     const updateDeclarationData = (data) => {
//         setFormData(prevData => ({
//             ...prevData,
//             declaration: {
//                 ...prevData.declaration,
//                 ...data
//             }
//         }));
//     };

//     const steps = [
//         { id: "personal-details", component: <PersonalDetailsForm propertyName={property.name} updateFormData={updatePersonalData} /> },
//         { id: "business-details", component: <BusinessDetailsForm updateFormData={updateBusinessData} /> },
//         { id: "declaration", component: <DeclarationForm updateFormData={updateDeclarationData} /> }
//     ];

//     const submitFormData = () => {
//         console.log("Form Data:", formData);
//     };

//     const handleNextStep = (e) => {
//         e.preventDefault();
//         if (activeStep < steps.length - 1) {
//             setActiveStep(activeStep + 1);
//         } else {
//             setShowModal(true);
//         }
//     };

//     const handlePreviousStep = (e) => {
//         e.preventDefault();
//         if (activeStep > 0) {
//             setActiveStep(activeStep - 1);
//         }
//     };

//     const handleAccept = () => {
//         setShowModal(false);
//         submitFormData();
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//     };

//     return (
//         <GuestLayout>
//             <section className="bg-white dark:bg-gray-800 mt-5 md:mt-0 rounded-lg shadow-md">
//                 <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
//                     <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
//                         FILL THE APPLICATION FORM
//                     </h2>
//                     <form onSubmit={handleNextStep}>
//                         {steps[activeStep].component}
//                         <div className="flex justify-between mt-3">
//                             {activeStep > 0 && (
//                                 <PrimaryButton type="button" className="px-5 py-2.5" onClick={handlePreviousStep}>
//                                     Previous Step
//                                 </PrimaryButton>
//                             )}
//                             <PrimaryButton type="submit" className="px-5 py-2.5">
//                                 {activeStep === steps.length - 1 ? "Submit Application" : "Next Step"}
//                             </PrimaryButton>
//                         </div>
//                     </form>
//                     <Modal show={showModal} onClose={handleCloseModal}>
//                         <div className="relative">
//                             <div className="relative rounded-lg shadow-md bg-white dark:bg-gray-900">
//                                 <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
//                                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                                         Application Declaration
//                                     </h3>
//                                     <CloseButton onClick={handleCloseModal} />
//                                 </div>
//                                 <div className="p-4 md:p-5 space-y-4">
//                                     <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
//                                         The undersigned Applicant hereby declares that the representations of fact contained in the
//                                         foregoing application are true and correct. If any such representation is false, any lease
//                                         hereinafter entered into between Landlord and Applicant will have been made in reliance
//                                         upon such representation and may, at the option of the Landlord, be terminated at any time.
//                                     </p>
//                                     <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
//                                         I/We hereby authorize the verification of all above information by the Landlord. This
//                                         application does not constitute a contract, lease or agreement for space.
//                                     </p>
//                                 </div>
//                                 <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
//                                     <PrimaryButton type="button" className="px-5 py-2.5" 
//                                     onClick={handleAccept}>
//                                         I accept
//                                     </PrimaryButton>
//                                     <PrimaryButton type="button" className="py-2.5 px-5 ms-3 bg-red-500 hover:bg-red-700 hover:text-white" onClick={handleCloseModal}>
//                                         Decline
//                                     </PrimaryButton>
//                                 </div>
//                             </div>
//                         </div>
//                     </Modal>
//                 </div>
//             </section>
//         </GuestLayout>
//     );
// };


