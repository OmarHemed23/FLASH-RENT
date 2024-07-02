import { Link } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';

export default function PropertyCard ({property}) {
  const link = `/property/${property.name}`
  return (
    <div className="border border-gray-900 dark:border-gray-100 rounded-lg overflow-hidden shadow-md">
      <img src={property.image1} alt={property.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{property.name}</h3>
        <p className="text-gray-900 dark:text-gray-100">Monthly Rent: Ksh. {property.rent_amount}</p>
        <Link to={link} className="p-1.5">
          <PrimaryButton className="mt-2 block">View Details</PrimaryButton>
        </Link>
      </div>
    </div>
  );
};
