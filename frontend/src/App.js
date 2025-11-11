import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import MovieDetail from './pages/MovieDetail';
import Search from './pages/Search';

function App() {
  const [currentUser, setCurrentUser] = useState(1);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* 导航栏 */}
        <nav className="bg-indigo-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold flex items-center gap-2">
                🎬 MovieMate
              </Link>
              
              <div className="flex items-center gap-6">
                <Link to="/" className="hover:text-indigo-200">首页</Link>
                <Link to="/recommendations" className="hover:text-indigo-200">
                  我的推荐
                </Link>
                <Link to="/search" className="hover:text-indigo-200">搜索</Link>
                
                {/* 用户选择器 */}
                <div className="flex items-center gap-2">
                  <span>用户:</span>
                  <input
                    type="number"
                    value={currentUser}
                    onChange={(e) => setCurrentUser(parseInt(e.target.value))}
                    className="w-20 px-2 py-1 rounded text-gray-900"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* 主内容 */}
        <main className="container mx-auto px-4 py-8">
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

        {/* 页脚 */}
        <footer className="bg-gray-800 text-white text-center py-6 mt-12">
          <p>MovieMate © 2025 - AI 驱动的电影推荐系统</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;