import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Star, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TOPICS = [
  { id: 'plants', emoji: '🌱', title: 'Plants & Trees', desc: 'How plants grow and live!', level: 'Beginner', color: 'from-green-400 to-emerald-600' },
  { id: 'animals', emoji: '🦁', title: 'Animals & Wildlife', desc: 'Discover amazing animals!', level: 'Beginner', color: 'from-orange-400 to-amber-600' },
  { id: 'human-body', emoji: '🫀', title: 'Human Body', desc: 'Organs, senses & health!', level: 'Intermediate', color: 'from-red-400 to-rose-600' },
  { id: 'earth-space', emoji: '🌍', title: 'Earth & Space', desc: 'Planets, stars & galaxies!', level: 'Intermediate', color: 'from-indigo-500 to-blue-700' },
  { id: 'weather', emoji: '⛅', title: 'Weather & Climate', desc: 'Rain, wind & sunshine!', level: 'Beginner', color: 'from-sky-400 to-blue-500' },
  { id: 'water-cycle', emoji: '💧', title: 'The Water Cycle', desc: 'Evaporation to rain!', level: 'Intermediate', color: 'from-cyan-400 to-blue-600' },
  { id: 'environment', emoji: '🌿', title: 'Environment & Ecology', desc: 'Protect our Earth!', level: 'Intermediate', color: 'from-green-500 to-teal-700' },
  { id: 'energy', emoji: '⚡', title: 'Energy & Forces', desc: 'Heat, light & electricity!', level: 'Advanced', color: 'from-yellow-400 to-orange-600' },
  { id: 'food-nutrition', emoji: '🍎', title: 'Food & Nutrition', desc: 'Healthy eating habits!', level: 'Beginner', color: 'from-rose-400 to-pink-600' },
  { id: 'health', emoji: '🏥', title: 'Health & Hygiene', desc: 'Stay clean and healthy!', level: 'Beginner', color: 'from-teal-400 to-cyan-600' },
  { id: 'simple-machines', emoji: '⚙️', title: 'Simple Machines', desc: 'Levers, wheels & pulleys!', level: 'Advanced', color: 'from-slate-500 to-gray-700' },
  { id: 'light-sound', emoji: '🔦', title: 'Light & Sound', desc: 'How we see and hear!', level: 'Intermediate', color: 'from-violet-400 to-purple-600' },
  { id: 'air-wind', emoji: '🌬️', title: 'Air & Wind', desc: 'What is air made of?', level: 'Beginner', color: 'from-blue-300 to-sky-500' },
  { id: 'magnets', emoji: '🧲', title: 'Magnets & Magnetism', desc: 'Attract and repel!', level: 'Intermediate', color: 'from-rose-500 to-red-700' },
  { id: 'living-nonliving', emoji: '🐣', title: 'Living & Non-living', desc: 'Classify everything!', level: 'Beginner', color: 'from-lime-400 to-green-600' },
  { id: 'habitats', emoji: '🏕️', title: 'Habitats', desc: 'Where animals live!', level: 'Beginner', color: 'from-amber-400 to-yellow-600' },
  { id: 'life-cycles', emoji: '🦋', title: 'Life Cycles', desc: 'Birth, growth & beyond!', level: 'Intermediate', color: 'from-pink-400 to-fuchsia-600' },
  { id: 'seasons', emoji: '🍂', title: 'Seasons', desc: 'Spring, summer, fall & winter!', level: 'Beginner', color: 'from-orange-400 to-red-500' },
  { id: 'experiments', emoji: '🧪', title: 'Fun Experiments', desc: 'Science activities!', level: 'Advanced', color: 'from-purple-400 to-indigo-600' },
  { id: 'earth-rocks', emoji: '🪨', title: 'Earth & Rocks', desc: 'Minerals and soil!', level: 'Intermediate', color: 'from-stone-500 to-amber-700' },
];

const levelColor: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-purple-100 text-purple-700',
};

export function ScienceSection() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const isCompleted = (id: string) => localStorage.getItem(`science_${id}_completed`) === 'true';
  const getStars = (id: string) => parseInt(localStorage.getItem(`science_${id}_stars`) || '0');
  const completedCount = TOPICS.filter(tp => isCompleted(tp.id)).length;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #DCFCE7 0%, #D1FAE5 100%)' }}>
      <div className="sticky top-0 z-30" style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 4px 20px rgba(5,150,105,0.4)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 mb-3 text-white/80 hover:text-white transition-colors font-bold text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            <ArrowLeft className="w-4 h-4" /> {t.backToDashboard}
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white" style={{ fontFamily: 'var(--font-playful)' }}>🔬 {t.science}</h1>
              <p className="text-green-100 font-bold text-sm mt-1" style={{ fontFamily: 'var(--font-body)' }}>{TOPICS.length} fascinating topics to explore!</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
              <p className="text-white font-black text-xl" style={{ fontFamily: 'var(--font-playful)' }}>{completedCount}/{TOPICS.length}</p>
              <p className="text-green-100 text-xs font-bold" style={{ fontFamily: 'var(--font-body)' }}>Completed</p>
            </div>
          </div>
          <div className="mt-3 bg-white/20 rounded-full h-2.5 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(completedCount / TOPICS.length) * 100}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full bg-yellow-400 rounded-full" />
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
                onClick={() => navigate(`/science/${topic.id}`)}
                className="cursor-pointer bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
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
                  <button className="w-full mt-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-black py-2.5 rounded-2xl hover:shadow-md transition-all" style={{ fontFamily: 'var(--font-playful)' }}>
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
