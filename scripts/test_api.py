"""
API 测试脚本
前提：API 已启动（uvicorn src.api.main:app --reload）
运行：python scripts/test_api.py
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def print_response(title, response):
    """打印响应结果"""
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    else:
        print(f"错误: {response.text}")

def test_api():
    print("开始测试 MovieMate API")
    
    # 1. 健康检查
    response = requests.get(f"{BASE_URL}/health")
    print_response("1. 健康检查", response)
    
    # 2. 系统统计
    response = requests.get(f"{BASE_URL}/stats")
    print_response("2. 系统统计", response)
    
    # 3. 为用户推荐
    user_id = 1
    response = requests.get(f"{BASE_URL}/recommend/{user_id}?top_k=5")
    print_response(f"3. 为用户 {user_id} 推荐电影", response)
    
    # 4. 预测评分
    movie_id = 1
    response = requests.get(f"{BASE_URL}/predict?user_id={user_id}&movie_id={movie_id}")
    print_response(f"4. 预测用户 {user_id} 对电影 {movie_id} 的评分", response)
    
    # 5. 相似电影
    response = requests.get(f"{BASE_URL}/similar/{movie_id}?top_k=3")
    print_response(f"5. 与电影 {movie_id} 相似的电影", response)
    
    # 6. 搜索电影
    query = "Toy Story"
    response = requests.get(f"{BASE_URL}/movies/search/{query}")
    print_response(f"6. 搜索电影: {query}", response)
    
    print("\n" + "=" * 60)
    print("✓ API 测试完成！")
    print("=" * 60)

if __name__ == "__main__":
    test_api()