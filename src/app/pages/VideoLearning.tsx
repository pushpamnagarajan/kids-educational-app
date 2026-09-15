import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Play, Pause, RotateCcw, Maximize, Minimize, SkipForward, SkipBack,
  Volume2, VolumeX, Subtitles, ChevronRight, Zap, BookOpen, Settings
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TOPIC_LABELS: Record<string, string> = {
  'numbers': 'Numbers', 'addition': 'Addition', 'subtraction': 'Subtraction', 'multiplication': 'Multiplication',
  'division': 'Division', 'fractions': 'Fractions', 'shapes': 'Shapes & Geometry', 'measurement': 'Measurement',
  'time': 'Time & Clock', 'money': 'Money & Currency', 'patterns': 'Patterns', 'place-value': 'Place Value',
  'comparing': 'Comparing Numbers', 'word-problems': 'Word Problems', 'odd-even': 'Odd & Even Numbers',
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

const SUBJECT_META: Record<string, { label: string; emoji: string; gradient: string; light: string }> = {
  math: { label: 'Mathematics', emoji: '🔢', gradient: '#7C3AED, #A855F7', light: '#F3E8FF' },
  science: { label: 'Science', emoji: '🔬', gradient: '#059669, #10B981', light: '#D1FAE5' },
  english: { label: 'English Grammar', emoji: '📚', gradient: '#0EA5E9, #6366F1', light: '#DBEAFE' },
};

interface VideoLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  durationSecs: number;
  thumbnail: string;
  captions: { time: number; text: string }[];
  topics: string[];
}

function buildVideos(subject: string, topic: string): VideoLesson[] {
  const label = TOPIC_LABELS[topic] || topic;
  return [
    {
      id: '1', title: `Introduction to ${label}`,
      description: `A fun and engaging introduction to ${label}. Learn the basics step by step with colorful animations!`,
      duration: '4:30', durationSecs: 270,
      thumbnail: SUBJECT_META[subject]?.emoji || '📹',
      topics: ['Introduction', 'Basic Concepts', 'First Examples'],
      captions: [
        { time: 0, text: `Welcome! Today we learn about ${label}!` },
        { time: 10, text: `Let's start with the basics.` },
        { time: 30, text: `Here is our first example.` },
        { time: 60, text: `Can you see how it works?` },
        { time: 90, text: `Now let's try something a little harder.` },
        { time: 120, text: `Great! You're doing amazing!` },
        { time: 180, text: `Let's recap what we learned.` },
        { time: 240, text: `Practice this at home today!` },
      ],
    },
    {
      id: '2', title: `${label} — Practice & Examples`,
      description: `Work through 10+ practice problems and examples. Great for building confidence!`,
      duration: '6:15', durationSecs: 375,
      thumbnail: '🎯',
      topics: ['Worked Examples', 'Practice Problems', 'Tips & Tricks'],
      captions: [
        { time: 0, text: `Welcome back! Time for practice!` },
        { time: 15, text: `First, let's review what we know.` },
        { time: 45, text: `Example 1 — watch carefully!` },
        { time: 90, text: `Did you get it? Let's check.` },
        { time: 130, text: `Example 2 — a bit trickier.` },
        { time: 180, text: `Here's a helpful trick to remember.` },
        { time: 240, text: `Now you try! Pause and work it out.` },
        { time: 320, text: `Excellent work! Keep it up!` },
      ],
    },
    {
      id: '3', title: `${label} — Challenge & Quiz Prep`,
      description: `Get ready for the quiz! Challenge problems and quiz tips to help you score 100!`,
      duration: '5:00', durationSecs: 300,
      thumbnail: '🏆',
      topics: ['Challenge Problems', 'Common Mistakes', 'Quiz Preparation'],
      captions: [
        { time: 0, text: `Are you ready for a challenge?` },
        { time: 20, text: `These questions appear in the quiz!` },
        { time: 60, text: `Tricky question — think carefully!` },
        { time: 100, text: `Common mistake: watch out for this!` },
        { time: 150, text: `Here's the correct way to solve it.` },
        { time: 200, text: `One more challenge for you!` },
        { time: 250, text: `You're quiz-ready! Go for 100%!` },
      ],
    },
  ];
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function VideoLearning() {
  const navigate = useNavigate();
  const { subject = 'math', topic = 'numbers' } = useParams<{ subject: string; topic: string }>();
  const { t } = useLanguage();
  const sm = SUBJECT_META[subject] || SUBJECT_META.math;
  const videos = buildVideos(subject, topic);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showCaptions, setShowCaptions] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentCaption, setCurrentCaption] = useState('');
  const [completed, setCompleted] = useState<boolean[]>(new Array(videos.length).fill(false));
  const [watchedAll, setWatchedAll] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const video = videos[currentIdx];
  const progress = video.durationSecs > 0 ? (currentTime / video.durationSecs) * 100 : 0;

  useEffect(() => {
    const saved = localStorage.getItem(`video_progress_${subject}_${topic}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.idx !== undefined) setCurrentIdx(data.idx);
        if (data.time !== undefined) setCurrentTime(data.time);
      } catch {}
    }
  }, [subject, topic]);

  useEffect(() => {
    const data = { idx: currentIdx, time: currentTime, duration: video.durationSecs };
    localStorage.setItem(`video_progress_${subject}_${topic}`, JSON.stringify(data));
  }, [currentIdx, currentTime, subject, topic, video.durationSecs]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(ct => {
          const next = ct + speed * 0.5;
          if (next >= video.durationSecs) {
            setPlaying(false);
            setCompleted(prev => { const n = [...prev]; n[currentIdx] = true; return n; });
            return video.durationSecs;
          }
          return next;
        });
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, video.durationSecs, currentIdx]);

  useEffect(() => {
    const caps = [...video.captions].sort((a, b) => b.time - a.time);
    const active = caps.find(c => currentTime >= c.time);
    setCurrentCaption(active ? active.text : '');
  }, [currentTime, video.captions]);

  useEffect(() => {
    if (completed.every(Boolean)) {
      setWatchedAll(true);
      localStorage.setItem(`video_watched_${subject}_${topic}`, 'true');
    }
  }, [completed, subject, topic]);

  const resetControls = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    if (playing) {
      controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [playing]);

  useEffect(() => {
    if (!playing) { setShowControls(true); if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current); }
    else { controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000); }
    return () => { if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current); };
  }, [playing]);

  const seek = (pct: number) => setCurrentTime((pct / 100) * video.durationSecs);
  const skipBy = (secs: number) => setCurrentTime(ct => Math.max(0, Math.min(video.durationSecs, ct + secs)));

  const switchVideo = (idx: number) => {
    setCurrentIdx(idx);
    setCurrentTime(0);
    setPlaying(false);
  };

  const replay = () => { setCurrentTime(0); setPlaying(true); };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)' }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(`/${subject}/${topic}`)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-2xl">{sm.emoji}</span>
            <div className="min-w-0">
              <h1 className="font-black text-white truncate" style={{ fontFamily: 'var(--font-playful)', fontSize: '1.1rem' }}>
                {TOPIC_LABELS[topic] || topic} — Videos
              </h1>
              <p className="text-white/60 text-xs font-bold" style={{ fontFamily: 'var(--font-body)' }}>{sm.label} • {videos.length} videos</p>
            </div>
          </div>
          <button onClick={() => navigate(`/quiz/${subject}/${topic}`)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-sm text-white transition-all"
            style={{ background: `linear-gradient(135deg, ${sm.gradient})`, fontFamily: 'var(--font-playful)' }}>
            <Zap className="w-4 h-4" /> Quiz
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className={`relative bg-black select-none ${fullscreen ? 'fixed inset-0 z-50' : 'max-w-4xl mx-auto'}`}
        style={{ aspectRatio: fullscreen ? undefined : '16/9' }}
        onMouseMove={resetControls}
        onClick={() => { setPlaying(p => !p); resetControls(); }}>

        {/* Video placeholder */}
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${sm.gradient.replace(', ', ' 30%, ')})`, aspectRatio: '16/9', minHeight: fullscreen ? '100vh' : undefined }}>
          {[...Array(5)].map((_, i) => (
            <motion.div key={i}
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.5 }}
              className="absolute rounded-full"
              style={{ width: 80 + i * 40, height: 80 + i * 40, background: 'rgba(255,255,255,0.08)', top: `${10 + i * 12}%`, left: `${5 + i * 15}%` }}
            />
          ))}
          <div className="text-center relative z-10 pointer-events-none">
            <motion.span animate={playing ? { rotate: [0, 5, -5, 0] } : {}} transition={{ repeat: Infinity, duration: 1 }}
              className="block mb-4" style={{ fontSize: '5rem' }}>{video.thumbnail}</motion.span>
            <p className="text-white font-black text-xl" style={{ fontFamily: 'var(--font-playful)' }}>{video.title}</p>
            <p className="text-white/70 font-bold text-sm px-4" style={{ fontFamily: 'var(--font-body)' }}>{video.description}</p>
            {!playing && (
              <div className="mt-6 flex items-center justify-center gap-2 text-white/60 font-bold text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                <Play className="w-4 h-4" /> Tap to play
              </div>
            )}
          </div>
        </div>

        {/* Captions */}
        <AnimatePresence>
          {showCaptions && currentCaption && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="absolute bottom-20 left-0 right-0 flex justify-center px-8 pointer-events-none z-10">
              <span className="bg-black/80 text-white px-4 py-2 rounded-xl font-bold text-base text-center"
                style={{ fontFamily: 'var(--font-body)', maxWidth: 480 }}>
                {currentCaption}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col justify-end pointer-events-none z-20"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }}>
              <div className="pointer-events-auto px-4 pb-4" onClick={e => e.stopPropagation()}>
                {/* Seek bar */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-white text-xs font-bold w-10 flex-shrink-0 text-right" style={{ fontFamily: 'var(--font-body)' }}>{formatTime(currentTime)}</span>
                  <div className="flex-1 h-2 bg-white/30 rounded-full cursor-pointer group relative"
                    onClick={e => { const r = e.currentTarget.getBoundingClientRect(); seek(((e.clientX - r.left) / r.width) * 100); }}>
                    <div className="h-2 rounded-full" style={{ width: `${progress}%`, background: `linear-gradient(135deg, ${sm.gradient})` }} />
                    <div className="absolute top-1/2 w-4 h-4 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                      style={{ left: `${progress}%`, transform: 'translateX(-50%) translateY(-50%)' }} />
                  </div>
                  <span className="text-white text-xs font-bold w-10 flex-shrink-0" style={{ fontFamily: 'var(--font-body)' }}>{video.duration}</span>
                </div>

                {/* Button row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => skipBy(-10)} className="p-2 text-white hover:text-yellow-300 transition-all">
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button onClick={() => setPlaying(p => !p)}
                      className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all">
                      {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </button>
                    <button onClick={() => skipBy(10)} className="p-2 text-white hover:text-yellow-300 transition-all">
                      <SkipForward className="w-5 h-5" />
                    </button>
                    <button onClick={replay} className="p-2 text-white hover:text-yellow-300 transition-all">
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <button onClick={() => setMuted(m => !m)} className="p-2 text-white hover:text-yellow-300 transition-all">
                      {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowCaptions(c => !c)}
                      className={`p-2 transition-all ${showCaptions ? 'text-yellow-300' : 'text-white/50'}`}>
                      <Subtitles className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <button onClick={() => setShowSettings(s => !s)} className="p-2 text-white hover:text-yellow-300 transition-all">
                        <Settings className="w-5 h-5" />
                      </button>
                      <AnimatePresence>
                        {showSettings && (
                          <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute bottom-10 right-0 bg-gray-900 rounded-2xl p-3 shadow-2xl z-30" style={{ minWidth: 140 }}>
                            <p className="text-white/60 text-xs font-bold mb-2" style={{ fontFamily: 'var(--font-body)' }}>Playback Speed</p>
                            {SPEEDS.map(s => (
                              <button key={s} onClick={() => { setSpeed(s); setShowSettings(false); }}
                                className={`block w-full text-left px-3 py-1.5 rounded-xl text-sm font-black transition-all mb-1 ${speed === s ? 'bg-purple-600 text-white' : 'text-white hover:bg-white/10'}`}
                                style={{ fontFamily: 'var(--font-playful)' }}>
                                {s}x{s === 1 ? ' (Normal)' : ''}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button onClick={() => setFullscreen(f => !f)} className="p-2 text-white hover:text-yellow-300 transition-all">
                      {fullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion overlay */}
        <AnimatePresence>
          {completed[currentIdx] && !playing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center z-30"
              onClick={e => e.stopPropagation()}>
              <div className="text-center">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: 3 }}>
                  <span className="text-7xl block mb-3">🎉</span>
                </motion.div>
                <p className="text-white font-black text-2xl mb-4" style={{ fontFamily: 'var(--font-playful)' }}>Video Complete!</p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <button onClick={replay}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-white font-black text-sm transition-all"
                    style={{ fontFamily: 'var(--font-playful)' }}>
                    <RotateCcw className="w-4 h-4" /> Replay
                  </button>
                  {currentIdx < videos.length - 1 && (
                    <button onClick={() => switchVideo(currentIdx + 1)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-black text-sm transition-all"
                      style={{ background: `linear-gradient(135deg, ${sm.gradient})`, fontFamily: 'var(--font-playful)' }}>
                      Next Video <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                  {currentIdx === videos.length - 1 && (
                    <button onClick={() => navigate(`/quiz/${subject}/${topic}`)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-black text-sm transition-all"
                      style={{ background: 'linear-gradient(135deg, #F59E0B, #EC4899)', fontFamily: 'var(--font-playful)' }}>
                      <Zap className="w-4 h-4" /> Take Quiz!
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Below player */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="mt-4 bg-white/10 rounded-2xl p-4 mb-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h2 className="font-black text-white text-lg" style={{ fontFamily: 'var(--font-playful)' }}>{video.title}</h2>
              <p className="text-white/70 text-sm font-bold" style={{ fontFamily: 'var(--font-body)' }}>{video.description}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-white/60 text-xs font-bold" style={{ fontFamily: 'var(--font-body)' }}>Duration</p>
              <p className="text-white font-black" style={{ fontFamily: 'var(--font-playful)' }}>{video.duration}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {video.topics.map((tp, i) => (
              <span key={i} className="text-white/80 text-xs font-bold px-3 py-1 rounded-full bg-white/10" style={{ fontFamily: 'var(--font-body)' }}>
                {tp}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-white/50 text-xs font-bold" style={{ fontFamily: 'var(--font-body)' }}>Speed: {speed}x</span>
            <span className="text-white/30">•</span>
            <span className="text-white/50 text-xs font-bold" style={{ fontFamily: 'var(--font-body)' }}>Captions: {showCaptions ? 'On' : 'Off'}</span>
          </div>
        </div>

        {/* Video list */}
        <h3 className="font-black text-white text-base mb-3" style={{ fontFamily: 'var(--font-playful)' }}>All Videos</h3>
        <div className="space-y-3 mb-4">
          {videos.map((v, i) => (
            <motion.button key={v.id} whileHover={{ scale: 1.01 }} onClick={() => switchVideo(i)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${i === currentIdx ? 'bg-white/20 border-2 border-yellow-400' : 'bg-white/10 border-2 border-transparent hover:bg-white/15'}`}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${sm.gradient})` }}>
                {completed[i] ? '✅' : v.thumbnail}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-white truncate text-sm" style={{ fontFamily: 'var(--font-playful)' }}>
                  {i + 1}. {v.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/60 text-xs font-bold" style={{ fontFamily: 'var(--font-body)' }}>{v.duration}</span>
                  {completed[i] && <span className="text-green-400 text-xs font-black" style={{ fontFamily: 'var(--font-playful)' }}>✓ Done</span>}
                  {i === currentIdx && !completed[i] && <span className="text-yellow-400 text-xs font-black" style={{ fontFamily: 'var(--font-playful)' }}>▶ Playing</span>}
                </div>
              </div>
              {i === currentIdx && <div className="flex-shrink-0 w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />}
            </motion.button>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate(`/${subject}/${topic}`)}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-black text-sm transition-all"
            style={{ fontFamily: 'var(--font-playful)' }}>
            <BookOpen className="w-5 h-5" /> Back to Lesson
          </button>
          <button onClick={() => navigate(`/quiz/${subject}/${topic}`)}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-white transition-all shadow-lg"
            style={{ background: `linear-gradient(135deg, ${sm.gradient})`, fontFamily: 'var(--font-playful)' }}>
            <Zap className="w-5 h-5" /> Take Quiz
          </button>
        </div>

        {/* Watched all banner */}
        <AnimatePresence>
          {watchedAll && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="mt-5 rounded-3xl p-5 text-center text-white shadow-xl"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #EC4899)' }}>
              <span className="text-5xl block mb-2">🏆</span>
              <p className="font-black text-xl mb-1" style={{ fontFamily: 'var(--font-playful)' }}>All Videos Watched!</p>
              <p className="text-white/90 font-bold text-sm mb-3" style={{ fontFamily: 'var(--font-body)' }}>You're ready to ace the quiz!</p>
              <button onClick={() => navigate(`/quiz/${subject}/${topic}`)}
                className="bg-white text-orange-600 font-black px-6 py-3 rounded-2xl shadow-md hover:opacity-90 transition-all"
                style={{ fontFamily: 'var(--font-playful)' }}>
                🎯 Take the Quiz Now!
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
