import Label from "./Label";

export default function Radio ({type="radio", label, className='', ...props}) {
    return (
        <div className={'inline-flex items-center ps-3' + className}>
            <input 
                {...props}
                type={type} 
                className="w-4 h-4 rounded-lg text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
                <Label className="ms-2">
                    {label}
                </Label>
        </div>
    );
};