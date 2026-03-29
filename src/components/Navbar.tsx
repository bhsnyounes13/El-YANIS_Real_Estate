import { Home, Building2, Users, Info, Mail, Moon, Sun, Languages, Briefcase } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: t('nav.home'), icon: Home, path: '/' },
    { id: 'listings', label: t('nav.listings'), icon: Building2, path: '/listings' },
    { id: 'services', label: t('nav.services'), icon: Briefcase, path: '/services' },
    { id: 'agents', label: t('nav.agents'), icon: Users, path: '/agents' },
    { id: 'about', label: t('nav.about'), icon: Info, path: '/about' },
    { id: 'contact', label: t('nav.contact'), icon: Mail, path: '/contact' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center cursor-pointer group">
            <img
              src="/yanis.jpg"
              alt="EL-YANIS Real Estate Logo"
              className="h-12 w-12 object-contain group-hover:scale-110 transition-transform rounded-lg"
            />
            <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
              {t('site.name')}
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ id, label, icon: Icon, path }) => (
              <Link
                key={id}
                to={path}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === path
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative group">
              <button
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center"
                aria-label="Change language"
              >
                <Languages className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {language.toUpperCase()}
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button
                  onClick={() => setLanguage('en')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg ${
                    language === 'en' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('ar')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    language === 'ar' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  العربية
                </button>
                <button
                  onClick={() => setLanguage('fr')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg ${
                    language === 'fr' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Français
                </button>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        <div className="md:hidden flex items-center space-x-1 pb-3 overflow-x-auto">
          {navItems.map(({ id, label, icon: Icon, path }) => (
            <Link
              key={id}
              to={path}
              className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                location.pathname === path
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="h-3 w-3 mr-1.5" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
