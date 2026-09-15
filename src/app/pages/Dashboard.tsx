import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Calculator, FlaskConical, BookText, Award, Star, Trophy, LogOut, Video, Bot, BarChart, Target, Shield, Flame, Globe, Clock } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';

const LANGUAGES = [
  { code: 'en' as Language, flag: '🇬🇧', native: 'English' },
  { code: 'ta' as Language, flag: '🇮🇳', native: 'தமிழ்' },
  { code: 'hi' as Language, flag: '🇮🇳', native: 'हि' },
];

const mathTopics = ['numbers', 'addition', 'subtraction', 'multiplication', 'division', 'fractions', 'shapes', 'measurement', 'time', 'money', 'patterns', 'place-value', 'comparing', 'word-problems', 'odd-even', 'skip-counting', 'number-lines', 'algebra', 'data-graphs', 'mental-math'];
const scienceTopics = ['plants', 'animals', 'human-body', 'earth-space', 'weather', 'water-cycle', 'environment', 'energy', 'food-nutrition', 'health', 'simple-machines', 'light-sound', 'air-wind', 'magnets', 'living-nonliving', 'habitats', 'life-cycles', 'seasons', 'experiments', 'earth-rocks'];
const englishTopics = ['alphabet', 'phonics', 'sight-words', 'nouns', 'pronouns', 'verbs', 'adjectives', 'adverbs', 'articles', 'prepositions', 'conjunctions', 'sentences', 'punctuation', 'reading', 'creative-writing', 'tenses', 'plurals', 'antonyms', 'vocabulary', 'story-writing'];

export function Dashboard() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [studentName, setStudentName] = useState('Super Star');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) navigate('/');
    setStudentName(localStorage.getItem('student_name') || 'Super Star');
    setStreak(parseInt(localStorage.getItem('streak_days') || String(Math.floor(Math.random() * 8) + 1)));
  }, [navigate]);

  const getTopicProgress = (subject: string, topics: string[]) => {
    const completed = topics.filter(t => localStorage.getItem(`${subject}_${t}_completed`) === 'true').length;
    return { completed, total: topics.length };
  };

  const mathProg = getTopicProgress('math', mathTopics);
  const scienceProg = getTopicProgress('science', scienceTopics);
  const englishProg = getTopicProgress('english', englishTopics);

  const getTotalStars = () => {
    return parseInt(localStorage.getItem('math_stars') || '0') +
      parseInt(localStorage.getItem('science_stars') || '0') +
      parseInt(localStorage.getItem('english_stars') || '0');
  };

  const totalLessons = mathProg.completed + scienceProg.completed + englishProg.completed;
  const totalTopics = mathTopics.length + scienceTopics.length + englishTopics.length;

  const subjects = [
    {
      id: 'math',
      emoji: '📘',
      title: t.mathematics,
      sub: 'Numbers, Shapes & More',
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'from-blue-50 to-indigo-50',
      ring: 'ring-blue-400',
      icon: Calculator,
      progress: mathProg,
      color: 'text-blue-600',
      barColor: 'bg-blue-500',
    },
    {
      id: 'science',
      emoji: '🔬',
      title: t.science,
      sub: 'Plants, Animals & Space',
      gradient: 'from-emerald-500 to-green-600',
      bg: 'from-emerald-50 to-green-50',
      ring: 'ring-green-400',
      icon: FlaskConical,
      progress: scienceProg,
      color: 'text-emerald-600',
      barColor: 'bg-emerald-500',
    },
    {
      id: 'english',
      emoji: '📖',
      title: t.english,
      sub: 'Grammar, Reading & Writing',
      gradient: 'from-purple-500 to-pink-600',
      bg: 'from-purple-50 to-pink-50',
      ring: 'ring-purple-400',
      icon: BookText,
      progress: englishProg,
      color: 'text-purple-600',
      barColor: 'bg-purple-500',
    },
  ];

  const tools = [
    { id: 'ai-teacher', emoji: '🤖', title: t.aiTeacher, sub: 'Ask me anything!', gradient: 'from-pink-500 to-rose-600', icon: Bot },
    { id: 'challenges', emoji: '🏆', title: t.challenges, sub: 'Earn rewards!', gradient: 'from-amber-500 to-orange-600', icon: Target },
    { id: 'history', emoji: '📚', title: 'My History', sub: 'Progress & badges', gradient: 'from-purple-500 to-indigo-600', icon: Clock },
    { id: 'parent-dashboard', emoji: '📊', title: t.parentDashboard, sub: 'Track learning', gradient: 'from-teal-500 to-green-600', icon: BarChart },
    { id: 'admin', emoji: '⚙️', title: t.admin, sub: 'Manage content', gradient: 'from-slate-600 to-gray-700', icon: Shield },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #EDE9FE 0%, #FFF8F0 50%, #ECFDF5 100%)' }}>
      {/* Header */}
      <div className="sticky top-0 z-40" style={{ background: 'linear-gradient(135deg, #7C3AED, #DB2777)', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: greeting */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">🎓</div>
              <div className="min-w-0">
                <p className="text-white/80 text-sm font-bold" style={{ fontFamily: 'var(--font-body)' }}>Hello,</p>
                <h1 className="text-white text-xl font-black truncate" style={{ fontFamily: 'var(--font-playful)' }}>{studentName}! 👋</h1>
              </div>
            </div>

            {/* Right: stars, streak, lang, logout */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Stars */}
              <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-2xl flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span className="text-white font-black text-sm">{getTotalStars()}</span>
              </div>
              {/* Streak */}
              <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-2xl flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-300" />
                <span className="text-white font-black text-sm">{streak}</span>
              </div>
              {/* Language */}
              <div className="relative">
                <button
                  onClick={() => setShowLangPicker(!showLangPicker)}
                  className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-2xl flex items-center gap-1 hover:bg-white/30 transition-all"
                >
                  <Globe className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-bold">{LANGUAGES.find(l => l.code === language)?.flag}</span>
                </button>
                {showLangPicker && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 min-w-max">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setShowLangPicker(false); }}
                        className={`w-full px-5 py-3 text-left font-bold hover:bg-purple-50 flex items-center gap-3 text-sm ${language === lang.code ? 'bg-purple-50 text-purple-700' : 'text-gray-700'}`}
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        {lang.native}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Logout */}
              <button
                onClick={() => { localStorage.removeItem('isLoggedIn'); navigate('/'); }}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-2 rounded-2xl flex items-center gap-1.5 transition-all"
              >
                <LogOut className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-xs hidden sm:inline">{t.logout}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats row */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50', value: totalLessons, label: t.lessonsCompleted },
            { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50', value: getTotalStars(), label: t.starsEarned },
            { icon: Award, color: 'text-purple-500', bg: 'bg-purple-50', value: `${Math.round((totalLessons / totalTopics) * 100)}%`, label: t.progress },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`${stat.bg} rounded-3xl p-4 text-center shadow-sm border border-white`}
              >
                <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-1`} />
                <p className="text-2xl font-black text-gray-800" style={{ fontFamily: 'var(--font-playful)' }}>{stat.value}</p>
                <p className="text-xs font-bold text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Subject cards */}
        <h2 className="text-2xl font-black text-gray-700 mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-playful)' }}>
          <span>📚</span> Choose a Subject
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {subjects.map((subject, i) => {
            const Icon = subject.icon;
            const pct = Math.round((subject.progress.completed / subject.progress.total) * 100);
            return (
              <motion.div
                key={subject.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/${subject.id}`)}
                className="cursor-pointer rounded-3xl overflow-hidden shadow-xl"
              >
                {/* Top gradient */}
                <div className={`bg-gradient-to-br ${subject.gradient} p-6 relative`}>
                  <div className="absolute top-4 right-4 bg-white/20 rounded-2xl px-3 py-1">
                    <span className="text-white font-black text-sm">{pct}%</span>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                      <Icon className={`w-9 h-9 ${subject.color}`} />
                    </div>
                    <div>
                      <span className="text-4xl">{subject.emoji}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-playful)' }}>{subject.title}</h3>
                  <p className="text-white/80 text-sm font-bold" style={{ fontFamily: 'var(--font-body)' }}>{subject.sub}</p>
                </div>

                {/* Bottom content */}
                <div className={`bg-gradient-to-br ${subject.bg} p-5`}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                      {subject.progress.completed} / {subject.progress.total} {t.topics}
                    </span>
                    <span className={`font-black ${subject.color}`}>{pct}%</span>
                  </div>
                  <div className="bg-white rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                      className={`${subject.barColor} h-full rounded-full`}
                    />
                  </div>
                  <button className={`w-full mt-4 bg-gradient-to-r ${subject.gradient} text-white font-black text-lg py-3 rounded-2xl shadow-md hover:shadow-lg transition-all`} style={{ fontFamily: 'var(--font-playful)' }}>
                    {t.startLearning} 🚀
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tools grid */}
        <h2 className="text-2xl font-black text-gray-700 mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-playful)' }}>
          <span>✨</span> Learning Tools
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/${tool.id}`)}
                className={`bg-gradient-to-br ${tool.gradient} rounded-3xl p-5 cursor-pointer text-white text-center shadow-xl`}
              >
                <span className="text-4xl mb-2 block">{tool.emoji}</span>
                <h3 className="font-black text-sm leading-tight" style={{ fontFamily: 'var(--font-playful)' }}>{tool.title}</h3>
                <p className="text-xs opacity-80 mt-1 font-bold" style={{ fontFamily: 'var(--font-body)' }}>{tool.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Continue learning banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 rounded-3xl p-6 text-white flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #F97316, #EF4444)' }}
        >
          <span className="text-5xl flex-shrink-0">🔥</span>
          <div className="flex-1">
            <h3 className="text-xl font-black" style={{ fontFamily: 'var(--font-playful)' }}>
              {streak} Day Learning Streak!
            </h3>
            <p className="text-white/90 text-sm font-bold" style={{ fontFamily: 'var(--font-body)' }}>
              Keep it up! You're doing amazing! Complete a lesson to maintain your streak.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/math')}
            className="flex-shrink-0 bg-white text-orange-600 font-black px-5 py-3 rounded-2xl text-sm shadow-md"
            style={{ fontFamily: 'var(--font-playful)' }}
          >
            Learn Now!
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
