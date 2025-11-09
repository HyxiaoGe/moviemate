"""
检查开发环境是否就绪
"""
import sys

def check_environment():
    print("=" * 50)
    print("MovieMate 环境检查")
    print("=" * 50)
    
    # 检查Python版本
    print(f"\n✓ Python版本: {sys.version}")
    
    # 检查依赖包
    packages = [
        'fastapi',
        'pandas',
        'numpy',
        'sklearn',
        'surprise',
        'uvicorn'
    ]
    
    print("\n检查依赖包:")
    for package in packages:
        try:
            __import__(package)
            print(f"  ✓ {package}")
        except ImportError:
            print(f"  ✗ {package} - 未安装")
    
    # 检查数据目录
    import os
    data_path = "data/raw/ml-latest-small"
    if os.path.exists(data_path):
        print(f"\n✓ 数据集已下载: {data_path}")
        files = os.listdir(data_path)
        print(f"  包含文件: {', '.join(files)}")
    else:
        print(f"\n✗ 数据集未下载")
        print("  请运行: bash scripts/download_data.sh")
    
    print("\n" + "=" * 50)
    print("环境检查完成!")
    print("=" * 50)

if __name__ == "__main__":
    check_environment()
