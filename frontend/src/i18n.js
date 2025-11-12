import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  zh: {
    translation: {
      // 导航
      nav: {
        home: '首页',
        recommendations: '推荐',
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
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        recommendations: 'Recommend',
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
