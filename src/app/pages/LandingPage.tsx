import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';

const LANGUAGES = [
  { code: 'en' as Language, label: 'English', flag: '🇬🇧', native: 'English' },
  { code: 'ta' as Language, label: 'Tamil', flag: '🇮🇳', native: 'தமிழ்' },
  { code: 'hi' as Language, label: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
];

const FloatingItem = ({ emoji, style, delay }: { emoji: string; style: string; delay: number }) => (
  <motion.div
    className={`absolute text-5xl select-none pointer-events-none ${style}`}
    animate={{ y: [0, -18, 0], rotate: [0, 8, -4, 0] }}
    transition={{ duration: 3.5 + delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    {emoji}
  </motion.div>
);

export function LandingPage() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', username: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('student_name', loginData.username || 'Super Star');
    navigate('/dashboard');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('student_name', signupData.name || signupData.username || 'Super Star');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 30%, #f093fb 60%, #f5576c 100%)' }}>

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #FFD700, #FF6B6B)' }} />
        <motion.div animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #00F5A0, #00D9F5)' }} />
      </div>

      {/* Floating school items */}
      <FloatingItem emoji="✏️" style="top-16 left-6" delay={0} />
      <FloatingItem emoji="📚" style="top-20 right-8" delay={0.5} />
      <FloatingItem emoji="🎒" style="bottom-40 left-4" delay={1} />
      <FloatingItem emoji="📏" style="bottom-48 right-6" delay={0.3} />
      <FloatingItem emoji="🖊️" style="top-48 left-20" delay={1.2} />
      <FloatingItem emoji="🌍" style="top-36 right-24" delay={0.8} />
      <FloatingItem emoji="🔬" style="bottom-64 left-24" delay={0.4} />
      <FloatingItem emoji="🧮" style="bottom-32 right-28" delay={1.5} />

      {/* Language selector - top bar */}
      <div className="relative z-10 flex justify-end p-4">
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2">
          <Globe className="w-5 h-5 text-white" />
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${
                language === lang.code
                  ? 'bg-white text-purple-700 shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {lang.flag} {lang.native}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pb-16" style={{ minHeight: 'calc(100vh - 80px)' }}>

        {/* Mascot / Illustration */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8, bounce: 0.4 }}
          className="mb-6 relative"
        >
          <div className="w-44 h-44 rounded-full flex items-center justify-center shadow-2xl relative" style={{ background: 'linear-gradient(135deg, #FFF9C4, #FFE082)' }}>
            <span className="text-8xl">🎓</span>
            {/* Sparkles around */}
            <motion.span animate={{ rotate: 360, scale: [1, 1.3, 1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-3 -right-3 text-3xl">✨</motion.span>
            <motion.span animate={{ rotate: -360, scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-2 -left-3 text-2xl">⭐</motion.span>
          </div>
        </motion.div>

        {/* App name */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-2"
        >
          <h1 className="text-6xl font-black text-white drop-shadow-2xl tracking-tight" style={{ fontFamily: 'var(--font-playful)', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            {t.appName}
          </h1>
          <p className="text-2xl text-white/90 font-bold mt-2 drop-shadow" style={{ fontFamily: 'var(--font-body)' }}>
            {t.tagline}
          </p>
        </motion.div>

        {/* Subject preview pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 mt-4 mb-8 flex-wrap justify-center"
        >
          {[
            { emoji: '📘', label: t.mathematics, color: 'from-blue-400 to-blue-600' },
            { emoji: '🔬', label: t.science, color: 'from-green-400 to-emerald-600' },
            { emoji: '📖', label: t.english, color: 'from-purple-400 to-pink-600' },
          ].map((s) => (
            <div key={s.label} className={`bg-gradient-to-r ${s.color} text-white px-5 py-2.5 rounded-full font-bold text-base shadow-lg flex items-center gap-2`} style={{ fontFamily: 'var(--font-body)' }}>
              {s.emoji} {s.label}
            </div>
          ))}
        </motion.div>

        {/* Features banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/20 backdrop-blur-md rounded-3xl px-8 py-5 mb-8 max-w-sm w-full text-center"
        >
          <div className="grid grid-cols-2 gap-3 text-white">
            {[
              { icon: '🎯', text: '100+ Lessons' },
              { icon: '🏆', text: 'Fun Quizzes' },
              { icon: '🎬', text: 'Videos' },
              { icon: '🤖', text: 'AI Teacher' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-2 font-bold text-sm">
                <span className="text-xl">{f.icon}</span>
                <span style={{ fontFamily: 'var(--font-body)' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Auth buttons */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-4 w-full max-w-sm"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowLogin(true)}
            className="w-full py-5 rounded-3xl text-2xl font-black text-white shadow-2xl transition-all"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)', fontFamily: 'var(--font-playful)', boxShadow: '0 8px 32px rgba(124, 58, 237, 0.5)' }}
          >
            {t.login} 🚀
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowSignup(true)}
            className="w-full py-5 rounded-3xl text-2xl font-black text-white shadow-2xl transition-all"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)', fontFamily: 'var(--font-playful)', boxShadow: '0 8px 32px rgba(16, 185, 129, 0.5)' }}
          >
            {t.signUp} ✨
          </motion.button>
        </motion.div>

        {/* Quick access */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          onClick={handleLogin}
          className="mt-5 text-white/80 text-base font-bold underline underline-offset-4 hover:text-white transition-colors"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Try as Guest →
        </motion.button>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center mb-6">
              <span className="text-6xl">👋</span>
              <h2 className="text-3xl font-black text-purple-700 mt-3" style={{ fontFamily: 'var(--font-playful)' }}>
                {t.welcomeBack}
              </h2>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2" style={{ fontFamily: 'var(--font-body)' }}>{t.username}</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className="w-full px-5 py-4 border-3 border-purple-200 rounded-2xl text-lg focus:outline-none focus:border-purple-500 bg-purple-50 transition-all"
                  placeholder="Enter your username"
                  style={{ fontFamily: 'var(--font-body)', borderWidth: '3px' }}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2" style={{ fontFamily: 'var(--font-body)' }}>{t.password}</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-5 py-4 border-3 border-purple-200 rounded-2xl text-lg focus:outline-none focus:border-purple-500 bg-purple-50 transition-all"
                  placeholder="Enter your password"
                  style={{ fontFamily: 'var(--font-body)', borderWidth: '3px' }}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="flex-1 text-white text-xl font-black py-4 rounded-2xl transition-all"
                  style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)', fontFamily: 'var(--font-playful)' }}
                >
                  {t.login} 🎉
                </motion.button>
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="flex-1 bg-gray-100 text-gray-600 text-xl font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center mb-6">
              <span className="text-6xl">🎈</span>
              <h2 className="text-3xl font-black text-green-700 mt-3" style={{ fontFamily: 'var(--font-playful)' }}>
                {t.joinFun}
              </h2>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2" style={{ fontFamily: 'var(--font-body)' }}>{t.name}</label>
                <input
                  type="text"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  className="w-full px-5 py-4 bg-green-50 rounded-2xl text-lg focus:outline-none transition-all"
                  placeholder="Your full name"
                  style={{ fontFamily: 'var(--font-body)', border: '3px solid #86EFAC' }}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2" style={{ fontFamily: 'var(--font-body)' }}>{t.username}</label>
                <input
                  type="text"
                  required
                  value={signupData.username}
                  onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                  className="w-full px-5 py-4 bg-green-50 rounded-2xl text-lg focus:outline-none transition-all"
                  placeholder="Choose a username"
                  style={{ fontFamily: 'var(--font-body)', border: '3px solid #86EFAC' }}
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2" style={{ fontFamily: 'var(--font-body)' }}>{t.password}</label>
                <input
                  type="password"
                  required
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="w-full px-5 py-4 bg-green-50 rounded-2xl text-lg focus:outline-none transition-all"
                  placeholder="Choose a password"
                  style={{ fontFamily: 'var(--font-body)', border: '3px solid #86EFAC' }}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="flex-1 text-white text-xl font-black py-4 rounded-2xl transition-all"
                  style={{ background: 'linear-gradient(135deg, #10B981, #059669)', fontFamily: 'var(--font-playful)' }}
                >
                  {t.signUp} 🌟
                </motion.button>
                <button
                  type="button"
                  onClick={() => setShowSignup(false)}
                  className="flex-1 bg-gray-100 text-gray-600 text-xl font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
