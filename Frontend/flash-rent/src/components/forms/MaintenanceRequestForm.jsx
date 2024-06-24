import Modal from "../Modal";
import CloseButton from "../CloseButton";
import Label from "../Label";
import FormField from "../FormField";
import FileInput from "../FileInput";
import PrimaryButton from "../PrimaryButton";
import TextArea from "../TextArea";

export default function MaintenanceRequestForm ({makingRequest, closeModal}) {
    const propertyOptions = [
        { value: "Mwembe Tayri Mall", label: "Mwembe Tayari Mall" },
        { value: "partnership", label: "Partnership" },
        { value: "soleProprietor", label: "Sole Proprietor" },
        { value: "other", label: "Other" }
    ];
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
                    <form className="p-4 md:p-5">
                        <div className="form-group mt-1">
                            <FormField label="Property" name="property" id="property" type="select" options={propertyOptions}/>
                        </div>
                        <div className="form-group mt-1">
                            <FormField label="Issue" name="issue" id="issue" required/>
                        </div>
                        <div className="form-group mt-1">
                            <Label htmlFor="description" value="Description:" />
                            <TextArea
                            rows="4"
                            id="description"
                            className="p-1 block w-full"
                            />
                        </div>
                        <div className="form-group mt-1 mb-5">
                            <Label htmlFor="upload-file" value="Upload Image:" />
                            <FileInput />
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