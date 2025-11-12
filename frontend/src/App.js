import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Globe } from 'lucide-react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import MovieDetail from './pages/MovieDetail';
import Search from './pages/Search';
import Input from './components/Input';

function AppContent() {
  const [currentUser, setCurrentUser] = useState(1);
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
        {/* 导航栏 */}
        <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white shadow-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Link to="/" className="text-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                🎬 MovieMate
              </Link>
              
              <div className="flex items-center gap-3 md:gap-6 flex-wrap">
                <Link to="/" className="hover:text-indigo-200 transition-colors font-medium">
                  {t('nav.home')}
                </Link>
                <Link to="/recommendations" className="hover:text-indigo-200 transition-colors font-medium">
                  {t('nav.recommendations')}
                </Link>
                <Link to="/search" className="hover:text-indigo-200 transition-colors font-medium">
                  {t('nav.search')}
                </Link>
                
                {/* 用户选择器 */}
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <span className="text-sm">{t('nav.user')}:</span>
                  <input
                    type="number"
                    value={currentUser}
                    onChange={(e) => setCurrentUser(parseInt(e.target.value))}
                    className="w-16 px-2 py-1 rounded text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-300 outline-none"
                    min="1"
                  />
                </div>

                {/* 主题切换 */}
                <button
                  onClick={toggleTheme}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* 语言切换 */}
                <button
                  onClick={toggleLanguage}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1"
                  aria-label="Toggle language"
                >
                  <Globe size={20} />
                  <span className="text-sm font-medium">{i18n.language === 'zh' ? 'EN' : '中'}</span>
                </button>
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
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-950 dark:to-gray-900 text-white mt-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center">
              <p className="text-gray-300">MovieMate © 2025 - {t('footer.copyright')}</p>
              <p className="text-gray-400 text-sm mt-2">{t('footer.description')}</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;