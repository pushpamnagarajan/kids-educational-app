import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Star, Lock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TOPICS = [
  { id: 'numbers', emoji: '🔢', title: 'Numbers & Counting', desc: 'Count from 1 to 100!', level: 'Beginner', color: 'from-blue-400 to-blue-600' },
  { id: 'addition', emoji: '➕', title: 'Addition', desc: 'Adding numbers together!', level: 'Beginner', color: 'from-cyan-400 to-blue-500' },
  { id: 'subtraction', emoji: '➖', title: 'Subtraction', desc: 'Taking numbers away!', level: 'Beginner', color: 'from-sky-400 to-cyan-600' },
  { id: 'multiplication', emoji: '✖️', title: 'Multiplication', desc: 'Times tables fun!', level: 'Intermediate', color: 'from-indigo-400 to-purple-500' },
  { id: 'division', emoji: '➗', title: 'Division', desc: 'Sharing equally!', level: 'Intermediate', color: 'from-violet-400 to-indigo-600' },
  { id: 'fractions', emoji: '½', title: 'Fractions', desc: 'Halves and quarters!', level: 'Intermediate', color: 'from-purple-400 to-violet-600' },
  { id: 'shapes', emoji: '🔷', title: 'Shapes & Geometry', desc: 'Circles, squares & more!', level: 'Beginner', color: 'from-blue-400 to-indigo-500' },
  { id: 'measurement', emoji: '📏', title: 'Measurement', desc: 'Length, weight & volume!', level: 'Intermediate', color: 'from-teal-400 to-blue-500' },
  { id: 'time', emoji: '⏰', title: 'Time & Clocks', desc: 'Hours, minutes & days!', level: 'Intermediate', color: 'from-blue-500 to-cyan-500' },
  { id: 'money', emoji: '💰', title: 'Money & Coins', desc: 'Counting currency!', level: 'Intermediate', color: 'from-emerald-400 to-teal-600' },
  { id: 'patterns', emoji: '🔄', title: 'Patterns & Sequences', desc: 'Find the pattern!', level: 'Beginner', color: 'from-pink-400 to-rose-500' },
  { id: 'place-value', emoji: '🏷️', title: 'Place Value', desc: 'Ones, tens & hundreds!', level: 'Intermediate', color: 'from-orange-400 to-red-500' },
  { id: 'comparing', emoji: '⚖️', title: 'Comparing Numbers', desc: 'Greater & lesser!', level: 'Beginner', color: 'from-yellow-400 to-orange-500' },
  { id: 'word-problems', emoji: '📝', title: 'Word Problems', desc: 'Solve story maths!', level: 'Advanced', color: 'from-red-400 to-pink-600' },
  { id: 'odd-even', emoji: '🔁', title: 'Odd & Even Numbers', desc: 'Even and odd!', level: 'Beginner', color: 'from-indigo-400 to-blue-500' },
  { id: 'skip-counting', emoji: '🦘', title: 'Skip Counting', desc: 'Count by 2s, 5s, 10s!', level: 'Beginner', color: 'from-green-400 to-teal-500' },
  { id: 'number-lines', emoji: '📊', title: 'Number Lines', desc: 'Position numbers!', level: 'Intermediate', color: 'from-cyan-400 to-sky-600' },
  { id: 'algebra', emoji: '🔤', title: 'Basic Algebra', desc: 'Find the missing number!', level: 'Advanced', color: 'from-purple-500 to-indigo-700' },
  { id: 'data-graphs', emoji: '📈', title: 'Data & Graphs', desc: 'Charts and pictographs!', level: 'Advanced', color: 'from-blue-500 to-violet-600' },
  { id: 'mental-math', emoji: '🧠', title: 'Mental Maths', desc: 'Calculate in your head!', level: 'Advanced', color: 'from-rose-400 to-red-600' },
];

const levelColor: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-purple-100 text-purple-700',
};

export function MathSection() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const isCompleted = (id: string) => localStorage.getItem(`math_${id}_completed`) === 'true';
  const getStars = (id: string) => parseInt(localStorage.getItem(`math_${id}_stars`) || '0');

  const completedCount = TOPICS.filter(tp => isCompleted(tp.id)).length;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #DBEAFE 0%, #EDE9FE 100%)' }}>
      {/* Header */}
      <div className="sticky top-0 z-30" style={{ background: 'linear-gradient(135deg, #2563EB, #4F46E5)', boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 mb-3 text-white/80 hover:text-white transition-colors font-bold text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            <ArrowLeft className="w-4 h-4" /> {t.backToDashboard}
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white" style={{ fontFamily: 'var(--font-playful)' }}>📘 {t.mathematics}</h1>
              <p className="text-blue-100 font-bold text-sm mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                {TOPICS.length} amazing topics to master!
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
              <p className="text-white font-black text-xl" style={{ fontFamily: 'var(--font-playful)' }}>{completedCount}/{TOPICS.length}</p>
              <p className="text-blue-100 text-xs font-bold" style={{ fontFamily: 'var(--font-body)' }}>Completed</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 bg-white/20 rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / TOPICS.length) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-yellow-400 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {TOPICS.map((topic, index) => {
            const completed = isCompleted(topic.id);
            const stars = getStars(topic.id);
            return (
              <motion.div
                key={topic.id}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.04, type: 'spring' }}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/math/${topic.id}`)}
                className="cursor-pointer bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Card top */}
                <div className={`bg-gradient-to-br ${topic.color} p-5 relative`}>
                  {completed && (
                    <div className="absolute top-3 right-3 bg-white rounded-full p-1">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                  <span className="text-5xl block mb-1">{topic.emoji}</span>
                  <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-black ${levelColor[topic.level]} bg-white/90`}>
                    {topic.level}
                  </div>
                </div>

                {/* Card bottom */}
                <div className="p-4">
                  <h3 className="font-black text-gray-800 text-base leading-tight" style={{ fontFamily: 'var(--font-playful)' }}>{topic.title}</h3>
                  <p className="text-gray-500 text-xs mt-1 font-bold" style={{ fontFamily: 'var(--font-body)' }}>{topic.desc}</p>

                  {stars > 0 && (
                    <div className="flex gap-0.5 mt-2">
                      {[0, 1, 2].map(i => (
                        <Star key={i} className={`w-4 h-4 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                      ))}
                    </div>
                  )}

                  <button className="w-full mt-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-black py-2.5 rounded-2xl hover:shadow-md transition-all" style={{ fontFamily: 'var(--font-playful)' }}>
                    {completed ? '📚 Review' : '🚀 Start'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
