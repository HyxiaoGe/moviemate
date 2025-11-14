import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Globe } from 'lucide-react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import MovieDetail from './pages/MovieDetail';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const [currentUser, setCurrentUser] = useState(1);
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  // 处理用户ID变化的回调函数
  const handleUserIdChange = (newUserId) => {
    setCurrentUser(newUserId);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  // 判断是否为当前页面
  const isActive = (path) => {
    return location.pathname === path;
  };

  // 获取导航链接的样式
  const getNavLinkClass = (path) => {
    const baseClass = "hover:text-indigo-200 transition-colors font-medium px-2 py-1 whitespace-nowrap text-sm md:text-base rounded";
    const activeClass = isActive(path) ? "bg-white/20" : "";
    return `${baseClass} ${activeClass}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* 导航栏 */}
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white shadow-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <Link to="/" className="text-xl md:text-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform flex-shrink-0">
                🎬 MovieMate
              </Link>

              <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                {/* 导航链接 - 在小屏幕上隐藏文字，只显示图标 */}
                <Link to="/" className={getNavLinkClass('/')}>
                  <span className="hidden sm:inline">{t('nav.home')}</span>
                  <span className="sm:hidden">🏠</span>
                </Link>
                <Link to="/recommendations" className={getNavLinkClass('/recommendations')}>
                  <span className="hidden sm:inline">{t('nav.recommendations')}</span>
                  <span className="sm:hidden">⭐</span>
                </Link>
                <Link to="/dashboard" className={getNavLinkClass('/dashboard')}>
                  <span className="hidden sm:inline">{t('nav.dashboard')}</span>
                  <span className="sm:hidden">📊</span>
                </Link>
                <Link to="/search" className={getNavLinkClass('/search')}>
                  <span className="hidden sm:inline">{t('nav.search')}</span>
                  <span className="sm:hidden">🔍</span>
                </Link>

                {/* 用户ID显示 */}
                <div className="flex items-center gap-1.5 md:gap-2 bg-white/20 px-3 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-sm flex-shrink-0 shadow-lg border border-white/30">
                  <span className="text-xs md:text-sm whitespace-nowrap opacity-90">👤</span>
                  <span className="text-xs md:text-sm font-semibold tracking-wide">{currentUser}</span>
                </div>

                {/* 主题切换 */}
                <button
                  onClick={toggleTheme}
                  className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-colors w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0"
                  aria-label="Toggle theme"
                  title={isDark ? 'Light mode' : 'Dark mode'}
                >
                  {isDark ? <Sun size={18} className="md:w-5 md:h-5" /> : <Moon size={18} className="md:w-5 md:h-5" />}
                </button>

                {/* 语言切换 */}
                <button
                  onClick={toggleLanguage}
                  className="px-2 md:px-3 py-1.5 md:py-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1 justify-center flex-shrink-0"
                  aria-label="Toggle language"
                  title="Switch language"
                >
                  <Globe size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="text-xs md:text-sm font-medium w-5 md:w-[20px] text-center">{i18n.language === 'zh' ? 'EN' : '中'}</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* 主内容 */}
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home currentUserId={currentUser} onUserIdChange={handleUserIdChange} />} />
            <Route
              path="/recommendations"
              element={<Recommendations userId={currentUser} onUserIdChange={handleUserIdChange} />}
            />
            <Route path="/dashboard" element={<Dashboard onUserIdChange={handleUserIdChange} />} />
            <Route path="/movie/:movieId" element={<MovieDetail />} />
            <Route path="/search" element={<Search onUserIdChange={handleUserIdChange} />} />
          </Routes>
        </main>

        {/* 页脚 - 固定在底部 */}
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-950 dark:to-gray-900 text-white mt-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center">
              <p className="text-gray-300">MovieMate © 2025 - {t('footer.copyright')}</p>
              <p className="text-gray-400 text-sm mt-2">{t('footer.description')}</p>
            </div>
          </div>
        </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;