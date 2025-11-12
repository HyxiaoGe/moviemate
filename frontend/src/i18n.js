import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  zh: {
    translation: {
      // 导航
      nav: {
        home: '首页',
        recommendations: '我的推荐',
        search: '搜索',
        user: '用户'
      },
      // 首页
      home: {
        title: '发现你的下一部最爱电影',
        subtitle: '基于机器学习的个性化电影推荐系统',
        inputLabel: '输入你的用户 ID 开始推荐',
        getRecommendations: '获取推荐',
        stats: {
          users: '注册用户',
          movies: '电影数量',
          rating: '平均评分'
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
        title: '为你推荐',
        loading: '正在加载推荐...',
        error: '加载失败',
        predictedRating: '预测评分',
        viewDetails: '查看详情'
      },
      // 搜索页
      search: {
        title: '搜索电影',
        placeholder: '输入电影名称...',
        searchButton: '搜索',
        noResults: '未找到相关电影',
        results: '搜索结果'
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
        copyright: 'AI 驱动的电影推荐系统',
        description: '基于协同过滤算法，为您推荐最适合的电影'
      },
      // 通用
      common: {
        loading: '加载中...',
        error: '出错了',
        retry: '重试'
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        recommendations: 'My Recommendations',
        search: 'Search',
        user: 'User'
      },
      home: {
        title: 'Discover Your Next Favorite Movie',
        subtitle: 'AI-Powered Personalized Movie Recommendation System',
        inputLabel: 'Enter your User ID to get started',
        getRecommendations: 'Get Recommendations',
        stats: {
          users: 'Users',
          movies: 'Movies',
          rating: 'Avg Rating'
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
        title: 'Recommended for You',
        loading: 'Loading recommendations...',
        error: 'Failed to load',
        predictedRating: 'Predicted Rating',
        viewDetails: 'View Details'
      },
      search: {
        title: 'Search Movies',
        placeholder: 'Enter movie title...',
        searchButton: 'Search',
        noResults: 'No movies found',
        results: 'Search Results'
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
        copyright: 'AI-Powered Movie Recommendation System',
        description: 'Powered by collaborative filtering algorithm'
      },
      common: {
        loading: 'Loading...',
        error: 'Error occurred',
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
