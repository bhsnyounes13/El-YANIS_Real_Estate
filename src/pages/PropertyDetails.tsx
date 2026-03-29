import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bed, Bath, Maximize, MapPin, Tag, Mail, Check } from 'lucide-react';
import AgentCard from '../components/AgentCard';
import AppointmentBooking from '../components/AppointmentBooking';
import { supabase, Property, Agent } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface PropertyDetailsProps {
  propertyId: string;
  onNavigate: (page: string) => void;
}

export default function PropertyDetails({ propertyId: propPropertyId, onNavigate }: PropertyDetailsProps) {
  const { id } = useParams();
  const propertyId = id || propPropertyId;
  const { language, t } = useLanguage();
  const [property, setProperty] = useState<Property | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const getTitle = () => {
    if (!property) return '';
    return (property as any).title || '';
  };

  const getDescription = () => {
    if (!property) return '';
    return (property as any).description || '';
  };

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .maybeSingle();

      if (propertyError) throw propertyError;
      setProperty(propertyData);

      if (propertyData?.agent_id) {
        const { data: agentData, error: agentError } = await supabase
          .from('agents')
          .select('*')
          .eq('id', propertyData.agent_id)
          .maybeSingle();

        if (agentError) throw agentError;
        setAgent(agentData);
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from('inquiries').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        property_id: propertyId,
      });

      if (error) throw error;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`;
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          propertyTitle: getTitle(),
          propertyId: propertyId,
        }),
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [property]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart(touch.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchEnd(touch.clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();

    setTouchStart(null);
    setTouchEnd(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Property not found</p>
          <button
            onClick={() => onNavigate('listings')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('listings')}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div
                className="relative h-96 bg-gray-200 dark:bg-gray-700"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={property.images?.[currentImageIndex] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'}
                  alt={getTitle()}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg';
                  }}
                />
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-900 dark:text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="h-6 w-6 text-gray-900 dark:text-white" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </div>

              {property.videos && property.videos.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      فيديوهات العقار
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.videos.map((videoUrl: string, index: number) => (
                        <div key={index} className="relative rounded-lg overflow-hidden bg-gray-900">
                          <video
                            src={videoUrl}
                            controls
                            preload="metadata"
                            className="w-full h-64 object-contain"
                            playsInline
                          >
                            المتصفح الخاص بك لا يدعم تشغيل الفيديو
                          </video>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full">
                        {property.type === 'sale' ? t('search.sale') : t('search.rent')}
                      </span>
                      {property.status !== 'available' && (
                        <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-full capitalize">
                          {property.status}
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {getTitle()}
                    </h1>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span className="text-lg">{property.city}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {property.price ? (
                      <div className="flex items-center text-blue-600 dark:text-blue-400">
                        <Tag className="h-6 w-6 mr-2" />
                        <span className="text-3xl font-bold">{formatPrice(property.price)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Tag className="h-6 w-6 mr-2" />
                        <span className="text-lg font-medium">{t('property.priceOnRequest')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 py-4 border-y border-gray-200 dark:border-gray-700 mb-6">
                  {property.bedrooms && (
                    <div className="flex items-center">
                      <Bed className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {property.bedrooms} {t('property.bedrooms')}
                      </span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center">
                      <Bath className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {property.bathrooms} {t('property.bathrooms')}
                      </span>
                    </div>
                  )}
                  {property.area_m2 && (
                    <div className="flex items-center">
                      <Maximize className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {property.area_m2} m²
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('property.description')}</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {getDescription()}
                  </p>
                </div>

                {property.amenities.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('property.amenities')}</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                          <Check className="h-5 w-5 mr-2 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {agent && (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('property.contactAgent')}</h2>
                  <AgentCard agent={agent} />
                </div>

                <AppointmentBooking
                  propertyId={propertyId}
                  agentId={agent.id}
                  agentName={agent.name}
                />
              </>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('contact.form.title')}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('contact.form.phone')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || submitted}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  {submitting ? (
                    t('contact.form.sending')
                  ) : submitted ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      {t('contact.form.sent')}
                    </>
                  ) : (
                    <>
                      <Mail className="h-5 w-5 mr-2" />
                      {t('contact.form.send')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
