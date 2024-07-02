import { Menu, MenuButton, MenuItems } from '@headlessui/react';

export default function SearchFilter ({ title, items, renderItem }) {
    return (
        <Menu as="div" className="relative">
            <MenuButton>
                <div className={`w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:text-white`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 -ml-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" />
                    </svg>
                    {"Filter " + title}
                   <svg className="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </MenuButton>
            <MenuItems
                as="div"
                anchor="bottom end"
                className="mt-2 w-56 h-60 p-3 bg-white rounded-lg shadow-md dark:bg-gray-700 overflow-auto"
            >
                <h6 className="mb-3 text-sm p-2 border-b border-gray-300 dark:border-gray-100 font-medium text-gray-900 dark:text-white">
                    {title}
                </h6>
                <ul className="space-y-2 text-sm">
                    {items.map(renderItem)}
                </ul>
            </MenuItems>
        </Menu>
    );
};





// export default function SearchFilter({ value, className,  ...props }) {
//     return (

//     );
// };


