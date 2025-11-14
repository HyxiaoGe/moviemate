import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { movieApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import MovieCard from '../components/MovieCard';

function Recommendations({ userId: propUserId, onUserIdChange }) {
  const [searchParams] = useSearchParams();
  const userId = propUserId || parseInt(searchParams.get('userId')) || 1;
  const { t } = useTranslation();
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await movieApi.getRecommendations(userId, 10);
      setRecommendations(data);
    } catch (err) {
      setError(t('recommendations.error') + ': ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 当 userId 变化时，通知父组件更新导航栏的用户ID
    if (onUserIdChange && userId !== propUserId) {
      onUserIdChange(userId);
    }
    loadRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={loadRecommendations} className="w-[100px]">
          🔄 {t('common.retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 页头 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('recommendations.title')} 🎯
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            {t('nav.user')} {userId}
          </p>
        </div>
        <Button onClick={loadRecommendations} variant="secondary" className="w-auto min-w-[100px] flex-shrink-0 whitespace-nowrap">
          🔄 {t('recommendations.refresh')}
        </Button>
      </div>

      {/* 推荐列表 */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {recommendations.map((movie, index) => (
          <MovieCard key={movie.movieId} movie={movie} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}

export default Recommendations;