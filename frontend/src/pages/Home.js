import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieApi } from '../services/api';

function Home() {
  const [stats, setStats] = useState(null);
  const [userId, setUserId] = useState(1);

  useEffect(() => {
    // 加载统计信息
    movieApi.getStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-12 text-center">
        <h1 className="text-5xl font-bold mb-4">
          发现你的下一部最爱电影 🎬
        </h1>
        <p className="text-xl mb-8">
          基于机器学习的个性化电影推荐系统
        </p>
        
        {/* 快速开始 */}
        <div className="bg-white text-gray-900 rounded-lg p-6 max-w-md mx-auto">
          <label className="block text-lg font-semibold mb-2">
            输入你的用户 ID 开始推荐
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="flex-1 px-4 py-3 border rounded-lg"
              placeholder="用户 ID"
              min="1"
            />
            <Link
              to={`/recommendations?userId=${userId}`}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
            >
              获取推荐
            </Link>
          </div>
        </div>
      </div>

      {/* 系统统计 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon="👥"
            title="注册用户"
            value={stats.total_users}
            color="blue"
          />
          <StatCard 
            icon="🎬"
            title="电影数量"
            value={stats.total_movies}
            color="purple"
          />
          <StatCard 
            icon="⭐"
            title="平均评分"
            value={stats.global_mean_rating.toFixed(2)}
            color="yellow"
          />
        </div>
      )}

      {/* 功能介绍 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon="🎯"
          title="个性化推荐"
          description="基于协同过滤算法，为你推荐最可能喜欢的电影"
        />
        <FeatureCard
          icon="🔮"
          title="评分预测"
          description="预测你对任何电影的评分，避免踩雷"
        />
        <FeatureCard
          icon="🔍"
          title="相似推荐"
          description="找到与你喜欢的电影相似的其他精彩作品"
        />
      </div>
    </div>
  );
}

// 统计卡片组件
function StatCard({ icon, title, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-6 text-center`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value.toLocaleString()}</div>
      <div className="text-sm font-medium">{title}</div>
    </div>
  );
}

// 功能卡片组件
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default Home;