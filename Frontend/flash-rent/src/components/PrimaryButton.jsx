export default function PrimaryButton ({type='button', className='', children, ...props}) {
    return (
        <button
            {...props}
            type={type}
            className={'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' 
            + className}
        >
            {children}
        </button>
    );
};