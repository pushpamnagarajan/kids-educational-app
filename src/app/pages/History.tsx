import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Trophy, Star, BookOpen, Video, CheckCircle, Flame,
  Award, Clock, BarChart2, Play, Calendar, TrendingUp, Zap, Medal
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MATH_TOPICS = [
  'numbers', 'addition', 'subtraction', 'multiplication', 'division',
  'fractions', 'shapes', 'measurement', 'time', 'money',
  'patterns', 'place-value', 'comparing', 'word-problems', 'odd-even',
  'skip-counting', 'number-lines', 'algebra', 'data-graphs', 'mental-math',
];
const SCIENCE_TOPICS = [
  'plants', 'animals', 'human-body', 'earth-space', 'weather',
  'water-cycle', 'environment', 'energy', 'food-nutrition', 'health',
  'simple-machines', 'light-sound', 'air-wind', 'magnets', 'living-nonliving',
  'habitats', 'life-cycles', 'seasons', 'experiments', 'earth-rocks',
];
const ENGLISH_TOPICS = [
  'alphabet', 'phonics', 'sight-words', 'nouns', 'pronouns',
  'verbs', 'adjectives', 'adverbs', 'articles', 'prepositions',
  'conjunctions', 'sentences', 'punctuation', 'reading', 'creative-writing',
  'tenses', 'plurals', 'antonyms', 'vocabulary', 'story-writing',
];

const TOPIC_LABELS: Record<string, string> = {
  'numbers': 'Numbers', 'addition': 'Addition', 'subtraction': 'Subtraction', 'multiplication': 'Multiplication',
  'division': 'Division', 'fractions': 'Fractions', 'shapes': 'Shapes & Geometry', 'measurement': 'Measurement',
  'time': 'Time & Clock', 'money': 'Money & Currency', 'patterns': 'Patterns', 'place-value': 'Place Value',
  'comparing': 'Comparing Numbers', 'word-problems': 'Word Problems', 'odd-even': 'Odd & Even',
  'skip-counting': 'Skip Counting', 'number-lines': 'Number Lines', 'algebra': 'Algebra Basics',
  'data-graphs': 'Data & Graphs', 'mental-math': 'Mental Math',
  'plants': 'Plants', 'animals': 'Animals', 'human-body': 'Human Body', 'earth-space': 'Earth & Space',
  'weather': 'Weather', 'water-cycle': 'Water Cycle', 'environment': 'Environment', 'energy': 'Energy',
  'food-nutrition': 'Food & Nutrition', 'health': 'Health & Hygiene', 'simple-machines': 'Simple Machines',
  'light-sound': 'Light & Sound', 'air-wind': 'Air & Wind', 'magnets': 'Magnets', 'living-nonliving': 'Living/Non-living',
  'habitats': 'Habitats', 'life-cycles': 'Life Cycles', 'seasons': 'Seasons', 'experiments': 'Science Experiments',
  'earth-rocks': 'Earth & Rocks',
  'alphabet': 'Alphabet', 'phonics': 'Phonics', 'sight-words': 'Sight Words', 'nouns': 'Nouns',
  'pronouns': 'Pronouns', 'verbs': 'Verbs', 'adjectives': 'Adjectives', 'adverbs': 'Adverbs',
  'articles': 'Articles', 'prepositions': 'Prepositions', 'conjunctions': 'Conjunctions',
  'sentences': 'Sentences', 'punctuation': 'Punctuation', 'reading': 'Reading Comprehension',
  'creative-writing': 'Creative Writing', 'tenses': 'Tenses', 'plurals': 'Plurals',
  'antonyms': 'Antonyms & Synonyms', 'vocabulary': 'Vocabulary', 'story-writing': 'Story Writing',
};

const SUBJECT_META = {
  math: { label: 'Mathematics', emoji: '🔢', gradient: '#7C3AED, #A855F7', light: '#F3E8FF', text: 'text-purple-600', topics: MATH_TOPICS },
  science: { label: 'Science', emoji: '🔬', gradient: '#059669, #10B981', light: '#D1FAE5', text: 'text-green-600', topics: SCIENCE_TOPICS },
  english: { label: 'English Grammar', emoji: '📚', gradient: '#0EA5E9, #6366F1', light: '#DBEAFE', text: 'text-blue-600', topics: ENGLISH_TOPICS },
};

interface CompletedItem {
  subject: string; topic: string; label: string; date: string;
  quizStars?: number; quizScore?: number; lessonDone?: boolean;
  videoWatched?: boolean; timeSpent?: number;
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return 'Recently'; }
}

function daysBetween(a: string, b: string) {
  try {
    return Math.abs(Math.floor((new Date(a).getTime() - new Date(b).getTime()) / 86400000));
  } catch { return 1; }
}

type Tab = 'overview' | 'lessons' | 'quizzes' | 'videos' | 'badges' | 'streak';

export function History() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>('overview');
  const [items, setItems] = useState<CompletedItem[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [lastLesson, setLastLesson] = useState<{ subject: string; topic: string } | null>(null);

  useEffect(() => {
    const collected: CompletedItem[] = [];
    let stars = 0;
    let time = parseInt(localStorage.getItem('time_spent_total') || '0');

    (['math', 'science', 'english'] as const).forEach(sub => {
      const { topics } = SUBJECT_META[sub];
      topics.forEach(topic => {
        const done = localStorage.getItem(`${sub}_${topic}_completed`) === 'true';
        const date = localStorage.getItem(`lesson_date_${sub}_${topic}`) || '';
        const qDone = localStorage.getItem(`${sub}_${topic}_quiz_completed`) === 'true';
        const qStars = parseInt(localStorage.getItem(`${sub}_${topic}_quiz_stars`) || '0');
        const lStars = parseInt(localStorage.getItem(`${sub}_${topic}_stars`) || '0');
        const vWatched = localStorage.getItem(`video_progress_${sub}_${topic}`) !== null;
        const spent = parseInt(localStorage.getItem(`time_spent_${sub}_${topic}`) || '0');
        stars += qStars + lStars;
        if (done || qDone || vWatched) {
          collected.push({ subject: sub, topic, label: TOPIC_LABELS[topic] || topic, date, quizStars: qStars, quizScore: qDone ? qStars * 20 : undefined, lessonDone: done, videoWatched: vWatched, timeSpent: spent });
        }
      });
    });

    // Sort by date descending
    collected.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    setItems(collected);
    setTotalStars(stars);
    setTotalTime(time);
    setStreak(parseInt(localStorage.getItem('streak_days') || '0'));

    // Find the last started but not finished lesson for "Continue Learning"
    const allTopics: { sub: string; topic: string; date: string }[] = [];
    (['math', 'science', 'english'] as const).forEach(sub => {
      SUBJECT_META[sub].topics.forEach(topic => {
        const date = localStorage.getItem(`lesson_date_${sub}_${topic}`) || '';
        if (date) allTopics.push({ sub, topic, date });
      });
    });
    if (allTopics.length > 0) {
      allTopics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const last = allTopics[0];
      const subTopics = SUBJECT_META[last.sub as keyof typeof SUBJECT_META].topics;
      const idx = subTopics.indexOf(last.topic);
      const nextTopic = subTopics[idx + 1];
      if (nextTopic && localStorage.getItem(`${last.sub}_${nextTopic}_completed`) !== 'true') {
        setLastLesson({ subject: last.sub, topic: nextTopic });
      } else {
        setLastLesson({ subject: last.sub, topic: last.topic });
      }
    }
  }, []);

  const completedLessons = items.filter(i => i.lessonDone);
  const completedQuizzes = items.filter(i => i.quizScore !== undefined);
  const watchedVideos = items.filter(i => i.videoWatched);
  const totalTopics = MATH_TOPICS.length + SCIENCE_TOPICS.length + ENGLISH_TOPICS.length;
  const completionPct = Math.round((completedLessons.length / totalTopics) * 100);

  const BADGES = [
    { id: 'first-lesson', label: 'First Step', emoji: '👶', desc: 'Complete your first lesson', earned: completedLessons.length >= 1 },
    { id: 'five-lessons', label: 'Scholar', emoji: '📖', desc: 'Complete 5 lessons', earned: completedLessons.length >= 5 },
    { id: 'ten-lessons', label: 'Achiever', emoji: '🏅', desc: 'Complete 10 lessons', earned: completedLessons.length >= 10 },
    { id: 'twenty-lessons', label: 'Star Learner', emoji: '⭐', desc: 'Complete 20 lessons', earned: completedLessons.length >= 20 },
    { id: 'all-math', label: 'Math Master', emoji: '🔢', desc: 'Complete all Math topics', earned: MATH_TOPICS.every(t => localStorage.getItem(`math_${t}_completed`) === 'true') },
    { id: 'all-science', label: 'Scientist', emoji: '🔬', desc: 'Complete all Science topics', earned: SCIENCE_TOPICS.every(t => localStorage.getItem(`science_${t}_completed`) === 'true') },
    { id: 'all-english', label: 'Wordsmith', emoji: '✍️', desc: 'Complete all English topics', earned: ENGLISH_TOPICS.every(t => localStorage.getItem(`english_${t}_completed`) === 'true') },
    { id: 'first-quiz', label: 'Quiz Taker', emoji: '❓', desc: 'Take your first quiz', earned: completedQuizzes.length >= 1 },
    { id: 'five-quizzes', label: 'Quiz Champion', emoji: '🏆', desc: 'Take 5 quizzes', earned: completedQuizzes.length >= 5 },
    { id: 'streak-3', label: '3 Day Streak', emoji: '🔥', desc: '3 day learning streak', earned: streak >= 3 },
    { id: 'streak-7', label: 'Week Warrior', emoji: '💪', desc: '7 day learning streak', earned: streak >= 7 },
    { id: 'hundred-stars', label: 'Star Collector', emoji: '🌟', desc: 'Earn 100 stars', earned: totalStars >= 100 },
    { id: 'video-watcher', label: 'Visual Learner', emoji: '🎬', desc: 'Watch your first video', earned: watchedVideos.length >= 1 },
    { id: 'video-five', label: 'Video Fan', emoji: '📺', desc: 'Watch 5 videos', earned: watchedVideos.length >= 5 },
    { id: 'time-champ', label: 'Dedicated', emoji: '⏱️', desc: 'Spend 30+ min learning', earned: totalTime >= 30 },
  ];

  const earnedBadges = BADGES.filter(b => b.earned);
  const CERTIFICATES = [
    { label: 'Mathematics Certificate', emoji: '🔢', earned: MATH_TOPICS.every(t => localStorage.getItem(`math_${t}_completed`) === 'true'), subject: 'math' },
    { label: 'Science Certificate', emoji: '🔬', earned: SCIENCE_TOPICS.every(t => localStorage.getItem(`science_${t}_completed`) === 'true'), subject: 'science' },
    { label: 'English Certificate', emoji: '📚', earned: ENGLISH_TOPICS.every(t => localStorage.getItem(`english_${t}_completed`) === 'true'), subject: 'english' },
    { label: 'All-Rounder Certificate', emoji: '🌈', earned: completedLessons.length >= 30, subject: 'all' },
  ];

  const tabs: { key: Tab; label: string; emoji: string; count?: number }[] = [
    { key: 'overview', label: 'Overview', emoji: '📊' },
    { key: 'lessons', label: 'Lessons', emoji: '📖', count: completedLessons.length },
    { key: 'quizzes', label: 'Quizzes', emoji: '❓', count: completedQuizzes.length },
    { key: 'videos', label: 'Videos', emoji: '🎬', count: watchedVideos.length },
    { key: 'badges', label: 'Badges', emoji: '🏅', count: earnedBadges.length },
    { key: 'streak', label: 'Streak', emoji: '🔥' },
  ];

  const subjectProgress = (['math', 'science', 'english'] as const).map(sub => {
    const done = SUBJECT_META[sub].topics.filter(t => localStorage.getItem(`${sub}_${t}_completed`) === 'true').length;
    return { ...SUBJECT_META[sub], key: sub, done, total: SUBJECT_META[sub].topics.length };
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #F3E8FF 100%)' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 shadow-lg" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/dashboard')}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all text-white font-bold flex items-center gap-2"
              style={{ fontFamily: 'var(--font-body)' }}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-3xl">📚</span>
              <div>
                <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-playful)' }}>Learning History</h1>
                <p className="text-white/80 text-sm font-bold" style={{ fontFamily: 'var(--font-body)' }}>Track your amazing progress!</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {tabs.map(tab_ => (
              <button key={tab_.key} onClick={() => setTab(tab_.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-black text-sm transition-all ${tab === tab_.key ? 'bg-white text-purple-700 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}
                style={{ fontFamily: 'var(--font-playful)' }}>
                {tab_.emoji} {tab_.label}
                {tab_.count !== undefined && tab_.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${tab === tab_.key ? 'bg-purple-100 text-purple-700' : 'bg-white/30 text-white'}`}>
                    {tab_.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>

            {/* OVERVIEW TAB */}
            {tab === 'overview' && (
              <div className="space-y-5">
                {/* Continue Learning Banner */}
                {lastLesson && (
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                    className="rounded-3xl p-5 text-white shadow-xl flex items-center gap-4"
                    style={{ background: 'linear-gradient(135deg, #F97316, #EC4899)' }}>
                    <span className="text-5xl">▶️</span>
                    <div className="flex-1">
                      <p className="font-black text-xl mb-0.5" style={{ fontFamily: 'var(--font-playful)' }}>Continue Learning!</p>
                      <p className="font-bold text-white/90 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                        Next: {TOPIC_LABELS[lastLesson.topic] || lastLesson.topic} in {SUBJECT_META[lastLesson.subject as keyof typeof SUBJECT_META]?.label}
                      </p>
                    </div>
                    <button onClick={() => navigate(`/${lastLesson.subject}/${lastLesson.topic}`)}
                      className="bg-white/20 hover:bg-white/30 px-4 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-1.5"
                      style={{ fontFamily: 'var(--font-playful)' }}>
                      <Play className="w-4 h-4" /> Go!
                    </button>
                  </motion.div>
                )}

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { icon: <BookOpen className="w-6 h-6 text-purple-500" />, value: completedLessons.length, label: 'Lessons Done', bg: '#F3E8FF' },
                    { icon: <Star className="w-6 h-6 text-yellow-500" />, value: totalStars, label: 'Stars Earned', bg: '#FEF9C3' },
                    { icon: <Flame className="w-6 h-6 text-orange-500" />, value: streak, label: 'Day Streak', bg: '#FEE2E2' },
                    { icon: <Clock className="w-6 h-6 text-blue-500" />, value: `${totalTime}m`, label: 'Time Spent', bg: '#DBEAFE' },
                  ].map((stat, i) => (
                    <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
                      className="rounded-2xl p-4 text-center shadow-md" style={{ background: stat.bg }}>
                      <div className="flex justify-center mb-2">{stat.icon}</div>
                      <p className="font-black text-2xl text-gray-800" style={{ fontFamily: 'var(--font-playful)' }}>{stat.value}</p>
                      <p className="text-gray-600 text-xs font-bold" style={{ fontFamily: 'var(--font-body)' }}>{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Overall completion */}
                <div className="bg-white rounded-3xl shadow-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                      <h3 className="font-black text-gray-800 text-lg" style={{ fontFamily: 'var(--font-playful)' }}>Overall Progress</h3>
                    </div>
                    <span className="font-black text-purple-600 text-2xl" style={{ fontFamily: 'var(--font-playful)' }}>{completionPct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-5 mb-2 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${completionPct}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-5 rounded-full" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }} />
                  </div>
                  <p className="text-gray-500 text-sm font-bold" style={{ fontFamily: 'var(--font-body)' }}>
                    {completedLessons.length} of {totalTopics} topics completed
                  </p>
                  <div className="mt-4 space-y-3">
                    {subjectProgress.map(sp => (
                      <div key={sp.key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="flex items-center gap-1.5 font-black text-sm text-gray-700" style={{ fontFamily: 'var(--font-playful)' }}>
                            {sp.emoji} {sp.label}
                          </span>
                          <span className="text-xs font-bold text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>{sp.done}/{sp.total}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(sp.done / sp.total) * 100}%` }} transition={{ duration: 0.8 }}
                            className="h-3 rounded-full" style={{ background: `linear-gradient(135deg, ${sp.gradient})` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Earned Badges Preview */}
                <div className="bg-white rounded-3xl shadow-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-black text-gray-800 text-lg" style={{ fontFamily: 'var(--font-playful)' }}>Badges ({earnedBadges.length}/{BADGES.length})</h3>
                    </div>
                    <button onClick={() => setTab('badges')} className="text-purple-600 font-black text-sm" style={{ fontFamily: 'var(--font-playful)' }}>See All →</button>
                  </div>
                  {earnedBadges.length === 0 ? (
                    <div className="text-center py-6">
                      <span className="text-5xl block mb-2">🎯</span>
                      <p className="text-gray-500 font-bold" style={{ fontFamily: 'var(--font-body)' }}>Complete lessons to earn badges!</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {earnedBadges.slice(0, 6).map(b => (
                        <motion.div key={b.id} initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }}
                          className="flex flex-col items-center bg-yellow-50 border-2 border-yellow-200 rounded-2xl px-3 py-2 min-w-[72px]">
                          <span className="text-3xl mb-1">{b.emoji}</span>
                          <p className="text-yellow-800 font-black text-xs text-center" style={{ fontFamily: 'var(--font-playful)' }}>{b.label}</p>
                        </motion.div>
                      ))}
                      {earnedBadges.length > 6 && (
                        <div className="flex flex-col items-center justify-center bg-gray-100 rounded-2xl px-3 py-2 min-w-[72px]">
                          <p className="font-black text-gray-600" style={{ fontFamily: 'var(--font-playful)' }}>+{earnedBadges.length - 6}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Certificates */}
                <div className="bg-white rounded-3xl shadow-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <h3 className="font-black text-gray-800 text-lg" style={{ fontFamily: 'var(--font-playful)' }}>Certificates</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {CERTIFICATES.map((cert, i) => (
                      <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
                        className={`rounded-2xl p-4 text-center border-2 ${cert.earned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                        <span className="text-4xl block mb-2">{cert.emoji}</span>
                        <p className="font-black text-sm text-gray-800" style={{ fontFamily: 'var(--font-playful)' }}>{cert.label}</p>
                        {cert.earned ? (
                          <span className="text-xs font-bold text-yellow-700 bg-yellow-200 px-2 py-0.5 rounded-full mt-1 inline-block" style={{ fontFamily: 'var(--font-body)' }}>Earned! 🎉</span>
                        ) : (
                          <span className="text-xs font-bold text-gray-400 mt-1 inline-block" style={{ fontFamily: 'var(--font-body)' }}>Not yet earned</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LESSONS TAB */}
            {tab === 'lessons' && (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl shadow-xl p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="font-black text-gray-800 text-lg" style={{ fontFamily: 'var(--font-playful)' }}>Completed Lessons</h3>
                  </div>
                  <p className="text-gray-500 text-sm font-bold mb-4" style={{ fontFamily: 'var(--font-body)' }}>{completedLessons.length} of {totalTopics} topics finished</p>
                  {completedLessons.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="text-6xl block mb-3">📖</span>
                      <p className="font-bold text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>No lessons completed yet. Start learning!</p>
                      <button onClick={() => navigate('/dashboard')}
                        className="mt-4 px-6 py-3 rounded-2xl text-white font-black shadow-md"
                        style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', fontFamily: 'var(--font-playful)' }}>
                        Go to Dashboard
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {completedLessons.map((item, i) => {
                        const subMeta = SUBJECT_META[item.subject as keyof typeof SUBJECT_META];
                        return (
                          <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all cursor-pointer"
                            onClick={() => navigate(`/${item.subject}/${item.topic}`)}>
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: subMeta.light }}>
                              {subMeta.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-gray-800 truncate" style={{ fontFamily: 'var(--font-playful)' }}>{item.label}</p>
                              <p className="text-sm font-bold text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>
                                {subMeta.label} {item.date ? `• ${formatDate(item.date)}` : ''}
                                {item.timeSpent ? ` • ${item.timeSpent} min` : ''}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <div className="flex gap-0.5">
                                {[0, 1, 2].map(si => (
                                  <Star key={si} className={`w-4 h-4 ${si < (item.quizStars || 0) / 3 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* QUIZZES TAB */}
            {tab === 'quizzes' && (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl shadow-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-black text-gray-800 text-lg" style={{ fontFamily: 'var(--font-playful)' }}>Quiz Results</h3>
                  </div>
                  {completedQuizzes.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="text-6xl block mb-3">❓</span>
                      <p className="font-bold text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>No quizzes taken yet. Complete a lesson first!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {completedQuizzes.map((item, i) => {
                        const subMeta = SUBJECT_META[item.subject as keyof typeof SUBJECT_META];
                        const pct = item.quizScore || 0;
                        const grade = pct >= 90 ? '🌟 Excellent' : pct >= 70 ? '✅ Good' : pct >= 50 ? '👍 Pass' : '📚 Review';
                        return (
                          <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
                            className="p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: subMeta.light }}>
                                {subMeta.emoji}
                              </div>
                              <div className="flex-1">
                                <p className="font-black text-gray-800" style={{ fontFamily: 'var(--font-playful)' }}>{item.label} Quiz</p>
                                <p className="text-sm font-bold text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>{subMeta.label} {item.date ? `• ${formatDate(item.date)}` : ''}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="font-black text-xl" style={{ fontFamily: 'var(--font-playful)', color: pct >= 70 ? '#059669' : '#F97316' }}>{pct}%</p>
                                <p className="text-xs font-bold text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>{grade}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <div className="h-2.5 rounded-full" style={{ width: `${pct}%`, background: pct >= 70 ? '#059669' : '#F97316' }} />
                              </div>
                              <button onClick={() => navigate(`/quiz/${item.subject}/${item.topic}`)}
                                className="text-xs px-3 py-1.5 rounded-xl font-black transition-all text-white"
                                style={{ background: `linear-gradient(135deg, ${subMeta.gradient})`, fontFamily: 'var(--font-playful)' }}>
                                Retake
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIDEOS TAB */}
            {tab === 'videos' && (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl shadow-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Video className="w-5 h-5 text-blue-500" />
                    <h3 className="font-black text-gray-800 text-lg" style={{ fontFamily: 'var(--font-playful)' }}>Videos Watched</h3>
                  </div>
                  {watchedVideos.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="text-6xl block mb-3">🎬</span>
                      <p className="font-bold text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>No videos watched yet. Complete a lesson to unlock videos!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {watchedVideos.map((item, i) => {
                        const subMeta = SUBJECT_META[item.subject as keyof typeof SUBJECT_META];
                        const saved = localStorage.getItem(`video_progress_${item.subject}_${item.topic}`);
                        const savedTime = saved ? JSON.parse(saved) : { time: 0, duration: 0 };
                        const pct = savedTime.duration > 0 ? Math.round((savedTime.time / savedTime.duration) * 100) : 0;
                        return (
                          <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
                            className="p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-200 transition-all cursor-pointer"
                            onClick={() => navigate(`/videos/${item.subject}/${item.topic}`)}>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 relative" style={{ background: subMeta.light }}>
                                {subMeta.emoji}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Play className="w-5 h-5 text-gray-700 opacity-40" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="font-black text-gray-800" style={{ fontFamily: 'var(--font-playful)' }}>{item.label}</p>
                                <p className="text-sm font-bold text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>{subMeta.label}</p>
                              </div>
                              <span className="text-xs font-black px-2 py-1 rounded-full text-white" style={{ background: `linear-gradient(135deg, ${subMeta.gradient})`, fontFamily: 'var(--font-playful)' }}>
                                {pct}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(135deg, ${subMeta.gradient})` }} />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BADGES TAB */}
            {tab === 'badges' && (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl shadow-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Medal className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-black text-gray-800 text-lg" style={{ fontFamily: 'var(--font-playful)' }}>All Badges ({earnedBadges.length}/{BADGES.length})</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {BADGES.map((badge, i) => (
                      <motion.div key={badge.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.04 }}
                        className={`rounded-2xl p-4 text-center border-2 transition-all ${badge.earned ? 'border-yellow-300 bg-yellow-50 shadow-md' : 'border-gray-100 bg-gray-50 opacity-50'}`}>
                        <motion.span animate={badge.earned ? { rotate: [0, 10, -10, 0] } : {}} transition={{ repeat: badge.earned ? Infinity : 0, repeatDelay: 3 }}
                          className="text-4xl block mb-2">{badge.emoji}</motion.span>
                        <p className="font-black text-gray-800 text-xs mb-1" style={{ fontFamily: 'var(--font-playful)' }}>{badge.label}</p>
                        <p className="text-gray-500 text-xs" style={{ fontFamily: 'var(--font-body)' }}>{badge.desc}</p>
                        {badge.earned && <span className="text-xs font-black text-yellow-700 mt-1 inline-block" style={{ fontFamily: 'var(--font-playful)' }}>Earned! ✓</span>}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STREAK TAB */}
            {tab === 'streak' && (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
                  <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <span className="text-8xl block mb-4">🔥</span>
                  </motion.div>
                  <h3 className="font-black text-gray-800 text-4xl mb-1" style={{ fontFamily: 'var(--font-playful)' }}>{streak} Days</h3>
                  <p className="text-gray-500 font-bold mb-6" style={{ fontFamily: 'var(--font-body)' }}>Current learning streak!</p>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { label: 'Current Streak', value: `${streak} days`, emoji: '🔥' },
                      { label: 'Lessons Done', value: completedLessons.length, emoji: '📖' },
                      { label: 'Total Stars', value: totalStars, emoji: '⭐' },
                    ].map((s, i) => (
                      <div key={i} className="bg-orange-50 rounded-2xl p-3 text-center">
                        <span className="text-2xl block mb-1">{s.emoji}</span>
                        <p className="font-black text-orange-800" style={{ fontFamily: 'var(--font-playful)' }}>{s.value}</p>
                        <p className="text-orange-600 text-xs font-bold" style={{ fontFamily: 'var(--font-body)' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                  {/* 7-day calendar */}
                  <div className="bg-orange-50 rounded-2xl p-4">
                    <p className="font-black text-orange-800 mb-3" style={{ fontFamily: 'var(--font-playful)' }}>Last 7 Days</p>
                    <div className="flex gap-2 justify-center">
                      {Array.from({ length: 7 }, (_, i) => {
                        const d = new Date(); d.setDate(d.getDate() - (6 - i));
                        const label = d.toLocaleDateString('en', { weekday: 'short' });
                        const active = i >= (7 - streak);
                        return (
                          <div key={i} className={`flex flex-col items-center gap-1 ${active ? '' : 'opacity-40'}`}>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${active ? 'bg-orange-400' : 'bg-gray-200'}`}>
                              {active ? '🔥' : '○'}
                            </div>
                            <span className="text-xs font-bold text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-5 space-y-2">
                    <p className="font-bold text-gray-600 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                      {streak >= 7 ? '🏆 You are a Week Warrior!' : streak >= 3 ? '💪 Great job! Keep the streak alive!' : '📖 Start a streak by learning every day!'}
                    </p>
                    <button onClick={() => navigate('/dashboard')}
                      className="px-8 py-3 rounded-2xl text-white font-black shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #F97316, #EC4899)', fontFamily: 'var(--font-playful)' }}>
                      Learn Today! 🚀
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
