import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, Clock, Award, Star, Calendar, BarChart3, CheckCircle, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function ParentDashboard() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  // Gather progress data from localStorage
  const getMathProgress = () => {
    const mathTopics = ['numbers', 'addition', 'subtraction', 'multiplication', 'division'];
    return mathTopics.map(topic => ({
      completed: localStorage.getItem(`math_${topic}_completed`) === 'true',
      stars: parseInt(localStorage.getItem(`math_${topic}_stars`) || '0'),
      quizCompleted: localStorage.getItem(`math_${topic}_quiz_completed`) === 'true',
      quizStars: parseInt(localStorage.getItem(`math_${topic}_quiz_stars`) || '0'),
    }));
  };

  const getScienceProgress = () => {
    const scienceTopics = ['plants', 'animals', 'human-body', 'earth-space', 'weather'];
    return scienceTopics.map(topic => ({
      completed: localStorage.getItem(`science_${topic}_completed`) === 'true',
      stars: parseInt(localStorage.getItem(`science_${topic}_stars`) || '0'),
      quizCompleted: localStorage.getItem(`science_${topic}_quiz_completed`) === 'true',
      quizStars: parseInt(localStorage.getItem(`science_${topic}_quiz_stars`) || '0'),
    }));
  };

  const getEnglishProgress = () => {
    const englishTopics = ['alphabet', 'nouns', 'verbs', 'adjectives', 'sentences'];
    return englishTopics.map(topic => ({
      completed: localStorage.getItem(`english_${topic}_completed`) === 'true',
      stars: parseInt(localStorage.getItem(`english_${topic}_stars`) || '0'),
      quizCompleted: localStorage.getItem(`english_${topic}_quiz_completed`) === 'true',
      quizStars: parseInt(localStorage.getItem(`english_${topic}_quiz_stars`) || '0'),
    }));
  };

  const mathProgress = getMathProgress();
  const scienceProgress = getScienceProgress();
  const englishProgress = getEnglishProgress();

  const totalMathStars = mathProgress.reduce((sum, p) => sum + p.stars + p.quizStars, 0);
  const totalScienceStars = scienceProgress.reduce((sum, p) => sum + p.stars + p.quizStars, 0);
  const totalEnglishStars = englishProgress.reduce((sum, p) => sum + p.stars + p.quizStars, 0);

  const mathCompleted = mathProgress.filter(p => p.completed).length;
  const scienceCompleted = scienceProgress.filter(p => p.completed).length;
  const englishCompleted = englishProgress.filter(p => p.completed).length;

  const watchedVideos = JSON.parse(localStorage.getItem('watched_videos') || '[]').length;

  // Chart data
  const subjectData = [
    { subject: 'Math', completed: mathCompleted, total: 5, stars: totalMathStars },
    { subject: 'Science', completed: scienceCompleted, total: 5, stars: totalScienceStars },
    { subject: 'English', completed: englishCompleted, total: 5, stars: totalEnglishStars },
  ];

  const progressData = [
    { name: 'Completed', value: mathCompleted + scienceCompleted + englishCompleted },
    { name: 'Remaining', value: 15 - (mathCompleted + scienceCompleted + englishCompleted) },
  ];

  const COLORS = ['#10b981', '#e5e7eb'];

  const weeklyActivity = [
    { day: 'Mon', lessons: 2, quizzes: 1, time: 45 },
    { day: 'Tue', lessons: 3, quizzes: 2, time: 60 },
    { day: 'Wed', lessons: 1, quizzes: 1, time: 30 },
    { day: 'Thu', lessons: 4, quizzes: 2, time: 75 },
    { day: 'Fri', lessons: 2, quizzes: 1, time: 50 },
    { day: 'Sat', lessons: 3, quizzes: 3, time: 90 },
    { day: 'Sun', lessons: 2, quizzes: 1, time: 55 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 mb-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Back to Dashboard</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2" style={{ fontFamily: 'var(--font-playful)' }}>
                📊 Parent Dashboard
              </h1>
              <p className="text-xl opacity-90">Track your child's learning journey</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPeriod('week')}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  selectedPeriod === 'week' ? 'bg-white text-purple-600' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  selectedPeriod === 'month' ? 'bg-white text-purple-600' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                Month
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <span className="text-sm font-bold text-gray-500 bg-green-100 px-3 py-1 rounded-full">+23%</span>
            </div>
            <p className="text-4xl font-black text-gray-800 mb-2">
              {mathCompleted + scienceCompleted + englishCompleted}
            </p>
            <p className="text-gray-600 font-bold">Lessons Completed</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Star className="w-12 h-12 text-yellow-500" />
              <span className="text-sm font-bold text-gray-500 bg-yellow-100 px-3 py-1 rounded-full">+15</span>
            </div>
            <p className="text-4xl font-black text-gray-800 mb-2">
              {totalMathStars + totalScienceStars + totalEnglishStars}
            </p>
            <p className="text-gray-600 font-bold">Stars Earned</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-12 h-12 text-blue-500" />
              <span className="text-sm font-bold text-gray-500 bg-blue-100 px-3 py-1 rounded-full">7 days</span>
            </div>
            <p className="text-4xl font-black text-gray-800 mb-2">6.5h</p>
            <p className="text-gray-600 font-bold">Study Time</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-12 h-12 text-purple-500" />
              <span className="text-sm font-bold text-gray-500 bg-purple-100 px-3 py-1 rounded-full">Great!</span>
            </div>
            <p className="text-4xl font-black text-gray-800 mb-2">
              {Math.round(((mathCompleted + scienceCompleted + englishCompleted) / 15) * 100)}%
            </p>
            <p className="text-gray-600 font-bold">Overall Progress</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Subject Progress */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              Subject Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#8b5cf6" name="Completed Lessons" />
                <Bar dataKey="stars" fill="#fbbf24" name="Stars Earned" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Progress Pie Chart */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-green-600" />
              Learning Progress
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <p className="text-4xl font-black text-gray-800">
                {mathCompleted + scienceCompleted + englishCompleted}/15
              </p>
              <p className="text-gray-600 font-bold">Topics Mastered</p>
            </div>
          </motion.div>
        </div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-12"
        >
          <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Weekly Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="lessons" fill="#3b82f6" name="Lessons" />
              <Bar dataKey="quizzes" fill="#ec4899" name="Quizzes" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Detailed Reports */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Math Report */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-xl p-6 text-white"
          >
            <h3 className="text-2xl font-black mb-4">📘 Mathematics</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span>Lessons:</span>
                <span className="font-bold">{mathCompleted}/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Stars:</span>
                <span className="font-bold">{totalMathStars} ⭐</span>
              </div>
              <div className="bg-white/20 rounded-full h-3">
                <div
                  className="bg-yellow-400 h-full rounded-full transition-all"
                  style={{ width: `${(mathCompleted / 5) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-sm opacity-90">
              {mathCompleted === 5 ? '🎉 All topics completed!' : `Keep going! ${5 - mathCompleted} topics left.`}
            </p>
          </motion.div>

          {/* Science Report */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl shadow-xl p-6 text-white"
          >
            <h3 className="text-2xl font-black mb-4">🔬 Science</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span>Lessons:</span>
                <span className="font-bold">{scienceCompleted}/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Stars:</span>
                <span className="font-bold">{totalScienceStars} ⭐</span>
              </div>
              <div className="bg-white/20 rounded-full h-3">
                <div
                  className="bg-yellow-400 h-full rounded-full transition-all"
                  style={{ width: `${(scienceCompleted / 5) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-sm opacity-90">
              {scienceCompleted === 5 ? '🎉 All topics completed!' : `Keep going! ${5 - scienceCompleted} topics left.`}
            </p>
          </motion.div>

          {/* English Report */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-xl p-6 text-white"
          >
            <h3 className="text-2xl font-black mb-4">📖 English</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span>Lessons:</span>
                <span className="font-bold">{englishCompleted}/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Stars:</span>
                <span className="font-bold">{totalEnglishStars} ⭐</span>
              </div>
              <div className="bg-white/20 rounded-full h-3">
                <div
                  className="bg-yellow-400 h-full rounded-full transition-all"
                  style={{ width: `${(englishCompleted / 5) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-sm opacity-90">
              {englishCompleted === 5 ? '🎉 All topics completed!' : `Keep going! ${5 - englishCompleted} topics left.`}
            </p>
          </motion.div>
        </div>

        {/* Achievements & Recommendations */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Recent Achievements
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-2xl">
                <div className="bg-yellow-400 rounded-full p-3">
                  <Star className="w-6 h-6 text-white fill-current" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Star Collector</p>
                  <p className="text-sm text-gray-600">Earned {totalMathStars + totalScienceStars + totalEnglishStars} stars!</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl">
                <div className="bg-blue-400 rounded-full p-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Quick Learner</p>
                  <p className="text-sm text-gray-600">Completed {mathCompleted + scienceCompleted + englishCompleted} lessons</p>
                </div>
              </div>
              {watchedVideos > 0 && (
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl">
                  <div className="bg-purple-400 rounded-full p-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Video Learner</p>
                    <p className="text-sm text-gray-600">Watched {watchedVideos} educational videos</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-xl p-6 text-white"
          >
            <h3 className="text-2xl font-black mb-4">💡 Recommendations</h3>
            <div className="space-y-4">
              {mathCompleted < 5 && (
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <p className="font-bold mb-2">📘 Focus on Math</p>
                  <p className="text-sm opacity-90">Complete {5 - mathCompleted} more math topics to master the subject!</p>
                </div>
              )}
              {scienceCompleted < 5 && (
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <p className="font-bold mb-2">🔬 Science Time</p>
                  <p className="text-sm opacity-90">{5 - scienceCompleted} science topics waiting to be explored!</p>
                </div>
              )}
              {englishCompleted < 5 && (
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <p className="font-bold mb-2">📖 English Practice</p>
                  <p className="text-sm opacity-90">Improve language skills with {5 - englishCompleted} more lessons!</p>
                </div>
              )}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <p className="font-bold mb-2">⏰ Study Schedule</p>
                <p className="text-sm opacity-90">Consistency is key! Try to study at least 30 minutes daily.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
