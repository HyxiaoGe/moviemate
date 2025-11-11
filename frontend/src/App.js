import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import MovieDetail from './pages/MovieDetail';
import Search from './pages/Search';

function App() {
  const [currentUser, setCurrentUser] = useState(1);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* 导航栏 */}
        <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Link to="/" className="text-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                🎬 MovieMate
              </Link>
              
              <div className="flex items-center gap-4 md:gap-6 flex-wrap">
                <Link to="/" className="hover:text-indigo-200 transition-colors font-medium">首页</Link>
                <Link to="/recommendations" className="hover:text-indigo-200 transition-colors font-medium">
                  我的推荐
                </Link>
                <Link to="/search" className="hover:text-indigo-200 transition-colors font-medium">搜索</Link>
                
                {/* 用户选择器 */}
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <span className="text-sm">用户:</span>
                  <input
                    type="number"
                    value={currentUser}
                    onChange={(e) => setCurrentUser(parseInt(e.target.value))}
                    className="w-16 px-2 py-1 rounded text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-300 outline-none"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* 主内容 */}
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/recommendations" 
              element={<Recommendations userId={currentUser} />} 
            />
            <Route path="/movie/:movieId" element={<MovieDetail />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>

        {/* 页脚 - 固定在底部 */}
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center">
              <p className="text-gray-300">MovieMate © 2025 - AI 驱动的电影推荐系统</p>
              <p className="text-gray-400 text-sm mt-2">基于协同过滤算法，为您推荐最适合的电影</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;