import { useState, useEffect } from 'react';
import AgentCard from '../components/AgentCard';
import { supabase, Agent } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

export default function Agents() {
  const { t } = useLanguage();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [propertyCounts, setPropertyCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data: agentsData, error: agentsError } = await supabase
        .from('agents')
        .select('*')
        .order('name');

      if (agentsError) throw agentsError;
      setAgents(agentsData || []);

      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('agent_id')
        .eq('status', 'available');

      if (propertiesError) throw propertiesError;

      const counts: Record<string, number> = {};
      propertiesData?.forEach((property) => {
        if (property.agent_id) {
          counts[property.agent_id] = (counts[property.agent_id] || 0) + 1;
        }
      });
      setPropertyCounts(counts);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('agents.title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('agents.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : agents.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No agents available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                propertyCount={propertyCounts[agent.id] || 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
