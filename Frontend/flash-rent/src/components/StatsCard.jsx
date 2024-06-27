export default function StatsCard ({icon, title, children, bgColor = "white"}) {
    let bgColorClassName = "";

    if (bgColor === "white") {
        bgColorClassName = "bg-white";
    } else if (bgColor === "green") {
        bgColorClassName = "bg-green-300";
    } else if (bgColor === "blue") {
        bgColorClassName = "bg-blue-300";
    } else if (bgColor === "gray") {
        bgColorClassName = "bg-gray-300"
    }
    return (
        <div className={`p-8 h-30 md:h-64 flex items-center justify-center shadow-md rounded-lg ${bgColorClassName}`}>
            <div className="inline-flex flex-shrink-0 items-center justify-center rounded-lg mr-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-10 w-10 text-gray-900" viewBox="0 0 576 512">
                    <path d={icon}/>
                </svg>
            </div>
            <div className="ml-5">
                <h2 className="block text-lg font-bold">{title}</h2>
                {children}
            </div>  
        </div>
    );
};