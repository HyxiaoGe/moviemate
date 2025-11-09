# MovieMate - 电影推荐系统

基于协同过滤的电影推荐API

## 功能特性

- 个性化电影推荐
- 评分预测
- 相似电影推荐

## 技术栈

- Python 3.9+
- FastAPI
- Scikit-surprise
- Pandas

## 快速开始

\`\`\`bash
# 安装依赖
pip install -r requirements.txt

# 下载数据
bash scripts/download_data.sh

# 训练模型
python scripts/train_model.py

# 启动API
uvicorn src.api.main:app --reload
\`\`\`

## API文档

启动后访问：http://localhost:8000/docs

## 项目结构

\`\`\`
moviemate/
├── data/           # 数据目录
├── notebooks/      # 数据分析
├── src/            # 源代码
└── tests/          # 测试
\`\`\`

## 开发计划

- [x] 项目初始化
- [ ] 数据探索与分析
- [ ] 训练协同过滤模型
- [ ] 构建FastAPI接口
- [ ] 添加前端界面
- [ ] 部署上线
