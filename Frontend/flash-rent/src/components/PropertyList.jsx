import { Link } from "react-router-dom";

export default function PropertyList ({ properties }) {
  return (
    <ul className="w-full p-4 divide-y divide-gray-200 dark:divide-gray-700">
      {properties.map((property) => (
        <li key={property.id} className="py-3 sm:py-4">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex-shrink-0">
              <img className="w-12 h-12 rounded-full" src={property.image} alt={`${property.name} image`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                {property.name}
              </p>
              <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                {property.location}
              </p>
            </div>
            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                Monthly Rent: {property.monthlyRent}
            </div>
            <div className="ml-auto text-base font-semibold text-gray-900 dark:text-white">
                <Link>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 320 512" fill="currentColor">
                        <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                    </svg>
                </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
