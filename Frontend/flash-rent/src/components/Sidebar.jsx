export default function Sidebar ({children, showingSidebar, className = ""}) {
    return (
        <aside className={`${showingSidebar ? "translate-x-0" : "-translate-x-full"} fixed top-0 left-0 z-40 w-64 h-screen pt-14
        transition-transform -translate-x-full bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg ${+ className}`}>
            <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
                {children}
            </div>
        </aside>
    );
};