import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, Star, TrendingUp, Info } from 'lucide-react';
import { tmdbApi, tmdbCache } from '../services/tmdb';

/**
 * 电影卡片组件 - 显示电影海报和详细信息
 */
function MovieCard({ movie, rank, showRank = true }) {
  const [tmdbData, setTmdbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadTmdbData();
  }, [movie.title]);

  const loadTmdbData = async () => {
    setLoading(true);

    // 先检查缓存
    if (tmdbCache.has(movie.title)) {
      setTmdbData(tmdbCache.get(movie.title));
      setLoading(false);
      return;
    }

    // 从 TMDb 加载
    const data = await tmdbApi.searchMovie(movie.title);
    if (data) {
      tmdbCache.set(movie.title, data);
      setTmdbData(data);
    }
    setLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      <div className="flex flex-col sm:flex-row gap-4 h-full">
        {/* 电影海报 */}
        <div className="relative w-full sm:w-48 h-64 sm:h-auto flex-shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : tmdbData?.images?.poster?.medium && !imageError ? (
            <>
              <img
                src={tmdbData.images.poster.medium}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={handleImageError}
                loading="lazy"
              />
              {/* 渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Film size={48} />
              <p className="mt-2 text-sm">暂无海报</p>
            </div>
          )}

          {/* 排名徽章 */}
          {showRank && rank && (
            <div className="absolute top-3 left-3 bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
              {rank}
            </div>
          )}

          {/* TMDb 评分徽章 */}
          {tmdbData?.voteAverage && (
            <div className="absolute top-3 right-3 bg-yellow-500 text-white rounded-lg px-2 py-1 flex items-center gap-1 text-sm font-semibold shadow-lg">
              <Star size={14} fill="white" />
              {tmdbData.voteAverage.toFixed(1)}
            </div>
          )}
        </div>

        {/* 电影信息 */}
        <div className="flex-1 p-4 flex flex-col min-w-0">
          {/* 标题 - 最多显示2行 */}
          <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {movie.title}
          </h3>

          {/* 简介 - 最多显示2行，如果没有简介则不占空间 */}
          {tmdbData?.overview && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {tmdbData.overview}
            </p>
          )}

          {/* 标签信息 */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* 类型 - 只显示第一个类型 */}
            {movie.genres && (
              <span className="px-2 md:px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium truncate max-w-[120px]">
                {movie.genres.split('|')[0]}
              </span>
            )}

            {/* 年份 */}
            {tmdbData?.releaseDate && (
              <span className="px-2 md:px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                {tmdbData.releaseDate.split('-')[0]}
              </span>
            )}

            {/* 热度 - 在小屏幕上隐藏 */}
            {tmdbData?.popularity && (
              <span className="hidden md:inline-flex px-2 md:px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium items-center gap-1">
                <TrendingUp size={12} />
                {Math.round(tmdbData.popularity)}
              </span>
            )}
          </div>

          {/* 评分对比 */}
          <div className="flex items-center gap-3 md:gap-6 mb-4 flex-wrap">
            {/* AI 预测评分 */}
            <div className="flex flex-col">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 whitespace-nowrap">AI 预测</div>
              <div className="flex items-center gap-1">
                <Star size={18} className="md:w-5 md:h-5 text-indigo-500" fill="currentColor" />
                <span className="text-base md:text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {movie.predicted_rating?.toFixed(1) || 'N/A'}
                </span>
              </div>
            </div>

            {/* TMDb 评分 */}
            {tmdbData?.voteAverage && (
              <>
                <div className="h-8 md:h-10 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex flex-col">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 whitespace-nowrap">TMDb 评分</div>
                  <div className="flex items-center gap-1">
                    <Star size={18} className="md:w-5 md:h-5 text-yellow-500" fill="currentColor" />
                    <span className="text-base md:text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      {tmdbData.voteAverage.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                      ({tmdbData.voteCount.toLocaleString()})
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2 mt-auto">
            <Link
              to={`/movie/${movie.movieId}`}
              className="flex-1 px-3 md:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium text-sm md:text-base"
            >
              <Info size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="whitespace-nowrap">查看详情</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 电影网格布局卡片（更紧凑的版本）
 */
export function MovieGridCard({ movie, rank, showRank = true }) {
  const [tmdbData, setTmdbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* 海报 */}
        <div className="relative aspect-[2/3] bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-600">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : tmdbData?.images?.poster?.medium && !imageError ? (
            <img
              src={tmdbData.images.poster.medium}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Film size={40} />
            </div>
          )}

          {/* 排名 */}
          {showRank && rank && (
            <div className="absolute top-2 left-2 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
              {rank}
            </div>
          )}

          {/* 评分 */}
          {movie.predicted_rating && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white rounded px-2 py-1 flex items-center gap-1 text-xs font-semibold backdrop-blur-sm">
              <Star size={12} fill="white" />
              {movie.predicted_rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* 信息 */}
        <div className="p-3">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
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

export default MovieCard;
