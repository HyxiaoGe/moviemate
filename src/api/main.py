"""
MovieMate FastAPI 应用
运行：uvicorn src.api.main:app --reload
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from enum import Enum
from datetime import datetime
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np
import os
import random

from src.models.collaborative_filtering import CollaborativeFilteringRecommender

# 创建应用
app = FastAPI(
    title="MovieMate API",
    description="电影推荐系统 API",
    version="1.0.0"
)

# 配置 CORS（允许前端调用）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 全局变量
model = None
movies_df = None
feedback_storage = []  # A/B 测试反馈存储

# 推荐策略枚举
class RecommendationStrategy(str, Enum):
    COLLABORATIVE = "collaborative"  # 协同过滤
    POPULAR = "popular"              # 热门推荐
    RANDOM = "random"                # 随机推荐（对照组）

# 数据模型
class RecommendationResponse(BaseModel):
    movieId: int
    title: str
    genres: str
    predicted_rating: float

class PredictionResponse(BaseModel):
    userId: int
    movieId: int
    title: str
    predicted_rating: float

class SimilarMovieResponse(BaseModel):
    movieId: int
    title: str
    genres: str
    similarity: float

# 启动时加载模型
@app.on_event("startup")
async def load_model():
    """加载训练好的模型和电影数据"""
    global model, movies_df
    
    print("正在加载模型...")
    
    model_path = "data/models/cf_model.pkl"
    movies_path = "data/processed/movies.csv"
    
    if not os.path.exists(model_path):
        print("❌ 模型文件不存在！请先运行: python scripts/train_model.py")
        return
    
    if not os.path.exists(movies_path):
        print("❌ 电影数据不存在！请先运行: python scripts/train_model.py")
        return
    
    model = CollaborativeFilteringRecommender.load(model_path)
    movies_df = pd.read_csv(movies_path)
    
    print("✓ 模型和数据加载完成！")

# 挂载前端静态文件（如果存在）
frontend_build_path = "frontend/build"
if os.path.exists(frontend_build_path):
    app.mount("/static", StaticFiles(directory=f"{frontend_build_path}/static"), name="static")
    print("✓ 前端静态文件已挂载")

# API 路由
@app.get("/api")
async def root():
    """API 根路径"""
    return {
        "message": "欢迎使用 MovieMate API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "movies_loaded": movies_df is not None
    }

@app.get("/recommend/{user_id}", response_model=List[RecommendationResponse])
async def get_recommendations(
    user_id: int,
    top_k: int = 10,
    exclude_rated: bool = True
):
    """
    为用户推荐电影
    
    参数:
    - user_id: 用户ID
    - top_k: 推荐数量 (默认10)
    - exclude_rated: 是否排除已评分的电影 (默认True)
    """
    if model is None:
        raise HTTPException(status_code=503, detail="模型未加载")
    
    # 获取推荐
    recommendations = model.recommend(user_id, top_k=top_k, exclude_rated=exclude_rated)
    
    # 添加电影信息
    results = []
    for rec in recommendations:
        movie_id = rec['movieId']
        movie_info = movies_df[movies_df['movieId'] == movie_id]
        
        if not movie_info.empty:
            movie = movie_info.iloc[0]
            results.append({
                "movieId": movie_id,
                "title": movie['title'],
                "genres": movie['genres'],
                "predicted_rating": rec['predicted_rating']
            })
    
    return results

@app.get("/predict", response_model=PredictionResponse)
async def predict_rating(user_id: int, movie_id: int):
    """
    预测用户对电影的评分
    
    参数:
    - user_id: 用户ID
    - movie_id: 电影ID
    """
    if model is None:
        raise HTTPException(status_code=503, detail="模型未加载")
    
    # 预测评分
    predicted = model.predict_rating(user_id, movie_id)
    
    # 获取电影信息
    movie_info = movies_df[movies_df['movieId'] == movie_id]
    
    if movie_info.empty:
        raise HTTPException(status_code=404, detail=f"电影ID {movie_id} 不存在")
    
    movie = movie_info.iloc[0]
    
    return {
        "userId": user_id,
        "movieId": movie_id,
        "title": movie['title'],
        "predicted_rating": predicted
    }

@app.get("/similar/{movie_id}", response_model=List[SimilarMovieResponse])
async def get_similar_movies(movie_id: int, top_k: int = 5):
    """
    获取相似的电影
    
    参数:
    - movie_id: 电影ID
    - top_k: 返回数量 (默认5)
    """
    if model is None:
        raise HTTPException(status_code=503, detail="模型未加载")
    
    # 检查电影是否存在
    if movie_id not in model.movie_ids:
        raise HTTPException(status_code=404, detail=f"电影ID {movie_id} 不存在于训练数据中")
    
    # 获取相似电影
    similar = model.find_similar_movies(movie_id, top_k=top_k)
    
    # 添加电影信息
    results = []
    for sim in similar:
        sim_movie_id = sim['movieId']
        movie_info = movies_df[movies_df['movieId'] == sim_movie_id]
        
        if not movie_info.empty:
            movie = movie_info.iloc[0]
            results.append({
                "movieId": sim_movie_id,
                "title": movie['title'],
                "genres": movie['genres'],
                "similarity": sim['similarity']
            })
    
    return results

@app.get("/movies/{movie_id}")
async def get_movie_info(movie_id: int):
    """获取电影详细信息"""
    movie_info = movies_df[movies_df['movieId'] == movie_id]
    
    if movie_info.empty:
        raise HTTPException(status_code=404, detail=f"电影ID {movie_id} 不存在")
    
    movie = movie_info.iloc[0]
    return {
        "movieId": int(movie['movieId']),
        "title": movie['title'],
        "genres": movie['genres']
    }

@app.get("/movies/search/{query}")
async def search_movies(query: str, limit: int = 10):
    """搜索电影"""
    # 简单的标题搜索
    results = movies_df[movies_df['title'].str.contains(query, case=False, na=False)]
    results = results.head(limit)
    
    return results.to_dict('records')

@app.get("/stats")
async def get_stats():
    """获取系统统计信息"""
    if model is None:
        raise HTTPException(status_code=503, detail="模型未加载")

    return {
        "total_users": len(model.user_ids),
        "total_movies": len(model.movie_ids),
        "model_components": model.n_components,
        "global_mean_rating": float(model.global_mean)
    }

# A/B 测试相关接口
@app.get("/recommend/ab-test/{user_id}")
async def ab_test_recommendation(
    user_id: int,
    strategy: RecommendationStrategy = RecommendationStrategy.COLLABORATIVE,
    top_k: int = 10
):
    """
    A/B测试接口 - 支持不同推荐策略

    参数:
    - user_id: 用户ID
    - strategy: 推荐策略 (collaborative/popular/random)
    - top_k: 推荐数量
    """
    if model is None:
        raise HTTPException(status_code=503, detail="模型未加载")

    # 根据策略生成推荐
    if strategy == RecommendationStrategy.COLLABORATIVE:
        results = model.recommend(user_id, top_k=top_k)
    elif strategy == RecommendationStrategy.POPULAR:
        results = model._recommend_popular(top_k)
    else:  # random
        # 随机推荐
        random_movies = random.sample(model.movie_ids, min(top_k, len(model.movie_ids)))
        results = [{'movieId': mid, 'predicted_rating': 3.0} for mid in random_movies]

    # 添加电影信息和策略标签
    recommendations = []
    for rec in results:
        movie_id = rec['movieId']
        movie_info = movies_df[movies_df['movieId'] == movie_id]

        if not movie_info.empty:
            movie = movie_info.iloc[0]
            recommendations.append({
                "movieId": movie_id,
                "title": movie['title'],
                "genres": movie['genres'],
                "predicted_rating": rec['predicted_rating'],
                "strategy": strategy
            })

    return {
        "strategy": strategy,
        "recommendations": recommendations
    }

@app.post("/feedback")
async def submit_feedback(
    user_id: int,
    movie_id: int,
    liked: bool,
    strategy: str
):
    """记录用户反馈用于 A/B 测试分析"""
    feedback_storage.append({
        "user_id": user_id,
        "movie_id": movie_id,
        "liked": liked,
        "strategy": strategy,
        "timestamp": datetime.now().isoformat()
    })
    return {"status": "success", "message": "反馈已记录"}

@app.get("/ab-test/results")
async def get_ab_test_results():
    """获取 A/B 测试结果统计"""
    if not feedback_storage:
        return {"message": "暂无反馈数据"}

    # 按策略分组统计
    from collections import defaultdict
    stats = defaultdict(lambda: {"likes": 0, "total": 0})

    for fb in feedback_storage:
        strategy = fb['strategy']
        stats[strategy]['total'] += 1
        if fb['liked']:
            stats[strategy]['likes'] += 1

    results = {}
    for strategy, data in stats.items():
        results[strategy] = {
            "total_feedback": data['total'],
            "likes": data['likes'],
            "like_rate": data['likes'] / data['total'] if data['total'] > 0 else 0
        }

    return results

# 推荐解释接口
@app.get("/recommend/{user_id}/explain")
async def explain_recommendation(user_id: int, movie_id: int):
    """
    解释为什么推荐这部电影

    参数:
    - user_id: 用户ID
    - movie_id: 电影ID
    """
    if model is None:
        raise HTTPException(status_code=503, detail="模型未加载")

    if user_id not in model.user_ids:
        raise HTTPException(status_code=404, detail="用户不存在于训练数据中")

    if movie_id not in model.movie_ids:
        raise HTTPException(status_code=404, detail="电影不存在于训练数据中")

    # 1. 找到用户喜欢的相似电影
    user_idx = model.user_ids.index(user_id)
    user_ratings = model.user_item_matrix.iloc[user_idx]
    highly_rated = user_ratings[user_ratings >= 4.0].index.tolist()

    # 2. 计算推荐电影与用户喜欢电影的相似度
    movie_idx = model.movie_ids.index(movie_id)
    movie_vector = model.item_factors[movie_idx].reshape(1, -1)

    similar_movies = []
    for rated_movie_id in highly_rated[:10]:  # 取前10部
        if rated_movie_id == movie_id:
            continue

        rated_idx = model.movie_ids.index(rated_movie_id)
        rated_vector = model.item_factors[rated_idx].reshape(1, -1)
        similarity = float(cosine_similarity(movie_vector, rated_vector)[0][0])

        movie_info = movies_df[movies_df['movieId'] == rated_movie_id]
        if not movie_info.empty:
            movie = movie_info.iloc[0]
            similar_movies.append({
                'movieId': int(rated_movie_id),
                'title': movie['title'],
                'genres': movie['genres'],
                'similarity': similarity,
                'your_rating': float(user_ratings[rated_movie_id])
            })

    # 按相似度排序
    similar_movies.sort(key=lambda x: x['similarity'], reverse=True)

    # 获取推荐电影信息
    recommended_movie_info = movies_df[movies_df['movieId'] == movie_id].iloc[0]

    return {
        "movieId": movie_id,
        "title": recommended_movie_info['title'],
        "genres": recommended_movie_info['genres'],
        "predicted_rating": float(model.predict_rating(user_id, movie_id)),
        "explanation": "基于你喜欢的以下电影，我们推荐了这部电影",
        "based_on": similar_movies[:3],
        "total_similar_movies": len(similar_movies)
    }

# 前端路由处理（必须放在最后）
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    """服务前端应用"""
    frontend_build_path = "frontend/build"
    
    if not os.path.exists(frontend_build_path):
        raise HTTPException(status_code=404, detail="前端未构建")
    
    # 如果请求的是文件且存在，返回该文件
    file_path = os.path.join(frontend_build_path, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # 否则返回 index.html（用于 React Router）
    index_path = os.path.join(frontend_build_path, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    raise HTTPException(status_code=404, detail="页面不存在")
