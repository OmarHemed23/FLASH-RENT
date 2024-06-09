import { useState, createContext, useContext, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';

const DropdownContext = createContext();

const Dropdown = ({children}) => {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => {
        setOpen((previousState) => ! previousState);
    };
    return (
        <DropdownContext.Provider value={{open, setOpen, toggleOpen}}>
            <div className="relative">{children}</div>
        </DropdownContext.Provider>
    );
};

const Trigger = ({children}) => {
    const { open, setOpen, toggleOpen } = useContext(DropdownContext);
    return (
        <>
            <div onClick={toggleOpen}>{children}</div>

            {open && <div className="fixed inset-0 z-50" onClick={() => setOpen(false)}></div>}
        </>
    );
};

const Content = ({ align = 'right', width = '', contentClasses = 'py-1', children }) => {
    const { open, setOpen } = useContext(DropdownContext);
    let alignmentClasses = 'origin-top';

    if (align === 'left') {
        alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right start-0';
    } else if (align === 'right') {
        alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left end-0';
    }
    let widthClasses = '';

    if (width === '48') {
        widthClasses = 'w-48';
    } else if (width === '64') {
        widthClasses = 'w-64';
    } else if (width === '96') {
        widthClasses = 'w-96';
    } else {
        widthClasses = 'max-w-sm'
    }
    return (
        <>
            <Transition
                as={Fragment}
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div
                    className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
                    onClick={() => setOpen(true)}
                >
                    <div className={`rounded-md ring-1 ring-black ring-opacity-5 ` + contentClasses}>{children}</div>
                </div>
            </Transition>
        </>
    );
};
const DropdownLink = ({ className = '', children, ...props }) => {
    return (
        <Link 
            {...props}
            className={'block w-full px-4 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out' + className}
        
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;



