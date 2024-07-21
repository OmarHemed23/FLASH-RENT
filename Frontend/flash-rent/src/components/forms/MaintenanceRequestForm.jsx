import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from "../Modal";
import CloseButton from "../CloseButton";
import Label from "../Label";
import FormField from "../FormField";
import FileInput from "../FileInput";
import PrimaryButton from "../PrimaryButton";
import TextArea from "../TextArea";
import { useToken } from '../../hooks/useToken';

export default function MaintenanceRequestForm({ makingRequest, closeModal }) {
    const [property, setProperty] = useState('');
    const [issue, setIssue] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [propertyOptions, setPropertyOptions] = useState([]);
    const { token } = useToken();

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/tenant-properties/', {
                    headers: {
                        'Authorization': `token ${token}`
                    }
                });
                const properties = response.data.map(property => ({
                    value: property.property_id,
                    label: property.property_name
                }));
                setPropertyOptions(properties);
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();
    }, [token]);

    const handleFileChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('property', property);
        formData.append('issue', issue);
        formData.append('description', description);
        images.forEach((image, index) => {
            formData.append(`image${index + 1}`, image);
        });

        try {
            await axios.post('http://localhost:8000/api/maintenance-requests/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `token ${token}`,
                },
            });
            alert('Maintenance request submitted successfully.');
            closeModal();
        } catch (error) {
            console.error('Error submitting maintenance request:', error);
            alert('Error submitting maintenance request.');
        }
    };

    return (
        <Modal show={makingRequest} onClose={closeModal}>
            <div className="flex items-center justify-center">
                <div className="w-full mt-6 px-3 bg-white dark:bg-gray-900 shadow-md overflow-hidden md:rounded-lg">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                            Submit Maintenance Request
                        </h3>
                        <CloseButton onClick={closeModal} />
                    </div>
                    <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                        <div className="form-group mt-1">
                            <FormField
                                label="Property"
                                name="property"
                                id="property"
                                type="select"
                                options={propertyOptions}
                                value={property}
                                onChange={(e) => setProperty(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mt-1">
                            <FormField
                                label="Issue"
                                name="issue"
                                id="issue"
                                value={issue}
                                onChange={(e) => setIssue(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mt-1">
                            <Label htmlFor="description" value="Description:" />
                            <TextArea
                                rows="4"
                                id="description"
                                className="p-1 block w-full"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-1 mb-5">
                            <Label htmlFor="upload-file" value="Upload Images:" />
                            <FileInput multiple onChange={handleFileChange} />
                        </div>
                        <PrimaryButton type="submit" className="mt-2">
                            Submit
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </Modal>
    );
}

