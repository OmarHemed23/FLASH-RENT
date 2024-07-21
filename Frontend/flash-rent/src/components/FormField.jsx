import Label from "./Label";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SelectInput from "./SelectInput";

export default function FormField ({ label, type = "text", name, id, placeholder, required = false, readOnly = false, rows, 
options = [], value, ...props }) {
    return (
        <div className="w-full">
            <Label htmlFor={id} className="mb-2">
                {label}
            </Label>
            {type === 'textarea' ? (
                <TextArea {...props} id={id} rows={rows} placeholder={placeholder} />
            ) : type === 'select' ? (
                <SelectInput
                    {...props}
                    id={id}
                    name={name}
                    options={options}
                    placeholder={placeholder}
                    required={required}
                    value={value}
                />
            ) : (
                <TextInput
                    {...props}
                    type={type}
                    name={name}
                    id={id}
                    className="block w-full p-2.5"
                    placeholder={placeholder}
                    required={required}
                    readOnly={readOnly}
                    value={value}
                />
            )}
        </div>
    );
};
