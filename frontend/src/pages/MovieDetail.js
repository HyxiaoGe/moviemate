import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Star, Calendar, Clock, TrendingUp, Film, Users } from 'lucide-react';
import { movieApi } from '../services/api';
import { tmdbApi, tmdbCache } from '../services/tmdb';
import LoadingSpinner from '../components/LoadingSpinner';
import { MovieGridCard } from '../components/MovieCard';

function MovieDetail() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [tmdbData, setTmdbData] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tmdbLoading, setTmdbLoading] = useState(true);
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

        // 加载 TMDb 数据
        loadTmdbData(movieData.title);
      } catch (error) {
        console.error('Load failed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [movieId]);

  const loadTmdbData = async (title) => {
    setTmdbLoading(true);
    try {
      // 先检查缓存
      if (tmdbCache.has(title)) {
        setTmdbData(tmdbCache.get(title));
        setTmdbLoading(false);
        return;
      }

      // 从 TMDb 加载
      const data = await tmdbApi.searchMovie(title);
      if (data) {
        tmdbCache.set(title, data);
        setTmdbData(data);
      }
    } catch (error) {
      console.error('TMDb load failed:', error);
    } finally {
      setTmdbLoading(false);
    }
  };

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

  const genres = movie.genres ? movie.genres.split('|') : [];
  const backdropUrl = tmdbData?.images?.backdrop?.large;
  const posterUrl = tmdbData?.images?.poster?.large;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 返回按钮 */}
      <div>
        <Link
          to={-1}
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          返回
        </Link>
      </div>

      {/* 背景横幅 */}
      {backdropUrl && (
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-2xl">
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              {movie.title}
            </h1>
            {tmdbData?.releaseDate && (
              <p className="text-lg text-white/90 flex items-center gap-2">
                <Calendar size={18} />
                {tmdbData.releaseDate.split('-')[0]}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 主要内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：海报和基本信息 */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 border border-gray-100 dark:border-gray-700 sticky top-24">
            {/* 海报 */}
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full rounded-lg shadow-md mb-4"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center mb-4">
                <Film size={64} className="text-gray-400" />
              </div>
            )}

            {/* 标题（无背景图时显示） */}
            {!backdropUrl && (
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {movie.title}
              </h1>
            )}

            {/* 评分卡片 */}
            <div className="space-y-3 mb-4">
              {/* TMDb 评分 */}
              {tmdbData?.voteAverage && (
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2">
                    <Star size={20} className="text-yellow-500" fill="currentColor" />
                    <span className="font-semibold text-gray-900 dark:text-white">TMDb</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {tmdbData.voteAverage.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">/ 10</span>
                  </div>
                </div>
              )}

              {/* MovieLens ID */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">MovieLens ID</span>
                <span className="font-mono font-semibold text-gray-900 dark:text-white">
                  #{movie.movieId}
                </span>
              </div>
            </div>

            {/* 统计信息 */}
            {tmdbData && (
              <div className="space-y-2 text-sm">
                {tmdbData.releaseDate && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar size={16} className="text-indigo-500" />
                    <span>上映日期: {tmdbData.releaseDate}</span>
                  </div>
                )}
                {tmdbData.voteCount && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Users size={16} className="text-indigo-500" />
                    <span>{tmdbData.voteCount.toLocaleString()} 人评价</span>
                  </div>
                )}
                {tmdbData.popularity && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <TrendingUp size={16} className="text-indigo-500" />
                    <span>热度: {Math.round(tmdbData.popularity)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 右侧：详细信息 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 类型标签 */}
          {genres.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                <Film size={24} className="text-indigo-600 dark:text-indigo-400" />
                类型
              </h2>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 剧情简介 */}
          {tmdbData?.overview && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                剧情简介
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {tmdbData.overview}
              </p>
            </div>
          )}

          {/* 加载提示 */}
          {tmdbLoading && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                正在加载更多电影信息...
              </p>
            </div>
          )}

          {/* 无额外信息提示 */}
          {!tmdbLoading && !tmdbData && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                💡 暂无更多电影详情信息
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 相似电影推荐 */}
      {similarMovies.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Film size={28} className="text-indigo-600 dark:text-indigo-400" />
            相似电影推荐
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
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
  const [tmdbData, setTmdbData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTmdbData();
  }, [movie.title]);

  const loadTmdbData = async () => {
    if (tmdbCache.has(movie.title)) {
      setTmdbData(tmdbCache.get(movie.title));
      setLoading(false);
      return;
    }

    const data = await tmdbApi.searchMovie(movie.title);
    if (data) {
      tmdbCache.set(movie.title, data);
      setTmdbData(data);
    }
    setLoading(false);
  };

  return (
    <Link
      to={`/movie/${movie.movieId}`}
      className="group block"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* 海报 */}
        <div className="relative aspect-[2/3] bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-600">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            </div>
          ) : tmdbData?.images?.poster?.medium ? (
            <img
              src={tmdbData.images.poster.medium}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Film size={32} />
            </div>
          )}

          {/* 相似度徽章 */}
          <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-lg px-2 py-1 text-xs font-bold shadow-lg">
            {(movie.similarity * 100).toFixed(0)}%
          </div>
        </div>

        {/* 信息 */}
        <div className="p-2">
          <h3 className="font-semibold text-xs text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {movie.title}
          </h3>
          {tmdbData?.releaseDate && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {tmdbData.releaseDate.split('-')[0]}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default MovieDetail;
