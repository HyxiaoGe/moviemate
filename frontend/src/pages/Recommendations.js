import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { movieApi } from '../services/api';

function Recommendations({ userId: propUserId }) {
  const [searchParams] = useSearchParams();
  const userId = propUserId || parseInt(searchParams.get('userId')) || 1;
  
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
      setError('加载推荐失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadRecommendations}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            为用户 {userId} 推荐 🎯
          </h1>
          <p className="text-gray-600 mt-2">
            基于你的历史评分，这些电影你可能会喜欢
          </p>
        </div>
        <button
          onClick={loadRecommendations}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          🔄 刷新推荐
        </button>
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
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
      <div className="flex items-start gap-4">
        {/* 排名 */}
        <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl">
          {rank}
        </div>

        {/* 电影信息 */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span className="px-2 py-1 bg-gray-100 rounded">
              {movie.genres}
            </span>
          </div>

          {/* 预测评分 */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-500 text-lg">
              {'⭐'.repeat(Math.round(movie.predicted_rating))}
            </span>
            <span className="font-semibold text-lg">
              {movie.predicted_rating.toFixed(2)}
            </span>
            <span className="text-gray-500 text-sm">预测评分</span>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Link
              to={`/movie/${movie.movieId}`}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              查看详情
            </Link>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              标记已看
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recommendations;