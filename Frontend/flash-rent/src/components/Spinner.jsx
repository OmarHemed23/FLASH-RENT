export default function Spinner ({className}) {
    return (
        <div className={`fixed top-0 left-0 z-50 overflow-hidden flex items-center justify-center w-full h-screen text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900` + className}>
            <div>
                <h1 className="text-xl md:text-7xl font-bold flex items-center">
                    Lo
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        className="animate-spin"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 2.1L1 12h3v9h5v-6h4v6h5v-9h3L12 2.1zm-1 13v-5h2v5h-2z"/>
                    </svg>
                    ding . . .
                </h1>
            </div>  
        </div>
    );
};