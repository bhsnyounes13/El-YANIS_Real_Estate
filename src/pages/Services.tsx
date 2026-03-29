import { Calculator, Users, Scale, CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Calculator,
      title: t('services.estimation.title'),
      description: t('services.estimation.desc'),
      features: [
        t('services.estimation.feature1'),
        t('services.estimation.feature2'),
        t('services.estimation.feature3'),
        t('services.estimation.feature4'),
      ],
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    },
    {
      icon: Users,
      title: t('services.accompagnement.title'),
      description: t('services.accompagnement.desc'),
      features: [
        t('services.accompagnement.feature1'),
        t('services.accompagnement.feature2'),
        t('services.accompagnement.feature3'),
        t('services.accompagnement.feature4'),
      ],
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
    },
    {
      icon: Scale,
      title: t('services.conseil.title'),
      description: t('services.conseil.desc'),
      features: [
        t('services.conseil.feature1'),
        t('services.conseil.feature2'),
        t('services.conseil.feature3'),
        t('services.conseil.feature4'),
      ],
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-800 dark:via-blue-900 dark:to-blue-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {t('services.title')}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('services.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`h-2 bg-gradient-to-r ${service.gradient}`}></div>

                <div className="p-8">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.bgGradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`h-8 w-8 bg-gradient-to-br ${service.gradient} bg-clip-text text-transparent`} strokeWidth={2} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {service.title}
                  </h3>

                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircle className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 bg-gradient-to-br ${service.gradient} bg-clip-text text-transparent`} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="https://wa.me/213550835124"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r ${service.gradient} text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 group`}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {t('services.contactUs')}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('services.cta.title')}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                {t('services.cta.desc')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://wa.me/213550835124"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {t('services.cta.whatsapp')}
              </a>
              <a
                href="tel:0550835124"
                className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <span className="text-2xl mr-2">📞</span>
                {t('services.cta.call')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('services.why.title')}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12">
              {t('services.why.desc')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('services.why.expertise')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('services.why.expertiseDesc')}
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('services.why.fast')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('services.why.fastDesc')}
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('services.why.quality')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('services.why.qualityDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
