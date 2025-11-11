import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { movieApi } from '../services/api';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await movieApi.searchMovies(query, 20);
      setResults(data);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 搜索框 */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索电影..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? '搜索中...' : '🔍 搜索'}
          </button>
        </div>
      </form>

      {/* 搜索结果 */}
      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            找到 {results.length} 个结果
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((movie) => (
              <Link
                key={movie.movieId}
                to={`/movie/${movie.movieId}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4"
              >
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-600">{movie.genres}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 空状态 */}
      {!loading && results.length === 0 && query && (
        <div className="text-center py-12 text-gray-500">
          没有找到相关电影
        </div>
      )}
    </div>
  );
}

export default Search;