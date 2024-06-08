import { NavLink } from "react-router-dom";

export default function CustomNavLink({ className = '', children, ...props }) {
    return (
        <NavLink
            {...props}
            className={
                'inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ml-3 ' +
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300 dark:text-gray-100 dark:hover:text-white ' +
                className
            }
            activeClassName="border-indigo-400 text-gray-900 focus:border-indigo-700"
        >
            {children}
        </NavLink>
    );
};


