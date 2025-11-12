/**
 * TMDb (The Movie Database) API 服务
 * 用于获取电影海报、详情等信息
 */

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_READ_TOKEN = process.env.REACT_APP_TMDB_READ_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// 图片尺寸配置
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original'
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  }
};

/**
 * TMDb API 请求辅助函数
 */
const tmdbFetch = async (endpoint, params = {}) => {
  try {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

    // 添加 API Key
    if (TMDB_API_KEY) {
      url.searchParams.append('api_key', TMDB_API_KEY);
    }

    // 添加其他参数
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const headers = {};
    if (TMDB_READ_TOKEN) {
      headers['Authorization'] = `Bearer ${TMDB_READ_TOKEN}`;
    }

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('TMDb API request failed:', error);
    return null;
  }
};

/**
 * 构建图片 URL
 */
export const getImageUrl = (path, type = 'poster', size = 'medium') => {
  if (!path) return null;
  const sizeKey = IMAGE_SIZES[type][size];
  return `${TMDB_IMAGE_BASE}/${sizeKey}${path}`;
};

/**
 * 清理电影标题（去掉年份）
 */
const cleanTitle = (title) => {
  // 去掉末尾的年份，如 "Toy Story (1995)" -> "Toy Story"
  return title.replace(/\s*\((\d{4})\)\s*$/, '').trim();
};

/**
 * 从标题中提取年份
 */
const extractYear = (title) => {
  const match = title.match(/\((\d{4})\)/);
  return match ? match[1] : null;
};

/**
 * TMDb API 服务
 */
export const tmdbApi = {
  /**
   * 搜索电影获取详情
   * @param {string} title - 电影标题
   * @returns {Promise<Object|null>} 电影详情
   */
  searchMovie: async (title) => {
    const cleanedTitle = cleanTitle(title);
    const year = extractYear(title);

    const params = {
      query: cleanedTitle,
      language: 'zh-CN',
      include_adult: false
    };

    // 如果有年份，添加年份参数以提高匹配准确度
    if (year) {
      params.year = year;
    }

    const data = await tmdbFetch('/search/movie', params);

    if (data && data.results && data.results.length > 0) {
      const movie = data.results[0];
      return {
        id: movie.id,
        title: movie.title,
        originalTitle: movie.original_title,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        overview: movie.overview,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        popularity: movie.popularity,
        genreIds: movie.genre_ids,
        // 生成不同尺寸的图片 URL
        images: {
          poster: {
            small: getImageUrl(movie.poster_path, 'poster', 'small'),
            medium: getImageUrl(movie.poster_path, 'poster', 'medium'),
            large: getImageUrl(movie.poster_path, 'poster', 'large'),
          },
          backdrop: {
            small: getImageUrl(movie.backdrop_path, 'backdrop', 'small'),
            medium: getImageUrl(movie.backdrop_path, 'backdrop', 'medium'),
            large: getImageUrl(movie.backdrop_path, 'backdrop', 'large'),
          }
        }
      };
    }

    return null;
  },

  /**
   * 通过 TMDb ID 获取电影详情
   * @param {number} tmdbId - TMDb 电影 ID
   * @returns {Promise<Object|null>} 电影详情
   */
  getMovieDetails: async (tmdbId) => {
    const data = await tmdbFetch(`/movie/${tmdbId}`, {
      language: 'zh-CN',
      append_to_response: 'credits,videos,similar'
    });

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      originalTitle: data.original_title,
      tagline: data.tagline,
      overview: data.overview,
      posterPath: data.poster_path,
      backdropPath: data.backdrop_path,
      releaseDate: data.release_date,
      runtime: data.runtime,
      voteAverage: data.vote_average,
      voteCount: data.vote_count,
      popularity: data.popularity,
      budget: data.budget,
      revenue: data.revenue,
      genres: data.genres,
      productionCompanies: data.production_companies,
      // 演职人员
      cast: data.credits?.cast?.slice(0, 10) || [],
      crew: data.credits?.crew?.slice(0, 5) || [],
      // 预告片
      videos: data.videos?.results?.filter(v => v.type === 'Trailer') || [],
      // 相似电影
      similar: data.similar?.results?.slice(0, 6) || [],
      // 图片
      images: {
        poster: {
          small: getImageUrl(data.poster_path, 'poster', 'small'),
          medium: getImageUrl(data.poster_path, 'poster', 'medium'),
          large: getImageUrl(data.poster_path, 'poster', 'large'),
        },
        backdrop: {
          small: getImageUrl(data.backdrop_path, 'backdrop', 'small'),
          medium: getImageUrl(data.backdrop_path, 'backdrop', 'medium'),
          large: getImageUrl(data.backdrop_path, 'backdrop', 'large'),
        }
      }
    };
  },

  /**
   * 批量搜索电影（用于推荐列表）
   * @param {Array<{title: string, movieId: number}>} movies - 电影列表
   * @returns {Promise<Map>} movieId -> TMDb数据的映射
   */
  batchSearchMovies: async (movies) => {
    const results = new Map();

    // 并发请求，但限制并发数避免超出 API 限制
    const BATCH_SIZE = 5;
    for (let i = 0; i < movies.length; i += BATCH_SIZE) {
      const batch = movies.slice(i, i + BATCH_SIZE);
      const promises = batch.map(movie =>
        tmdbApi.searchMovie(movie.title)
          .then(data => ({ movieId: movie.movieId, data }))
      );

      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ movieId, data }) => {
        if (data) {
          results.set(movieId, data);
        }
      });

      // 延迟以避免触发速率限制
      if (i + BATCH_SIZE < movies.length) {
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }

    return results;
  },

  /**
   * 获取热门电影
   * @param {number} page - 页码
   * @returns {Promise<Array>} 热门电影列表
   */
  getPopularMovies: async (page = 1) => {
    const data = await tmdbFetch('/movie/popular', {
      language: 'zh-CN',
      page
    });

    return data?.results || [];
  },

  /**
   * 获取电影类型列表
   * @returns {Promise<Array>} 类型列表
   */
  getGenres: async () => {
    const data = await tmdbFetch('/genre/movie/list', {
      language: 'zh-CN'
    });

    return data?.genres || [];
  }
};

/**
 * TMDb 数据缓存（可选）
 * 避免重复请求相同的电影数据
 */
export class TMDbCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(title) {
    return this.cache.get(title);
  }

  set(title, data) {
    // 如果缓存已满，删除最早的条目
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(title, data);
  }

  has(title) {
    return this.cache.has(title);
  }

  clear() {
    this.cache.clear();
  }
}

// 创建全局缓存实例
export const tmdbCache = new TMDbCache();

export default tmdbApi;
