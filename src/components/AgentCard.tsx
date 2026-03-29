import { Mail, Phone } from 'lucide-react';
import { Agent } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface AgentCardProps {
  agent: Agent;
  propertyCount?: number;
}

export default function AgentCard({ agent, propertyCount = 0 }: AgentCardProps) {
  const { language, t } = useLanguage();

  const getBio = () => {
    if (language === 'ar') return agent.bio_ar || agent.bio_en;
    if (language === 'fr') return agent.bio_fr || agent.bio_en;
    return agent.bio_en;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all p-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-blue-100 dark:ring-blue-900/30">
          <img
            src={agent.photo || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'}
            alt={agent.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {agent.name}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {getBio()}
        </p>

        <div className="w-full space-y-2 mb-4">
          <a
            href={`mailto:${agent.email}`}
            className="flex items-center justify-center text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Mail className="h-4 w-4 mr-2" />
            {agent.email}
          </a>
          <a
            href={`tel:${agent.phone}`}
            className="flex items-center justify-center text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Phone className="h-4 w-4 mr-2" />
            {agent.phone}
          </a>
        </div>

        {propertyCount > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-lg">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {propertyCount}
            </span>{' '}
            {t('agents.properties')}
          </div>
        )}
      </div>
    </div>
  );
}
