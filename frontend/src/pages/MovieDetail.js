import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movieApi } from '../services/api';

function MovieDetail() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error('加载失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [movieId]);

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  if (!movie) {
    return <div className="text-center py-12">电影不存在</div>;
  }

  return (
    <div className="space-y-8">
      {/* 电影详情 */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-4">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800">
            ← 返回
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
            {movie.genres}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">电影信息</h2>
            <div className="space-y-2">
              <p><strong>电影 ID:</strong> {movie.movieId}</p>
              <p><strong>类型:</strong> {movie.genres}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 相似电影 */}
      <div>
        <h2 className="text-2xl font-bold mb-4">相似电影推荐 🎬</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {similarMovies.map((similar) => (
            <SimilarMovieCard key={similar.movieId} movie={similar} />
          ))}
        </div>
      </div>
    </div>
  );
}

// 相似电影卡片
function SimilarMovieCard({ movie }) {
  return (
    <Link
      to={`/movie/${movie.movieId}`}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4"
    >
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
        {movie.title}
      </h3>
      <p className="text-sm text-gray-600 mb-2">{movie.genres}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-indigo-600 font-medium">
          相似度: {(movie.similarity * 100).toFixed(1)}%
        </span>
      </div>
    </Link>
  );
}

export default MovieDetail;