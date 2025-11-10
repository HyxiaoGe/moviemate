import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

print("=" * 60)
print("MovieLens 数据探索")
print("=" * 60)

# 1. 加载数据
print("\n[1] 加载数据...")
ratings = pd.read_csv('data/raw/ml-latest-small/ratings.csv')
movies = pd.read_csv('data/raw/ml-latest-small/movies.csv')

print(f"评分数据: {ratings.shape[0]} 条评分")
print(f"电影数据: {movies.shape[0]} 部电影")

# 2. 查看数据样例
print("\n[2] 评分数据样例:")
print(ratings.head())
print("\n电影数据样例:")
print(movies.head())

# 3. 基本统计
print("\n[3] 基本统计:")
print(f"用户数: {ratings['userId'].nunique()}")
print(f"电影数: {ratings['movieId'].nunique()}")
print(f"评分范围: {ratings['rating'].min()} - {ratings['rating'].max()}")
print(f"平均评分: {ratings['rating'].mean():.2f}")

# 4. 评分分布
print("\n[4] 评分分布:")
print(ratings['rating'].value_counts().sort_index())

# 5. 用户活跃度
user_activity = ratings.groupby('userId').size()
print(f"\n[5] 用户活跃度:")
print(f"平均每用户评分数: {user_activity.mean():.1f}")
print(f"最活跃用户评分数: {user_activity.max()}")
print(f"最少评分用户: {user_activity.min()}")

# 6. 电影受欢迎度
movie_popularity = ratings.groupby('movieId').size()
print(f"\n[6] 电影受欢迎度:")
print(f"平均每部电影被评分: {movie_popularity.mean():.1f} 次")
print(f"最受欢迎电影被评分: {movie_popularity.max()} 次")

# 7. 稀疏性
total_possible = ratings['userId'].nunique() * ratings['movieId'].nunique()
actual_ratings = len(ratings)
sparsity = (1 - actual_ratings / total_possible) * 100
print(f"\n[7] 数据稀疏性: {sparsity:.2f}%")
print("（这意味着大部分用户-电影组合没有评分，这是推荐系统的挑战）")

# 8. Top 10 热门电影
print("\n[8] Top 10 热门电影:")
top_movies = ratings.groupby('movieId').agg({
    'rating': ['count', 'mean']
}).reset_index()
top_movies.columns = ['movieId', 'count', 'avg_rating']
top_movies = top_movies.merge(movies, on='movieId')
top_movies = top_movies[top_movies['count'] >= 50]  # 至少50个评分
top_movies = top_movies.sort_values('avg_rating', ascending=False).head(10)
print(top_movies[['title', 'count', 'avg_rating']])

print("\n" + "=" * 60)
print("数据探索完成！")
print("=" * 60)
