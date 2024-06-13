import { Link } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';

export default function PropertyCard ({property}) {
  return (
    <div className="border border-gray-900 dark:border-gray-100 rounded-lg overflow-hidden shadow-md">
      <img src={property.image} alt={property.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{property.name}</h3>
        <p className="text-gray-900 dark:text-gray-100">{property.location}</p>
        <p className="text-gray-900 dark:text-gray-100">{property.rent}</p>
        <Link to={property.link}>
          <PrimaryButton className="mt-2 block">View Details</PrimaryButton>
        </Link>
      </div>
    </div>
  );
};
