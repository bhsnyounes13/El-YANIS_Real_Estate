import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { supabase, Property } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface ListingsProps {
  onNavigate: (page: string, propertyId?: string) => void;
}

export default function Listings({ onNavigate }: ListingsProps) {
  const { t } = useLanguage();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    city: 'all',
    minPrice: '',
    maxPrice: '',
    bedrooms: 'all',
    bathrooms: 'all',
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('properties')
        .select('*, agent:agents(*)')
        .eq('status', 'available');

      if (filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      if (filters.city !== 'all') {
        query = query.eq('city', filters.city);
      }

      if (filters.bedrooms !== 'all') {
        query = query.eq('bedrooms', parseInt(filters.bedrooms));
      }

      if (filters.bathrooms !== 'all') {
        query = query.eq('bathrooms', parseInt(filters.bathrooms));
      }

      if (filters.minPrice) {
        query = query.gte('price', parseFloat(filters.minPrice));
      }

      if (filters.maxPrice) {
        query = query.lte('price', parseFloat(filters.maxPrice));
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,city.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      city: 'all',
      minPrice: '',
      maxPrice: '',
      bedrooms: 'all',
      bathrooms: 'all',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t('listings.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {loading ? t('listings.loading') : `${properties.length} ${t('listings.subtitle')}`}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-80 flex-shrink-0`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Keyword or city..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Property Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="all">{t('search.allTypes')}</option>
                    <option value="sale">{t('search.sale')}</option>
                    <option value="rent">{t('search.rent')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="all">{t('search.allCities')}</option>
                    <option value="Tlemcen">{t('city.tlemcen')}</option>
                    <option value="Ain Temouchent">{t('city.aintemouchent')}</option>
                    <option value="Sidi Bel Abbès">{t('city.sidibelabbes')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price Range (DZD)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bedrooms
                  </label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="all">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bathrooms
                  </label>
                  <select
                    value={filters.bathrooms}
                    onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="all">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {t('listings.noResults')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onClick={() => onNavigate('property', property.id)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
