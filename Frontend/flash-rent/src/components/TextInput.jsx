import { useEffect, useRef } from 'react';

export default function TextInput({ type = 'text', className = '', isFocused = false, ...props }) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isFocused) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 ' +
                'dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ' +
                className
            }
            ref={inputRef}
        />
    );
};

