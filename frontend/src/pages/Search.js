import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { movieApi } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { MovieGridCard } from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CACHE_KEY = 'moviemate_search_cache';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // 页面加载时恢复缓存的搜索结果
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { query: cachedQuery, results: cachedResults, timestamp } = JSON.parse(cached);
        // 缓存有效期 30 分钟
        const cacheAge = Date.now() - timestamp;
        if (cacheAge < 30 * 60 * 1000) {
          setQuery(cachedQuery);
          setResults(cachedResults);
        } else {
          // 缓存过期，清除
          sessionStorage.removeItem(CACHE_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to restore cache:', error);
      sessionStorage.removeItem(CACHE_KEY);
    }
  }, []);

  // 保存搜索结果到缓存
  const saveToCache = (searchQuery, searchResults) => {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        query: searchQuery,
        results: searchResults,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Failed to save cache:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await movieApi.searchMovies(query, 20);
      setResults(data);
      // 保存搜索结果到缓存
      saveToCache(query, data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 搜索框 */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto min-w-[120px] whitespace-nowrap flex-shrink-0"
          >
            <span className="flex items-center justify-center gap-2">
              <span>{loading ? '⏳' : '🔍'}</span>
              <span>{loading ? t('common.loading') : t('search.searchButton')}</span>
            </span>
          </Button>
        </div>
      </form>

      {/* 加载中状态 */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* 搜索结果 */}
      {!loading && results.length > 0 && (
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-gray-100">
            {t('search.foundResults', { count: results.length })} {results.length} {t('search.results')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {results.map((movie) => (
              <MovieGridCard
                key={movie.movieId}
                movie={movie}
                showRank={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* 空状态 */}
      {!loading && results.length === 0 && query && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
            {t('search.noResults')}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            试试其他关键词
          </p>
        </div>
      )}

      {/* 初始状态 */}
      {!loading && results.length === 0 && !query && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
            搜索你喜欢的电影
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            输入电影名称开始搜索
          </p>
        </div>
      )}
    </div>
  );
}

export default Search;
