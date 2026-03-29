import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Users, Award } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { supabase, Property } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  onNavigate: (page: string, propertyId?: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*, agent:agents(*)')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setFeaturedProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedType !== 'all') params.set('type', selectedType);
    if (selectedCity !== 'all') params.set('city', selectedCity);
    navigate('/listings?' + params.toString());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 dark:from-blue-800 dark:via-blue-900 dark:to-cyan-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.1s'}}>
              {t('hero.subtitle')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 md:p-6 animate-scale-in" style={{animationDelay: '0.2s'}}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="md:col-span-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">{t('search.allTypes')}</option>
                <option value="sale">{t('search.sale')}</option>
                <option value="rent">{t('search.rent')}</option>
              </select>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">{t('search.allCities')}</option>
                <option value="Tlemcen">{t('city.tlemcen')}</option>
                <option value="Ain Temouchent">{t('city.aintemouchent')}</option>
                <option value="Sidi Bel Abbès">{t('city.sidibelabbes')}</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              <Search className="h-5 w-5 mr-2" />
              {t('search.button')}
            </button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center group animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('features.premium.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('features.premium.desc')}
              </p>
            </div>
            <div className="text-center group animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('features.experts.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('features.experts.desc')}
              </p>
            </div>
            <div className="text-center group animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('features.trusted.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('features.trusted.desc')}
              </p>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('featured.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('featured.subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => onNavigate('property', property.id)}
                />
              ))}
            </div>
          )}

          {!loading && featuredProperties.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={() => onNavigate('listings')}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                {t('featured.viewAll')}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
