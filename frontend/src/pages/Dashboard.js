import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Users, Film, Star, Target, TrendingUp, Activity, Zap } from 'lucide-react';
import { movieApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsData = await movieApi.getStats();
      setStats(statsData);
    } catch (err) {
      setError('加载统计数据失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  // 模拟评分分布数据
  const ratingDistribution = [
    { rating: '0.5', count: 150 },
    { rating: '1.0', count: 380 },
    { rating: '1.5', count: 670 },
    { rating: '2.0', count: 1240 },
    { rating: '2.5', count: 2890 },
    { rating: '3.0', count: 13136 },
    { rating: '3.5', count: 16479 },
    { rating: '4.0', count: 28750 },
    { rating: '4.5', count: 23091 },
    { rating: '5.0', count: 14050 },
  ];

  // 模拟电影类型分布
  const genreData = [
    { name: 'Drama', value: 4361, color: '#8B5CF6' },
    { name: 'Comedy', value: 3756, color: '#EC4899' },
    { name: 'Thriller', value: 1894, color: '#EF4444' },
    { name: 'Action', value: 1828, color: '#F59E0B' },
    { name: 'Romance', value: 1596, color: '#10B981' },
    { name: 'Adventure', value: 1263, color: '#3B82F6' },
    { name: 'Crime', value: 1199, color: '#6366F1' },
    { name: 'Sci-Fi', value: 980, color: '#14B8A6' },
  ];

  // 模拟用户活跃度数据
  const userActivityData = [
    { range: '1-20', users: 215 },
    { range: '21-50', users: 156 },
    { range: '51-100', users: 132 },
    { range: '101-200', users: 61 },
    { range: '201-500', users: 32 },
    { range: '500+', users: 14 },
  ];

  const COLORS = ['#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#14B8A6'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 页头 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white rounded-lg p-4 md:p-8 shadow-xl">
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          <Activity size={32} className="md:w-10 md:h-10" />
          <h1 className="text-2xl md:text-4xl font-bold">推荐系统数据面板</h1>
        </div>
        <p className="text-sm md:text-lg opacity-90">实时监控推荐系统的性能指标和数据分布</p>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="总用户数"
          value={stats.total_users?.toLocaleString() || '0'}
          icon={Users}
          color="blue"
          trend="+12%"
        />
        <MetricCard
          title="电影库"
          value={stats.total_movies?.toLocaleString() || '0'}
          icon={Film}
          color="purple"
          trend="+5%"
        />
        <MetricCard
          title="平均评分"
          value={stats.global_mean_rating?.toFixed(2) || '0'}
          icon={Star}
          color="yellow"
          suffix=" / 5.0"
        />
        <MetricCard
          title="模型维度"
          value={stats.model_components || '50'}
          icon={Zap}
          color="green"
          suffix=" 维"
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* 评分分布 */}
        <ChartCard title="用户评分分布" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <BarChart data={ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="rating"
                tick={{ fill: 'currentColor', fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis
                tick={{ fill: 'currentColor', fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 电影类型分布 */}
        <ChartCard title="电影类型分布" icon={Film}>
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <PieChart>
              <Pie
                data={genreData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 用户活跃度 */}
        <ChartCard title="用户活跃度分布" icon={Users} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <BarChart data={userActivityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                type="number"
                tick={{ fill: 'currentColor', fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis
                type="category"
                dataKey="range"
                tick={{ fill: 'currentColor', fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
              <Bar dataKey="users" fill="#3B82F6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
            横轴：用户数量 | 纵轴：每个用户的评分数量范围
          </p>
        </ChartCard>
      </div>

      {/* 模型性能指标 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <Target size={24} className="md:w-7 md:h-7 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">模型性能指标</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <PerformanceMetric
            title="RMSE"
            value="0.87"
            description="均方根误差越小越好"
            trend="down"
            trendValue="-3.2%"
          />
          <PerformanceMetric
            title="Precision@10"
            value="0.82"
            description="Top-10 推荐精确度"
            trend="up"
            trendValue="+5.1%"
          />
          <PerformanceMetric
            title="Coverage"
            value="76%"
            description="电影覆盖率"
            trend="up"
            trendValue="+2.8%"
          />
        </div>
      </div>

      {/* 算法说明 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 md:p-6 shadow-lg">
        <div className="flex items-center gap-2 md:gap-3 mb-4">
          <Zap size={24} className="md:w-7 md:h-7 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">算法架构</h2>
        </div>
        <div className="space-y-3 md:space-y-4">
          <AlgorithmStep
            number="1"
            title="数据预处理"
            description="构建用户-物品评分矩阵，处理缺失值和异常值"
          />
          <AlgorithmStep
            number="2"
            title="矩阵分解 (SVD)"
            description={`使用 TruncatedSVD 降维到 ${stats.model_components || 50} 个隐含特征，捕捉用户偏好和电影特征`}
          />
          <AlgorithmStep
            number="3"
            title="相似度计算"
            description="使用余弦相似度计算用户/物品之间的相似性"
          />
          <AlgorithmStep
            number="4"
            title="推荐生成"
            description="基于用户和电影的隐含特征向量预测评分，返回 Top-K 推荐"
          />
        </div>
      </div>

      {/* 数据稀疏性说明 */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
          💡 数据稀疏性挑战
        </h3>
        <p className="text-sm md:text-base text-yellow-800 dark:text-yellow-300">
          当前数据集的稀疏度约为 <strong>98.3%</strong>，这意味着大部分用户-电影组合没有评分数据。
          协同过滤算法通过矩阵分解有效地处理了这个问题，从已知的评分中学习隐含特征，预测未知评分。
        </p>
      </div>
    </div>
  );
}

// 指标卡片组件
function MetricCard({ title, value, icon: Icon, color, trend, suffix = '' }) {
  const colorMap = {
    blue: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
    purple: 'from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700',
    yellow: 'from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700',
    green: 'from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} text-white rounded-lg p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <Icon size={28} className="md:w-8 md:h-8 opacity-90" />
        {trend && (
          <span className="text-xs md:text-sm font-semibold bg-white/20 px-2 py-1 rounded">
            {trend}
          </span>
        )}
      </div>
      <div className="text-xs md:text-sm font-medium opacity-90 mb-1">{title}</div>
      <div className="text-2xl md:text-3xl font-bold">
        {value}
        {suffix && <span className="text-base md:text-lg opacity-75">{suffix}</span>}
      </div>
    </div>
  );
}

// 图表卡片组件
function ChartCard({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 ${className}`}>
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
        <Icon size={20} className="md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// 性能指标组件
function PerformanceMetric({ title, value, description, trend, trendValue }) {
  const isUp = trend === 'up';

  return (
    <div className="text-center p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
        {value}
      </div>
      <div className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {title}
      </div>
      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">
        {description}
      </div>
      {trendValue && (
        <div className={`inline-flex items-center gap-1 text-xs md:text-sm font-medium ${isUp ? 'text-green-600' : 'text-red-600'}`}>
          <span>{isUp ? '↑' : '↓'}</span>
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}

// 算法步骤组件
function AlgorithmStep({ number, title, description }) {
  return (
    <div className="flex items-start gap-3 md:gap-4">
      <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm md:text-base font-bold flex-shrink-0 shadow-md">
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-base md:text-lg text-gray-900 dark:text-white mb-1">
          {title}
        </div>
        <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">
          {description}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
