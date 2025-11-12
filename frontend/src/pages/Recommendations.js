import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { movieApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';

function Recommendations({ userId: propUserId }) {
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
    loadRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Button onClick={loadRecommendations} className="mt-4">
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 页头 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('recommendations.title')} 🎯
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('nav.user')} {userId}
          </p>
        </div>
        <Button onClick={loadRecommendations} variant="secondary" minWidth>
          🔄 {t('recommendations.refresh')}
        </Button>
      </div>

      {/* 推荐列表 */}
      <div className="grid grid-cols-1 gap-4">
        {recommendations.map((movie, index) => (
          <MovieCard key={movie.movieId} movie={movie} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}

// 电影卡片组件
function MovieCard({ movie, rank }) {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-start gap-4">
        {/* 排名 */}
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
          {rank}
        </div>

        {/* 电影信息 */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
              {movie.genres}
            </span>
          </div>

          {/* 预测评分 */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-500 text-lg">
              {'⭐'.repeat(Math.round(movie.predicted_rating))}
            </span>
            <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {movie.predicted_rating.toFixed(2)}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {t('recommendations.predictedRating')}
            </span>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Link to={`/movie/${movie.movieId}`}>
              <Button size="sm" minWidth>
                📄 {t('recommendations.viewDetails')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recommendations;