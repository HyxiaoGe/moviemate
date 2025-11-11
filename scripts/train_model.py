"""
训练推荐模型
运行：python scripts/train_model.py
"""
import sys
import os
import pandas as pd

# 添加项目根目录到路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.models.collaborative_filtering import CollaborativeFilteringRecommender

def main():
    print("\n" + "=" * 60)
    print("MovieMate - 模型训练")
    print("=" * 60)
    
    # 1. 加载数据
    print("\n[1] 加载数据...")
    ratings = pd.read_csv('data/raw/ml-latest-small/ratings.csv')
    movies = pd.read_csv('data/raw/ml-latest-small/movies.csv')
    print(f"   评分数据: {len(ratings)} 条")
    print(f"   电影数据: {len(movies)} 部")
    
    # 2. 训练模型
    print("\n[2] 开始训练...")
    model = CollaborativeFilteringRecommender(n_components=50)
    model.fit(ratings)
    
    # 3. 测试模型
    print("\n[3] 测试模型...")
    test_user_id = 1
    
    # 测试推荐
    recommendations = model.recommend(test_user_id, top_k=5)
    print(f"\n   为用户 {test_user_id} 推荐的电影:")
    for i, rec in enumerate(recommendations, 1):
        movie_id = rec['movieId']
        rating = rec['predicted_rating']
        movie_info = movies[movies['movieId'] == movie_id].iloc[0]
        print(f"   {i}. {movie_info['title']} (预测评分: {rating:.2f})")
    
    # 测试评分预测
    test_movie_id = recommendations[0]['movieId']
    predicted = model.predict_rating(test_user_id, test_movie_id)
    print(f"\n   预测用户 {test_user_id} 对电影 {test_movie_id} 的评分: {predicted:.2f}")
    
    # 测试相似电影
    similar = model.find_similar_movies(test_movie_id, top_k=3)
    print(f"\n   与电影 {test_movie_id} 相似的电影:")
    for i, sim in enumerate(similar, 1):
        movie_id = sim['movieId']
        similarity = sim['similarity']
        movie_info = movies[movies['movieId'] == movie_id].iloc[0]
        print(f"   {i}. {movie_info['title']} (相似度: {similarity:.3f})")
    
    # 4. 保存模型
    print("\n[4] 保存模型...")
    os.makedirs('data/models', exist_ok=True)
    model.save('data/models/cf_model.pkl')
    
    # 5. 保存电影信息（供API使用）
    print("\n[5] 保存电影信息...")
    os.makedirs('data/processed', exist_ok=True)
    movies.to_csv('data/processed/movies.csv', index=False)
    print("   ✓ 电影信息已保存到: data/processed/movies.csv")
    
    print("\n" + "=" * 60)
    print("✓ 训练完成！")
    print("=" * 60)
    print("\n下一步: 运行 API")
    print("  uvicorn src.api.main:app --reload")

if __name__ == "__main__":
    main()