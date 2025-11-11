import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const movieApi = {
  // 获取推荐
  getRecommendations: async (userId, topK = 10) => {
    const response = await api.get(`/recommend/${userId}`, {
      params: { top_k: topK }
    });
    return response.data;
  },

  // 预测评分
  predictRating: async (userId, movieId) => {
    const response = await api.get('/predict', {
      params: { user_id: userId, movie_id: movieId }
    });
    return response.data;
  },

  // 获取相似电影
  getSimilarMovies: async (movieId, topK = 5) => {
    const response = await api.get(`/similar/${movieId}`, {
      params: { top_k: topK }
    });
    return response.data;
  },

  // 搜索电影
  searchMovies: async (query, limit = 10) => {
    const response = await api.get(`/movies/search/${query}`, {
      params: { limit }
    });
    return response.data;
  },

  // 获取电影详情
  getMovieInfo: async (movieId) => {
    const response = await api.get(`/movies/${movieId}`);
    return response.data;
  },

  // 获取统计信息
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },
};

export default api;