import { Mail, Phone, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/yanis.jpg"
                alt="EL-YANIS Real Estate Logo"
                className="h-10 w-10 object-contain rounded-lg"
              />
              <span className="ml-3 text-xl font-bold text-white">
                {t('site.name')}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {t('site.tagline')}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('contact.info.title')}</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-3 text-blue-400" />
                <span>0550835124</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-3 text-blue-400" />
                <span>elyanismo@gmail.com</span>
              </div>
              <a
                href="https://maps.app.goo.gl/rqZn1A8Vw3XSwFSe7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm hover:text-blue-400 transition-colors group"
              >
                <MapPin className="h-4 w-4 mr-3 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="group-hover:underline">Remchi, Tlemcen, Algeria</span>
              </a>
              <a
                href="https://wa.me/213550835124"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm hover:text-green-400 transition-colors group"
              >
                <MessageCircle className="h-4 w-4 mr-3 text-green-400 group-hover:scale-110 transition-transform" />
                <span className="group-hover:underline">WhatsApp</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('listings?type=sale')} className="hover:text-blue-400 transition-colors text-left">
                  {t('footer.propertiesSale')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('listings?type=rent')} className="hover:text-blue-400 transition-colors text-left">
                  {t('footer.propertiesRent')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('agents')} className="hover:text-blue-400 transition-colors text-left">
                  {t('footer.ourAgents')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-blue-400 transition-colors text-left">
                  {t('footer.aboutUs')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} {t('site.name')}. {t('footer.copyright')}
            </p>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-400 mr-3">{t('footer.followUs')}</span>
              <a
                href="https://www.facebook.com/elyanis73"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5 text-gray-300" />
              </a>
              <a
                href="https://www.instagram.com/_el_yanis/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5 text-gray-300" />
              </a>
              <a
                href="https://www.tiktok.com/@_elyanis"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-black rounded-lg flex items-center justify-center transition-all hover:scale-110"
                aria-label="Follow us on TikTok"
              >
                <svg
                  className="h-5 w-5 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
