import { useState } from 'react';
import { Mail, Phone, MapPin, Check, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from('inquiries').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });

      if (error) throw error;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`;
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {t('contact.info.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                {t('contact.info.desc')}
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{t('contact.phone')}</h3>
                    <a
                      href="tel:0550835124"
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      0550835124
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{t('contact.email')}</h3>
                    <a
                      href="mailto:elyanismo@gmail.com"
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      elyanismo@gmail.com
                    </a>
                  </div>
                </div>

                <a
                  href="https://maps.app.goo.gl/rqZn1A8Vw3XSwFSe7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start group cursor-pointer"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t('contact.office')}</h3>
                    <p className="text-gray-700 dark:text-gray-300 group-hover:underline">
                      Remchi<br />
                      Tlemcen, Algeria
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/213550835124"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start group cursor-pointer"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{t('contact.whatsapp')}</h3>
                    <p className="text-gray-700 dark:text-gray-300 group-hover:underline">
                      +213 550 835 124
                    </p>
                  </div>
                </a>
              </div>

              <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('contact.hours')}
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p>{t('contact.hours.weekdays')}</p>
                  <p>{t('contact.hours.saturday')}</p>
                  <p>{t('contact.hours.friday')}</p>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('contact.social.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                  {t('contact.social.desc')}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.facebook.com/elyanis73"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-gray-700 dark:text-gray-300 hover:text-white rounded-lg transition-all hover:scale-105 shadow-sm"
                  >
                    <Facebook className="h-5 w-5 mr-2" />
                    <span className="font-medium text-sm">Facebook</span>
                  </a>
                  <a
                    href="https://www.instagram.com/_el_yanis/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 text-gray-700 dark:text-gray-300 hover:text-white rounded-lg transition-all hover:scale-105 shadow-sm"
                  >
                    <Instagram className="h-5 w-5 mr-2" />
                    <span className="font-medium text-sm">Instagram</span>
                  </a>
                  <a
                    href="https://www.tiktok.com/@_elyanis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-black text-gray-700 dark:text-gray-300 hover:text-white rounded-lg transition-all hover:scale-105 shadow-sm"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    <span className="font-medium text-sm">TikTok</span>
                  </a>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('contact.form.title')}
                </h2>

                {submitted && (
                  <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                    <p className="text-green-800 dark:text-green-300">
                      {t('contact.form.success')}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('contact.form.name')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder={t('contact.form.placeholder.name')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('contact.form.email')} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder={t('contact.form.placeholder.email')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('contact.form.phone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder={t('contact.form.placeholder.phone')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('contact.form.message')} *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder={t('contact.form.placeholder.message')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || submitted}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {t('contact.form.sending')}
                      </>
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
      </section>
    </div>
  );
}
