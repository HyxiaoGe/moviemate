#!/bin/bash

# MovieMate 启动脚本

echo "🎬 MovieMate 启动中..."

# 检查模型文件是否存在
if [ ! -f "data/models/cf_model.pkl" ]; then
    echo "⚠️  模型文件不存在，正在训练模型..."
    python scripts/train_model.py
    
    if [ $? -ne 0 ]; then
        echo "❌ 模型训练失败！"
        exit 1
    fi
    echo "✓ 模型训练完成"
fi

# 启动 API 服务
echo "🚀 启动 API 服务..."
uvicorn src.api.main:app --host 0.0.0.0 --port 8000
