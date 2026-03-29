import { Target, Shield, Heart, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('about.title')}</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('about.story.title')}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('about.story.paragraph1')}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('about.story.paragraph2')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('about.mission.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.mission.desc')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('about.values.transparency.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.values.transparency.desc')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <Heart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('about.values.customerFirst.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.values.customerFirst.desc')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('about.values.excellence.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.values.excellence.desc')}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('about.why.title')}</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t('about.why.listings')}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t('about.why.experience')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t('about.why.team')}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t('about.why.support')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t('about.why.personalized')}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t('about.why.personalizedDesc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {t('about.why.endToEnd')}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t('about.why.endToEndDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
