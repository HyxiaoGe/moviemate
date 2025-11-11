"""
基于 sklearn 的协同过滤推荐系统
使用矩阵分解（SVD）实现
"""
import numpy as np
import pandas as pd
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix
import joblib

class CollaborativeFilteringRecommender:
    """协同过滤推荐器"""

    def __init__(self, n_components=50):
        """
        参数:
            n_components: SVD降维的维度（隐含特征数）
        """
        self.n_components = n_components
        self.svd_model = TruncatedSVD(n_components=n_components, random_state=42)
        self.user_item_matrix = None
        self.user_ids = None
        self.movie_ids = None
        self.user_factors = None  # 用户特征矩阵
        self.item_factors = None  # 物品特征矩阵
        self.global_mean = None   # 全局平均分

    def fit(self, ratings_df):
        """
        训练模型
        
        参数:
            ratings_df: DataFrame，包含 userId, movieId, rating 列
        """
        print("=" * 60)
        print("开始训练协同过滤模型")
        print("=" * 60)
        
        print("\n[1] 构建用户-物品评分矩阵...")
        # 创建数据透视表（用户-物品评分矩阵）
        self.user_item_matrix = ratings_df.pivot_table(
            index='userId',
            columns='movieId',
            values='rating',
            fill_value=0
        )

        self.user_ids = self.user_item_matrix.index.tolist()
        self.movie_ids = self.user_item_matrix.columns.tolist()
        self.global_mean = ratings_df['rating'].mean()

        print(f"   矩阵形状: {self.user_item_matrix.shape}")
        print(f"   用户数: {len(self.user_ids)}")
        print(f"   电影数: {len(self.movie_ids)}")
        print(f"   全局平均分: {self.global_mean:.2f}")

        # 转换为稀疏矩阵（节省内存）
        print("\n[2] 转换为稀疏矩阵...")
        sparse_matrix = csr_matrix(self.user_item_matrix.values)
        print(f"   稀疏度: {1 - sparse_matrix.nnz / (sparse_matrix.shape[0] * sparse_matrix.shape[1]):.2%}")

        print(f"\n[3] 训练SVD模型（{self.n_components}个隐含特征）...")

        # 矩阵分解
        self.user_factors = self.svd_model.fit_transform(sparse_matrix)
        self.item_factors = self.svd_model.components_.T

        explained_var = self.svd_model.explained_variance_ratio_.sum()
        print(f"   解释方差比: {explained_var:.2%}")
        print(f"   用户特征矩阵: {self.user_factors.shape}")
        print(f"   电影特征矩阵: {self.item_factors.shape}")
        
        print("\n" + "=" * 60)
        print("✓ 模型训练完成！")
        print("=" * 60)
        
        return self

    def predict_rating(self, user_id, movie_id):
        """
        预测用户对电影的评分
        
        参数:
            user_id: 用户ID
            movie_id: 电影ID
            
        返回:
            预测评分 (1-5)
        """
        # 处理冷启动问题
        if user_id not in self.user_ids:
            return self.global_mean  # 新用户：返回平均分
        
        if movie_id not in self.movie_ids:
            # 新电影：返回该用户的平均分
            user_idx = self.user_ids.index(user_id)
            user_ratings = self.user_item_matrix.iloc[user_idx]
            user_mean = user_ratings[user_ratings > 0].mean()
            return user_mean if not np.isnan(user_mean) else self.global_mean
        
        user_idx = self.user_ids.index(user_id)
        movie_idx = self.movie_ids.index(movie_id)
        
        # 用户向量 × 物品向量
        predicted = np.dot(self.user_factors[user_idx], self.item_factors[movie_idx])
        
        # 限制在1-5之间
        return float(np.clip(predicted, 1, 5))

    def recommend(self, user_id, top_k=10, exclude_rated=True):
        """
        为用户推荐电影
        
        参数:
            user_id: 用户ID
            top_k: 推荐数量
            exclude_rated: 是否排除已评分的电影
            
        返回:
            推荐电影ID列表和预测评分
        """
        if user_id not in self.user_ids:
            # 新用户：返回热门电影
            return self._recommend_popular(top_k)
        
        user_idx = self.user_ids.index(user_id)
        
        # 预测所有电影的评分
        user_vector = self.user_factors[user_idx]
        predicted_ratings = np.dot(user_vector, self.item_factors.T)
        
        # 如果排除已评分的电影
        if exclude_rated:
            rated_movies = self.user_item_matrix.iloc[user_idx]
            rated_indices = np.where(rated_movies > 0)[0]
            predicted_ratings[rated_indices] = -np.inf
        
        # 获取top-k
        top_indices = np.argsort(predicted_ratings)[::-1][:top_k]
        
        recommendations = []
        for idx in top_indices:
            movie_id = self.movie_ids[idx]
            rating = predicted_ratings[idx]
            recommendations.append({
                'movieId': int(movie_id),
                'predicted_rating': float(np.clip(rating, 1, 5))
            })
        
        return recommendations

    def _recommend_popular(self, top_k):
        """推荐热门电影（用于冷启动）"""
        # 计算每部电影的平均评分和评分次数
        avg_ratings = self.user_item_matrix.replace(0, np.nan).mean(axis=0)
        rating_counts = (self.user_item_matrix > 0).sum(axis=0)
        
        # 过滤掉评分次数太少的电影（至少10个评分）
        mask = rating_counts >= 10
        filtered_ratings = avg_ratings[mask]
        
        # 获取top-k
        top_movies = filtered_ratings.nlargest(top_k)
        
        recommendations = []
        for movie_id, rating in top_movies.items():
            recommendations.append({
                'movieId': int(movie_id),
                'predicted_rating': float(rating)
            })
        
        return recommendations

    def find_similar_movies(self, movie_id, top_k=5):
        """
        找到相似的电影
        
        参数:
            movie_id: 电影ID
            top_k: 返回数量
            
        返回:
            相似电影列表
        """
        if movie_id not in self.movie_ids:
            return []
        
        movie_idx = self.movie_ids.index(movie_id)
        
        # 计算余弦相似度
        movie_vector = self.item_factors[movie_idx].reshape(1, -1)
        similarities = cosine_similarity(movie_vector, self.item_factors)[0]
        
        # 排除自己
        similarities[movie_idx] = -1
        
        # 获取最相似的
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        similar_movies = []
        for idx in top_indices:
            similar_movies.append({
                'movieId': int(self.movie_ids[idx]),
                'similarity': float(similarities[idx])
            })
        
        return similar_movies

    def save(self, filepath):
        """保存模型"""
        joblib.dump(self, filepath)
        print(f"✓ 模型已保存到: {filepath}")
    
    @staticmethod
    def load(filepath):
        """加载模型"""
        model = joblib.load(filepath)
        print(f"✓ 模型已加载: {filepath}")
        return model