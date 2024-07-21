import { Link } from "react-router-dom";
import logo from "../images/logo.png";

export default function Navbar({children, openSidebar,showingSidebar, className = ''}) {

    return (
        <nav className={"fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:border-gray-700 shadow-md dark:bg-gray-800" + className}>
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400"
                        onClick={openSidebar}>
                            <span className="w-6 h-6">
                                <svg className={!showingSidebar ? "inline-flex" : "hidden" } fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                                </svg>
                                <svg className={showingSidebar ? "inline-flex" : "hidden" } fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                                </svg>
                            </span>
                        </button>
                        <Link to="/" className="flex ms-2 md:me-24">
                            <img src={logo} alt="application logo" className="h-8 me-3 rounded-lg dark:bg-gray-300" />
                            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-gray-800 dark:text-gray-100">
                                FLASH RENT
                            </span>
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
        </nav>
    );
};