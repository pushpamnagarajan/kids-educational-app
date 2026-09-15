import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Star, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TOPICS = [
  { id: 'alphabet', emoji: '🔤', title: 'Alphabet & Letters', desc: 'A, B, C to Z!', level: 'Beginner', color: 'from-purple-400 to-violet-600' },
  { id: 'phonics', emoji: '🔊', title: 'Phonics & Sounds', desc: 'Learn letter sounds!', level: 'Beginner', color: 'from-pink-400 to-rose-600' },
  { id: 'sight-words', emoji: '👁️', title: 'Sight Words', desc: 'Common everyday words!', level: 'Beginner', color: 'from-fuchsia-400 to-pink-600' },
  { id: 'nouns', emoji: '📦', title: 'Nouns', desc: 'Person, place or thing!', level: 'Beginner', color: 'from-violet-400 to-purple-600' },
  { id: 'pronouns', emoji: '👤', title: 'Pronouns', desc: 'He, she, they & more!', level: 'Beginner', color: 'from-indigo-400 to-violet-600' },
  { id: 'verbs', emoji: '🏃', title: 'Verbs & Action Words', desc: 'Run, jump, play!', level: 'Beginner', color: 'from-blue-400 to-indigo-600' },
  { id: 'adjectives', emoji: '🎨', title: 'Adjectives', desc: 'Describing words!', level: 'Intermediate', color: 'from-rose-400 to-pink-600' },
  { id: 'adverbs', emoji: '⚡', title: 'Adverbs', desc: 'How, when & where!', level: 'Intermediate', color: 'from-amber-400 to-orange-600' },
  { id: 'articles', emoji: '📰', title: 'Articles', desc: 'A, An and The!', level: 'Beginner', color: 'from-teal-400 to-cyan-600' },
  { id: 'prepositions', emoji: '📍', title: 'Prepositions', desc: 'In, on, under & over!', level: 'Intermediate', color: 'from-green-400 to-teal-600' },
  { id: 'conjunctions', emoji: '🔗', title: 'Conjunctions', desc: 'And, but, or!', level: 'Intermediate', color: 'from-sky-400 to-blue-600' },
  { id: 'sentences', emoji: '📝', title: 'Sentences', desc: 'Subject, verb & object!', level: 'Intermediate', color: 'from-purple-500 to-pink-600' },
  { id: 'punctuation', emoji: '❗', title: 'Punctuation', desc: 'Full stops, commas!', level: 'Intermediate', color: 'from-red-400 to-rose-600' },
  { id: 'reading', emoji: '📖', title: 'Reading Comprehension', desc: 'Understand stories!', level: 'Advanced', color: 'from-indigo-500 to-purple-700' },
  { id: 'creative-writing', emoji: '✍️', title: 'Creative Writing', desc: 'Write your own stories!', level: 'Advanced', color: 'from-violet-500 to-fuchsia-700' },
  { id: 'tenses', emoji: '⏱️', title: 'Tenses', desc: 'Past, present & future!', level: 'Advanced', color: 'from-blue-500 to-indigo-700' },
  { id: 'plurals', emoji: '1️⃣', title: 'Singular & Plural', desc: 'One cat, many cats!', level: 'Beginner', color: 'from-emerald-400 to-green-600' },
  { id: 'antonyms', emoji: '↔️', title: 'Antonyms & Synonyms', desc: 'Opposites & similar words!', level: 'Intermediate', color: 'from-orange-400 to-amber-600' },
  { id: 'vocabulary', emoji: '📚', title: 'Vocabulary Building', desc: 'Learn new words daily!', level: 'Advanced', color: 'from-pink-500 to-rose-700' },
  { id: 'story-writing', emoji: '📕', title: 'Story Writing', desc: 'Beginning, middle & end!', level: 'Advanced', color: 'from-purple-600 to-indigo-700' },
];

const levelColor: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-purple-100 text-purple-700',
};

export function EnglishSection() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const isCompleted = (id: string) => localStorage.getItem(`english_${id}_completed`) === 'true';
  const getStars = (id: string) => parseInt(localStorage.getItem(`english_${id}_stars`) || '0');
  const completedCount = TOPICS.filter(tp => isCompleted(tp.id)).length;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #F3E8FF 0%, #FDF4FF 100%)' }}>
      <div className="sticky top-0 z-30" style={{ background: 'linear-gradient(135deg, #7C3AED, #BE185D)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 mb-3 text-white/80 hover:text-white transition-colors font-bold text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            <ArrowLeft className="w-4 h-4" /> {t.backToDashboard}
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white" style={{ fontFamily: 'var(--font-playful)' }}>📖 {t.english}</h1>
              <p className="text-purple-100 font-bold text-sm mt-1" style={{ fontFamily: 'var(--font-body)' }}>{TOPICS.length} topics to master English!</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
              <p className="text-white font-black text-xl" style={{ fontFamily: 'var(--font-playful)' }}>{completedCount}/{TOPICS.length}</p>
              <p className="text-purple-100 text-xs font-bold" style={{ fontFamily: 'var(--font-body)' }}>Completed</p>
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
                onClick={() => navigate(`/english/${topic.id}`)}
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
                  <button className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-black py-2.5 rounded-2xl hover:shadow-md transition-all" style={{ fontFamily: 'var(--font-playful)' }}>
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
