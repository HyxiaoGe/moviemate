import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  zh: {
    translation: {
      // 导航
      nav: {
        home: '首页',
        recommendations: '推荐',
        dashboard: '数据洞察',
        search: '搜索',
        user: '用户'
      },
      // 首页
      home: {
        title: '发现你的下一部最爱电影',
        subtitle: '基于机器学习的个性化推荐系统',
        inputLabel: '输入用户 ID 开始推荐',
        getRecommendations: '开始',
        stats: {
          users: '用户',
          movies: '电影',
          rating: '评分'
        },
        features: {
          personalized: {
            title: '个性化推荐',
            desc: '基于协同过滤算法，为你推荐最可能喜欢的电影'
          },
          prediction: {
            title: '评分预测',
            desc: '预测你对任何电影的评分，避免踩雷'
          },
          similar: {
            title: '相似推荐',
            desc: '找到与你喜欢的电影相似的其他精彩作品'
          }
        }
      },
      // 推荐页
      recommendations: {
        title: '推荐列表',
        loading: '正在加载推荐...',
        error: '加载失败',
        predictedRating: '评分',
        viewDetails: '详情',
        refresh: '刷新'
      },
      // 搜索页
      search: {
        title: '搜索电影',
        placeholder: '输入电影名称...',
        searchButton: '搜索',
        noResults: '未找到相关电影',
        results: '结果'
      },
      // 电影详情
      movieDetail: {
        loading: '加载中...',
        error: '加载失败',
        genres: '类型',
        predictRating: '预测评分',
        similarMovies: '相似电影',
        similarity: '相似度'
      },
      // 页脚
      footer: {
        copyright: 'AI 驱动的推荐系统',
        description: '基于协同过滤算法'
      },
      // 通用
      common: {
        loading: '加载中',
        error: '出错了',
        retry: '重试'
      },
      // 数据面板
      dashboard: {
        title: '推荐系统数据面板',
        subtitle: '实时监控推荐系统的性能指标和数据分布',
        metrics: {
          totalUsers: '总用户数',
          totalMovies: '电影库',
          avgRating: '平均评分',
          modelDimensions: '模型维度',
          dimensions: '维'
        },
        charts: {
          ratingDistribution: '用户评分分布',
          genreDistribution: '电影类型分布',
          userActivity: '用户活跃度分布',
          userActivityHint: '横轴：用户数量 | 纵轴：每个用户的评分数量范围'
        },
        performance: {
          title: '模型性能指标',
          rmse: {
            name: 'RMSE',
            desc: '均方根误差越小越好'
          },
          precision: {
            name: 'Precision@10',
            desc: 'Top-10 推荐精确度'
          },
          coverage: {
            name: 'Coverage',
            desc: '电影覆盖率'
          }
        },
        algorithm: {
          title: '算法架构',
          step1: {
            title: '数据预处理',
            desc: '构建用户-物品评分矩阵，处理缺失值和异常值'
          },
          step2: {
            title: '矩阵分解 (SVD)',
            desc: '使用 TruncatedSVD 降维到 {dimensions} 个隐含特征，捕捉用户偏好和电影特征'
          },
          step3: {
            title: '相似度计算',
            desc: '使用余弦相似度计算用户/物品之间的相似性'
          },
          step4: {
            title: '推荐生成',
            desc: '基于用户和电影的隐含特征向量预测评分，返回 Top-K 推荐'
          }
        },
        sparsity: {
          title: '数据稀疏性挑战',
          desc: '当前数据集的稀疏度约为 <strong>98.3%</strong>，这意味着大部分用户-电影组合没有评分数据。协同过滤算法通过矩阵分解有效地处理了这个问题，从已知的评分中学习隐含特征，预测未知评分。'
        },
        error: '加载统计数据失败'
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        recommendations: 'Recommend',
        dashboard: 'Analytics',
        search: 'Search',
        user: 'User'
      },
      home: {
        title: 'Discover Your Next Favorite Movie',
        subtitle: 'AI-Powered Personalized Recommendations',
        inputLabel: 'Enter User ID to get started',
        getRecommendations: 'Start',
        stats: {
          users: 'Users',
          movies: 'Movies',
          rating: 'Rating'
        },
        features: {
          personalized: {
            title: 'Personalized',
            desc: 'Collaborative filtering algorithm recommends movies you\'ll love'
          },
          prediction: {
            title: 'Rating Prediction',
            desc: 'Predict your rating for any movie before watching'
          },
          similar: {
            title: 'Similar Movies',
            desc: 'Find movies similar to your favorites'
          }
        }
      },
      recommendations: {
        title: 'Recommendations',
        loading: 'Loading recommendations...',
        error: 'Failed to load',
        predictedRating: 'Rating',
        viewDetails: 'Details',
        refresh: 'Refresh'
      },
      search: {
        title: 'Search Movies',
        placeholder: 'Enter movie title...',
        searchButton: 'Search',
        noResults: 'No movies found',
        results: 'Results'
      },
      movieDetail: {
        loading: 'Loading...',
        error: 'Failed to load',
        genres: 'Genres',
        predictRating: 'Predict Rating',
        similarMovies: 'Similar Movies',
        similarity: 'Similarity'
      },
      footer: {
        copyright: 'AI-Powered Recommendations',
        description: 'Collaborative Filtering'
      },
      common: {
        loading: 'Loading',
        error: 'Error',
        retry: 'Retry'
      },
      // Dashboard
      dashboard: {
        title: 'Recommendation System Dashboard',
        subtitle: 'Real-time monitoring of performance metrics and data distribution',
        metrics: {
          totalUsers: 'Total Users',
          totalMovies: 'Movie Library',
          avgRating: 'Avg Rating',
          modelDimensions: 'Model Dimensions',
          dimensions: 'D'
        },
        charts: {
          ratingDistribution: 'User Rating Distribution',
          genreDistribution: 'Movie Genre Distribution',
          userActivity: 'User Activity Distribution',
          userActivityHint: 'X-axis: User Count | Y-axis: Rating Count per User'
        },
        performance: {
          title: 'Model Performance Metrics',
          rmse: {
            name: 'RMSE',
            desc: 'Lower is better'
          },
          precision: {
            name: 'Precision@10',
            desc: 'Top-10 recommendation accuracy'
          },
          coverage: {
            name: 'Coverage',
            desc: 'Movie coverage rate'
          }
        },
        algorithm: {
          title: 'Algorithm Architecture',
          step1: {
            title: 'Data Preprocessing',
            desc: 'Build user-item rating matrix, handle missing values and outliers'
          },
          step2: {
            title: 'Matrix Factorization (SVD)',
            desc: 'Use TruncatedSVD to reduce to {dimensions} latent features, capturing user preferences and movie characteristics'
          },
          step3: {
            title: 'Similarity Calculation',
            desc: 'Calculate user/item similarity using cosine similarity'
          },
          step4: {
            title: 'Recommendation Generation',
            desc: 'Predict ratings based on latent feature vectors, return Top-K recommendations'
          }
        },
        sparsity: {
          title: 'Data Sparsity Challenge',
          desc: 'Current dataset has approximately <strong>98.3%</strong> sparsity, meaning most user-movie combinations lack rating data. Collaborative filtering effectively handles this through matrix factorization, learning latent features from known ratings to predict unknown ones.'
        },
        error: 'Failed to load statistics'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'zh',
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
