import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { movieApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

function MovieDetail() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [movieData, similarData] = await Promise.all([
          movieApi.getMovieInfo(movieId),
          movieApi.getSimilarMovies(movieId, 6)
        ]);
        setMovie(movieData);
        setSimilarMovies(similarData);
      } catch (error) {
        console.error('Load failed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [movieId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!movie) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {t('movieDetail.error')}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 电影详情 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft size={20} />
            {t('nav.home')}
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {movie.title}
        </h1>
        
        <div className="flex items-center gap-4 mb-6">
          <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium">
            {movie.genres}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t('movieDetail.genres')}
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong>ID:</strong> {movie.movieId}</p>
              <p><strong>{t('movieDetail.genres')}:</strong> {movie.genres}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 相似电影 */}
      {similarMovies.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {t('movieDetail.similarMovies')} 🎬
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {similarMovies.map((similar) => (
              <SimilarMovieCard key={similar.movieId} movie={similar} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 相似电影卡片
function SimilarMovieCard({ movie }) {
  const { t } = useTranslation();
  
  return (
    <Link
      to={`/movie/${movie.movieId}`}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all p-4 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1"
    >
      <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-gray-100">
        {movie.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{movie.genres}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
          {t('movieDetail.similarity')}: {(movie.similarity * 100).toFixed(1)}%
        </span>
      </div>
    </Link>
  );
}

export default MovieDetail;