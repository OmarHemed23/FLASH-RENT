export default function PrimaryButton ({type='button', className='', children, ...props}) {
    return (
        <button
            {...props}
            type={type}
            className={'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800' 
            + className}
        >
            {children}
        </button>
    );
};