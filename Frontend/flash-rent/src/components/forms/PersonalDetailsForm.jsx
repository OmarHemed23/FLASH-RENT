import FormField from '../FormField';

export default function PersonalDetailsForm({ propertyName, updateFormData }) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateFormData({
            [name]: value
        });
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            <div className="md:col-span-2">
                <FormField label="Property Applying For" type="text" name="property-name" id="property-name" placeholder="Property Applying" value={propertyName} readOnly />
            </div>
            <FormField label="First Name" type="text" name="guest_first_name" id="guest_first_name" placeholder="Your First Name" required onChange={handleInputChange} />
            <FormField label="Last Name" type="text" name="guest_last_name" id="guest_last_name" placeholder="Your Last Name" required onChange={handleInputChange} />
            <FormField label="Email" type="email" name="email" id="email" placeholder="Your Email" required onChange={handleInputChange} />
            <FormField label="Phone Number" type="text" name="phone-number" id="phone-number" placeholder="Your Phone Number" required onChange={handleInputChange} />
            <FormField label="Address" type="text" name="address" id="address" placeholder="Your Address" required onChange={handleInputChange} />
            <FormField label="City" type="text" name="city" id="city" placeholder="Your City" required onChange={handleInputChange} />
        </div>
    );
};


