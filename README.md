# MovieMate - 电影推荐系统

基于协同过滤的电影推荐 API

## 功能特性

✅ 个性化电影推荐  
✅ 评分预测  
✅ 相似电影查找  
✅ 电影搜索  
✅ RESTful API  

## 技术栈

- **Python 3.12**
- **FastAPI** - Web 框架
- **scikit-learn** - 机器学习
- **Pandas** - 数据处理
- **NumPy** - 数值计算

## 快速开始

### 1. 安装依赖
```bash
# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt
```

### 2. 下载数据
```bash
cd data/raw
wget https://files.grouplens.org/datasets/movielens/ml-latest-small.zip
unzip ml-latest-small.zip
cd ../..
```

### 3. 训练模型
```bash
python scripts/train_model.py
```

### 4. 启动 API
```bash
uvicorn src.api.main:app --reload
```

### 5. 访问文档

打开浏览器：http://127.0.0.1:8000/docs

## API 接口

### 获取推荐
```bash
GET /recommend/{user_id}?top_k=10
```

为指定用户推荐电影

### 预测评分
```bash
GET /predict?user_id=1&movie_id=1
```

预测用户对电影的评分

### 相似电影
```bash
GET /similar/{movie_id}?top_k=5
```

查找相似的电影

### 搜索电影
```bash
GET /movies/search/{query}
```

按标题搜索电影

## 项目结构
```
moviemate/
├── data/
│   ├── raw/              # 原始数据
│   ├── processed/        # 处理后的数据
│   └── models/           # 训练好的模型
├── src/
│   ├── models/           # 推荐模型
│   └── api/              # FastAPI 应用
├── scripts/              # 工具脚本
│   ├── explore_data.py   # 数据探索
│   ├── train_model.py    # 训练模型
│   └── test_api.py       # API 测试
├── requirements.txt      # 依赖
└── README.md
```

## 示例

### Python 客户端
```python
import requests

# 获取推荐
response = requests.get('http://127.0.0.1:8000/recommend/1?top_k=5')
recommendations = response.json()

for movie in recommendations:
    print(f"{movie['title']} - 预测评分: {movie['predicted_rating']:.2f}")
```

### curl
```bash
# 获取推荐
curl http://127.0.0.1:8000/recommend/1?top_k=5

# 预测评分
curl "http://127.0.0.1:8000/predict?user_id=1&movie_id=1"
```

## 算法说明

本项目使用 **矩阵分解（Matrix Factorization）** 实现协同过滤：

1. 构建用户-电影评分矩阵
2. 使用 SVD 分解为用户特征和电影特征
3. 通过特征向量的点积预测评分
4. 返回评分最高的电影作为推荐

## 性能指标

- 用户数：610
- 电影数：9,724
- 评分数：100,836
- 数据稀疏度：~98%

## 待优化

- [ ] 添加基于内容的推荐
- [ ] 实现深度学习模型
- [ ] 添加用户反馈机制
- [ ] 优化冷启动问题
- [ ] 添加缓存层（Redis）
- [ ] 部署到云服务

## 开发者

你的名字

## 许可证

MIT License