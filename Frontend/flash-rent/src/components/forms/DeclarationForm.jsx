import FormField from "../FormField";
import Radio from "../Radio";

export default function DeclarationForm({ updateFormData, className = '' }) {
    const questions = [
        {
            label: "a. breached a rental/lease agreement?",
            name: "breached-agreement",
        },
        {
            label: "b. been sued for nonpayment of rent?",
            name: "nonpayment-rent",
        },
        {
            label: "c. been sued for damages to rental property?",
            name: "damages-rental",
        },
        {
            label: "d. declared bankruptcy?",
            name: "declared-bankruptcy",
        },
        {
            label: "e. been evicted?",
            name: "been-evicted",
        },
        {
            label: "f. Is Applicant or any above officer(s) or Partner(s) involved in any litigation?",
            name: "involved-litigation",
        },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateFormData({
            [name]: value
        });
    };

    return (
        <div className={`grid gap-4 md:grid-cols-2 md:gap-6 ${className}`}>
            <div className="md:col-span-2">
                <p className="text-gray-900 dark:text-white">
                    Has the applicant (under the above name or any other name) or any officer, partner or
                    affiliate of Applicant ever:
                </p>
            </div>
            {questions.map((question, index) => (
                <div key={index} className="md:col-span-2 mb-3">
                    <p className="text-gray-900 dark:text-white mb-2">
                        {question.label}
                    </p>
                    <div className="flex items-center mb-2">
                        <Radio name={question.name} label="Yes" onChange={handleInputChange} />
                        <Radio name={question.name} label="No" onChange={handleInputChange} />
                    </div>
                    <FormField
                        type="textarea"
                        name={`${question.name}-explanation`}
                        placeholder="If Yes, explain"
                        rows={3}
                        onChange={handleInputChange}
                    />
                </div>
            ))}
        </div>
    );
};

