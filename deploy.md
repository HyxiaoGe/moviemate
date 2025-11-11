# MovieMate Docker 部署指南

## 快速开始

### 1. 构建镜像
```bash
docker build -t moviemate-api .
```

### 2. 运行容器
```bash
docker run -d \
  --name moviemate-api \
  -p 8000:8000 \
  -v $(pwd)/data:/app/data \
  moviemate-api
```

### 3. 使用 Docker Compose（推荐）
```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 部署前准备

### 确保数据和模型已准备
在首次部署前，需要训练模型：

```bash
# 本地训练模型
python scripts/train_model.py

# 或在容器内训练
docker-compose exec moviemate-api python scripts/train_model.py
```

## 访问服务

- API 文档: http://localhost:8000/docs
- 健康检查: http://localhost:8000/health
- 推荐接口: http://localhost:8000/recommend/{user_id}

## 生产环境部署建议

### 1. 使用环境变量
创建 `.env` 文件：
```env
API_HOST=0.0.0.0
API_PORT=8000
WORKERS=4
```

### 2. 多进程部署
修改 Dockerfile 的 CMD：
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
    }
}
```

### 4. 数据持久化
确保 `data` 目录已挂载到宿主机，避免容器重启后数据丢失。

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
检查 `data/models/cf_model.pkl` 是否存在，如不存在需要先训练模型。

### 端口冲突
修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "8080:8000"  # 改为其他端口
```

### 内存不足
增加 Docker 内存限制：
```yaml
deploy:
  resources:
    limits:
      memory: 2G
```
