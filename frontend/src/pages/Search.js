import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { movieApi } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await movieApi.searchMovies(query, 20);
      setResults(data);
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
            className="w-full sm:w-[120px]"
          >
            {loading ? '⏳' : '🔍'} {loading ? t('common.loading') : t('search.searchButton')}
          </Button>
        </div>
      </form>

      {/* 搜索结果 */}
      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {results.length} {t('search.results')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((movie) => (
              <Link
                key={movie.movieId}
                to={`/movie/${movie.movieId}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all p-4 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1"
              >
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-gray-100">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{movie.genres}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 空状态 */}
      {!loading && results.length === 0 && query && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {t('search.noResults')}
        </div>
      )}
    </div>
  );
}

export default Search;