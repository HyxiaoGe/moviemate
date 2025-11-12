import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { movieApi } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

function Home() {
  const [stats, setStats] = useState(null);
  const [userId, setUserId] = useState(1);
  const { t } = useTranslation();

  useEffect(() => {
    movieApi.getStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600 text-white rounded-2xl shadow-2xl p-8 md:p-16 text-center transform hover:scale-[1.01] transition-transform">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          {t('home.title')} 🎬
        </h1>
        <p className="text-lg md:text-2xl mb-10 text-white/90">
          {t('home.subtitle')}
        </p>
        
        {/* 快速开始 */}
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl p-6 md:p-8 max-w-md mx-auto shadow-xl">
          <label className="block text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
            {t('home.inputLabel')}
          </label>
          <div className="flex gap-3">
            <Input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="1"
              min="1"
              className="flex-1"
            />
            <Link to={`/recommendations?userId=${userId}`}>
              <Button>
                {t('home.getRecommendations')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 系统统计 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon="👥"
            title={t('home.stats.users')}
            value={stats.total_users}
            color="blue"
          />
          <StatCard 
            icon="🎬"
            title={t('home.stats.movies')}
            value={stats.total_movies}
            color="purple"
          />
          <StatCard 
            icon="⭐"
            title={t('home.stats.rating')}
            value={stats.global_mean_rating.toFixed(2)}
            color="yellow"
          />
        </div>
      )}

      {/* 功能介绍 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon="🎯"
          title={t('home.features.personalized.title')}
          description={t('home.features.personalized.desc')}
        />
        <FeatureCard
          icon="🔮"
          title={t('home.features.prediction.title')}
          description={t('home.features.prediction.desc')}
        />
        <FeatureCard
          icon="🔍"
          title={t('home.features.similar.title')}
          description={t('home.features.similar.desc')}
        />
      </div>
    </div>
  );
}

// 统计卡片组件
function StatCard({ icon, title, value, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
    purple: 'from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700',
    yellow: 'from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-xl p-8 text-center shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all`}>
      <div className="text-5xl mb-3">{icon}</div>
      <div className="text-4xl font-bold mb-2">{value.toLocaleString()}</div>
      <div className="text-sm font-medium text-white/90">{title}</div>
    </div>
  );
}

// 功能卡片组件
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

export default Home;