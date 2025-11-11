# MovieMate 部署指南

## 本地开发

### 后端开发
```bash
# 安装依赖
pip install -r requirements.txt

# 训练模型
python scripts/train_model.py

# 启动后端
uvicorn src.api.main:app --reload
```

### 前端开发
```bash
cd frontend
npm install
npm start
```

开发环境下前后端分离运行，前端访问 http://localhost:3000，后端 API 在 http://localhost:8000

## Docker 部署

### 快速开始

#### 1. 使用 Docker Compose（推荐）
```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 2. 手动构建和运行
```bash
# 构建镜像
docker build -t moviemate:latest .

# 运行容器
docker run -d \
  --name moviemate \
  -p 8000:8000 \
  -v $(pwd)/data:/app/data \
  moviemate:latest
```

### 部署前准备

**重要：首次部署前必须先训练模型**

```bash
# 本地训练模型
python scripts/train_model.py

# 或在容器内训练
docker-compose exec moviemate-api python scripts/train_model.py
```

确保以下文件存在：
- `data/models/cf_model.pkl`
- `data/processed/movies.csv`

## 访问应用

- **前端界面**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs
- **健康检查**: http://localhost:8000/health
- **推荐接口**: http://localhost:8000/recommend/{user_id}

## 生产环境部署

### 1. 使用环境变量

创建 `.env` 文件：
```env
API_HOST=0.0.0.0
API_PORT=8000
WORKERS=4
```

### 2. 多进程部署

修改 Dockerfile 的 CMD 使用多个 worker：
```dockerfile
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

### 3. 使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. 数据持久化

确保 `data` 目录已挂载到宿主机，避免容器重启后数据丢失：
```yaml
volumes:
  - ./data:/app/data
```

## 常用命令

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f moviemate-api

# 重启服务
docker-compose restart

# 进入容器
docker-compose exec moviemate-api bash

# 更新镜像
docker-compose build --no-cache
docker-compose up -d
```

## 故障排查

### 模型未加载
**问题**: API 返回 503 错误，提示"模型未加载"

**解决**: 检查 `data/models/cf_model.pkl` 是否存在，如不存在需要先训练模型：
```bash
python scripts/train_model.py
```

### 端口冲突
**问题**: 端口 8000 已被占用

**解决**: 修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "8080:8000"  # 改为其他端口
```

### 内存不足
**问题**: 容器因内存不足被杀死

**解决**: 增加 Docker 内存限制：
```yaml
deploy:
  resources:
    limits:
      memory: 2G
```

### 前端无法访问
**问题**: 访问 http://localhost:8000 显示 404

**解决**: 
1. 确保前端已在 Docker 构建时编译
2. 检查 `frontend/build` 目录是否存在
3. 查看容器日志确认前端静态文件是否挂载成功

## 架构说明

- **前端**: React 应用，构建后的静态文件由 FastAPI 服务
- **后端**: FastAPI 提供 RESTful API
- **部署**: 单容器部署，前后端整合在一起
- **API 路径**: 前端通过相对路径调用后端 API，无需配置跨域
