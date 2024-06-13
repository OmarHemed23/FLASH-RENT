import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../hooks/useSideBar";
import CustomNavLink from "../components/NavLink";
import ResponsiveNavLink from "../components/ResponsiveNavLink";
import logo from "../images/logo.png";

export default function GuestLayout ({children, showingNavigation = true}) {
    const { showingSidebar, openSidebar, closeSidebar } = useSidebar();

    const NavbarLinks = [
        { path: "/", name: "Home" },
        { path: "about", name: "About" },
        { path: "/auth/login", name: "Login"}
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {showingNavigation && (
                <>
                <Navbar openSidebar={openSidebar} showingSidebar={showingSidebar}>
                    <div className="hidden md:flex md:items-center">
                        {NavbarLinks.map((link, index) => (
                            <CustomNavLink key={index} to={link.path} className="inline-flex items-center px-1 pt-1 dark:text-gray-100">
                                {link.name}
                            </CustomNavLink>
                        ))}
                    </div>
                </Navbar>
                <Sidebar showingSidebar={showingSidebar} className="md:hidden">
                    {NavbarLinks.map((link, index) => (
                        <ResponsiveNavLink key={index} to={link.path} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            {link.name}
                        </ResponsiveNavLink>
                    ))}
                </Sidebar>
                <main className="flex flex-col pt-6 p-6 md:p-10 space-y-6 mt-10" onClick={closeSidebar}>
                    {children}
                </main>
                </>
            )}
            {!showingNavigation && (
                <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
                    <div className="dark:bg-gray-100 rounded-full">
                        <Link to="/">
                            <img src={logo} alt="" className="w-20 h-20" />
                        </Link>
                    </div>
                    <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};