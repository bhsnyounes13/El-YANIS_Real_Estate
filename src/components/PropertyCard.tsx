import { useNavigate } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, Tag } from 'lucide-react';
import { Property } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

export default function PropertyCard({ property, onClick }: PropertyCardProps) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const getTitle = () => {
    return (property as any).title || '';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleClick = () => {
    navigate(`/property/${property.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl card-3d cursor-pointer overflow-hidden group animate-fade-in"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={property.images?.[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'}
          alt={getTitle()}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
            {property.type === 'sale' ? t('search.sale') : t('search.rent')}
          </span>
          {property.status !== 'available' && (
            <span className="px-3 py-1 bg-gray-900/90 text-white text-xs font-semibold rounded-full capitalize backdrop-blur-sm">
              {property.status}
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 flex-1">
            {getTitle()}
          </h3>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{property.city}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.area_m2 && (
            <div className="flex items-center">
              <Maximize className="h-4 w-4 mr-1" />
              <span>{property.area_m2} m²</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          {property.price ? (
            <div className="flex items-center text-blue-600 dark:text-blue-400">
              <Tag className="h-4 w-4 mr-1" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">{formatPrice(property.price)}</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Tag className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{t('property.priceOnRequest')}</span>
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline transition-all hover:translate-x-1"
          >
            {t('property.viewDetails')}
          </button>
        </div>
      </div>
    </div>
  );
}
