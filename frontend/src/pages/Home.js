import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieApi } from '../services/api';

function Home() {
  const [stats, setStats] = useState(null);
  const [userId, setUserId] = useState(1);

  useEffect(() => {
    movieApi.getStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-2xl p-8 md:p-16 text-center transform hover:scale-[1.01] transition-transform">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          发现你的下一部最爱电影 🎬
        </h1>
        <p className="text-lg md:text-2xl mb-10 text-white/90">
          基于机器学习的个性化电影推荐系统
        </p>
        
        {/* 快速开始 */}
        <div className="bg-white text-gray-900 rounded-xl p-6 md:p-8 max-w-md mx-auto shadow-xl">
          <label className="block text-lg font-semibold mb-4 text-gray-700">
            输入你的用户 ID 开始推荐
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="1"
              min="1"
            />
            <Link
              to={`/recommendations?userId=${userId}`}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
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
    blue: 'from-blue-500 to-blue-600 shadow-blue-200',
    purple: 'from-purple-500 to-purple-600 shadow-purple-200',
    yellow: 'from-yellow-500 to-yellow-600 shadow-yellow-200',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-xl p-8 text-center shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all`}>
      <div className="text-5xl mb-3">{icon}</div>
      <div className="text-4xl font-bold mb-2">{value.toLocaleString()}</div>
      <div className="text-sm font-medium text-white/90">{title}</div>
    </div>
  );
}

// 功能卡片组件
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default Home;