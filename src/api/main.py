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
import pandas as pd
import os

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
@app.get("/")
async def root():
    """根路径"""
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
