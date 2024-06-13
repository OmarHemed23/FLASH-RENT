import FormField from "../FormField";

export default function BusinessDetailsForm({ updateFormData }) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateFormData({
            [name]: value
        });
    };

    const businessTypeOptions = [
        { value: "corporation", label: "Corporation" },
        { value: "partnership", label: "Partnership" },
        { value: "soleProprietor", label: "Sole Proprietor" },
        { value: "other", label: "Other" }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            <FormField label="Business Type" type="select" name="business-type" id="business-type" options={businessTypeOptions} required onChange={handleInputChange} />
            <FormField label="Years in business" type="number" name="years-in-business" id="years-in-business" placeholder="Active years in business" required onChange={handleInputChange} />
            <FormField label="Company Name" type="text" name="company-name" id="company-name" placeholder="Company name" required onChange={handleInputChange} />
            <FormField label="Company Address" type="text" name="company-address" id="company-address" placeholder="Company address" required onChange={handleInputChange} />
            <FormField label="Company Email" type="text" name="company-email" id="company-email" placeholder="Company Email" required onChange={handleInputChange} />
            <FormField label="Company Phone Number" type="text" name="company-phoneNo" id="company-phoneNO" placeholder="Company Phone Number" required onChange={handleInputChange} />
            <div className="md:col-span-2">
                <FormField label="Type of Business" type="text" name="business-type" id="business-type" placeholder="Type of business" required onChange={handleInputChange} />
            </div>
            <div className="md:col-span-2 mb-3">
                <FormField label="Description" type="textarea" id="description" placeholder="Your Business Activities Description" rows="8" onChange={handleInputChange} />
            </div>
        </div>
    );
};
