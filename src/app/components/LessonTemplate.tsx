import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Volume2, Video, Star, CheckCircle, Lightbulb, BookOpen, Award, Clock, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface LessonStep {
  title: string;
  emoji: string;
  explanation: string;
  examples: { text: string; detail?: string; visual?: string }[];
  tip: string;
  funFact?: string;
  tryThis?: string;
}

export interface LessonData {
  title: string;
  emoji: string;
  subject: string;
  topic: string;
  subjectColor: { gradient: string; light: string; text: string; bar: string };
  steps: LessonStep[];
}

interface LessonTemplateProps {
  data: LessonData;
}

const AUDIO_ENABLED = 'speechSynthesis' in window;

function speak(text: string, rate = 0.85) {
  if (!AUDIO_ENABLED) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[🍎⭐❤️🌱🔬📚✏️]/g, ''));
  u.rate = rate; u.pitch = 1.2;
  window.speechSynthesis.speak(u);
}

export function LessonTemplate({ data }: LessonTemplateProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [revealedExamples, setRevealedExamples] = useState<number[]>([]);
  const [showTip, setShowTip] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [stepsDone, setStepsDone] = useState<boolean[]>(new Array(data.steps.length).fill(false));
  const [timeStart] = useState(Date.now());
  const [completed, setCompleted] = useState(false);
  const [miniQuiz, setMiniQuiz] = useState<{ show: boolean; q: string; opts: string[]; ans: string; selected: string | null; correct: boolean | null }>({
    show: false, q: '', opts: [], ans: '', selected: null, correct: null,
  });
  const topRef = useRef<HTMLDivElement>(null);

  const { subject, topic, subjectColor: sc } = data;
  const currentStep = data.steps[step];
  const totalSteps = data.steps.length;
  const progressPct = ((step + 1) / totalSteps) * 100;

  useEffect(() => {
    setRevealedExamples([]);
    setShowTip(false);
    setShowFact(false);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    // Auto-reveal examples one by one
    const timers: ReturnType<typeof setTimeout>[] = [];
    currentStep.examples.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setRevealedExamples(prev => prev.includes(i) ? prev : [...prev, i]);
      }, 400 + i * 350));
    });
    const tipTimer = setTimeout(() => setShowTip(true), 400 + currentStep.examples.length * 350 + 200);
    timers.push(tipTimer);
    return () => timers.forEach(clearTimeout);
  }, [step]);

  const markStepDone = () => {
    const next = [...stepsDone];
    next[step] = true;
    setStepsDone(next);
  };

  const handleNext = () => {
    markStepDone();
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      finishLesson();
    }
  };

  const finishLesson = () => {
    const minutes = Math.round((Date.now() - timeStart) / 60000) || 1;
    const prev = parseInt(localStorage.getItem(`time_spent_total`) || '0');
    localStorage.setItem(`time_spent_total`, String(prev + minutes));
    localStorage.setItem(`time_spent_${subject}_${topic}`, String(minutes));
    localStorage.setItem(`lesson_date_${subject}_${topic}`, new Date().toISOString());
    localStorage.setItem(`${subject}_${topic}_completed`, 'true');
    if (!localStorage.getItem(`${subject}_${topic}_stars`)) {
      localStorage.setItem(`${subject}_${topic}_stars`, '2');
    }
    const subStars = parseInt(localStorage.getItem(`${subject}_stars`) || '0');
    if (!localStorage.getItem(`${subject}_${topic}_star_counted`)) {
      localStorage.setItem(`${subject}_stars`, String(subStars + 2));
      localStorage.setItem(`${subject}_${topic}_star_counted`, 'true');
    }
    setCompleted(true);
  };

  const showMiniQuiz = (q: string, opts: string[], ans: string) => {
    setMiniQuiz({ show: true, q, opts, ans, selected: null, correct: null });
  };

  const answerMiniQuiz = (opt: string) => {
    const correct = opt === miniQuiz.ans;
    setMiniQuiz(prev => ({ ...prev, selected: opt, correct }));
  };

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #FFF9C4, #FFD6E0, #C3B1E1)' }}>
        <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', duration: 0.7 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }} transition={{ repeat: 3, duration: 0.4 }}>
            <span className="text-8xl block mb-4">🏆</span>
          </motion.div>
          <h2 className="text-4xl font-black mb-2" style={{ fontFamily: 'var(--font-playful)', color: '#7C3AED' }}>Lesson Complete!</h2>
          <p className="text-gray-600 font-bold mb-2" style={{ fontFamily: 'var(--font-body)' }}>
            You finished all {totalSteps} steps!
          </p>
          <div className="flex justify-center gap-2 mb-6 mt-4">
            {[0, 1, 2].map(i => (
              <motion.div key={i} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 + i * 0.15 }}>
                <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: '⏱️', label: `${Math.round((Date.now() - timeStart) / 60000) || 1} min`, sub: 'Time Spent' },
              { icon: '📖', label: String(totalSteps), sub: 'Steps Done' },
              { icon: '✨', label: String(currentStep.examples.length * totalSteps) + '+', sub: 'Examples' },
            ].map((s, i) => (
              <div key={i} className="bg-purple-50 rounded-2xl p-3 text-center">
                <span className="text-2xl block">{s.icon}</span>
                <p className="font-black text-gray-800 text-sm" style={{ fontFamily: 'var(--font-playful)' }}>{s.label}</p>
                <p className="text-gray-500 text-xs" style={{ fontFamily: 'var(--font-body)' }}>{s.sub}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <motion.button whileHover={{ scale: 1.03 }} onClick={() => navigate(`/videos/${subject}/${topic}`)}
              className="w-full text-white font-black text-lg py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)', fontFamily: 'var(--font-playful)' }}>
              <Video className="w-5 h-5" /> {t.watchVideo}
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} onClick={() => navigate(`/quiz/${subject}/${topic}`)}
              className="w-full text-white font-black text-lg py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${sc.gradient})`, fontFamily: 'var(--font-playful)' }}>
              <Zap className="w-5 h-5" /> {t.takeQuiz}
            </motion.button>
            <button onClick={() => navigate(`/${subject}`)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-lg py-4 rounded-2xl transition-all"
              style={{ fontFamily: 'var(--font-playful)' }}>
              {t.moreTopics}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: sc.light }} ref={topRef}>
      {/* Header */}
      <div className="sticky top-0 z-30 shadow-lg" style={{ background: `linear-gradient(135deg, ${sc.gradient})` }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate(`/${subject}`)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-xl transition-all font-bold text-sm text-white"
              style={{ fontFamily: 'var(--font-body)' }}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(`/videos/${subject}/${topic}`)}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-xl transition-all font-bold text-sm text-white"
                style={{ fontFamily: 'var(--font-body)' }}>
                <Video className="w-4 h-4" /> Video
              </button>
              <button onClick={() => navigate(`/quiz/${subject}/${topic}`)}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-xl transition-all font-bold text-sm text-white"
                style={{ fontFamily: 'var(--font-body)' }}>
                <Zap className="w-4 h-4" /> Quiz
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{data.emoji}</span>
            <div>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-playful)' }}>{data.title}</h1>
              <p className="text-white/80 text-sm font-bold" style={{ fontFamily: 'var(--font-body)' }}>
                Step {step + 1} of {totalSteps}
              </p>
            </div>
          </div>

          <div className="flex gap-1.5">
            {data.steps.map((_, i) => (
              <button key={i} onClick={() => setStep(i)}
                className={`flex-1 h-2.5 rounded-full transition-all ${i === step ? 'bg-yellow-400' : i < step || stepsDone[i] ? 'bg-white/60' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}>

            {/* Step header */}
            <div className="bg-white rounded-3xl shadow-xl p-6 mb-4">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: sc.light }}>
                    {currentStep.emoji}
                  </div>
                  <div>
                    <div className={`text-xs font-black px-3 py-1 rounded-full inline-block mb-1 ${sc.text} bg-opacity-10`} style={{ background: sc.light }}>
                      Step {step + 1}
                    </div>
                    <h2 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'var(--font-playful)' }}>{currentStep.title}</h2>
                  </div>
                </div>
                <button onClick={() => speak(currentStep.explanation)}
                  className="flex-shrink-0 p-3 rounded-2xl hover:opacity-80 transition-all"
                  style={{ background: sc.light }}>
                  <Volume2 className={`w-5 h-5 ${sc.text}`} />
                </button>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed font-bold" style={{ fontFamily: 'var(--font-body)' }}>
                {currentStep.explanation}
              </p>
            </div>

            {/* Examples */}
            <div className="bg-white rounded-3xl shadow-xl p-6 mb-4">
              <div className="flex items-center gap-2 mb-5">
                <BookOpen className={`w-5 h-5 ${sc.text}`} />
                <h3 className="text-xl font-black text-gray-800" style={{ fontFamily: 'var(--font-playful)' }}>
                  Examples ({currentStep.examples.length})
                </h3>
                <span className="text-xs font-bold text-gray-500 ml-auto" style={{ fontFamily: 'var(--font-body)' }}>
                  Tap 🔊 to hear each one
                </span>
              </div>

              <div className="space-y-3">
                {currentStep.examples.map((ex, i) => (
                  <AnimatePresence key={i}>
                    {revealedExamples.includes(i) && (
                      <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }}
                        className="rounded-2xl p-4 flex items-center gap-3 group hover:shadow-md transition-all cursor-default"
                        style={{ background: sc.light }}>
                        <span className="text-2xl flex-shrink-0">{ex.visual || '📌'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-gray-800 text-base leading-snug" style={{ fontFamily: 'var(--font-body)' }}>{ex.text}</p>
                          {ex.detail && <p className="text-gray-600 text-sm mt-0.5 font-bold" style={{ fontFamily: 'var(--font-body)' }}>{ex.detail}</p>}
                        </div>
                        <button onClick={() => speak(ex.text + (ex.detail ? '. ' + ex.detail : ''))}
                          className={`flex-shrink-0 p-2.5 rounded-xl opacity-60 group-hover:opacity-100 transition-all ${sc.text}`}
                          style={{ background: 'rgba(255,255,255,0.7)' }}>
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>

            {/* Tip */}
            <AnimatePresence>
              {showTip && (
                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  className="bg-amber-50 border-l-4 border-amber-400 rounded-2xl p-4 mb-4 flex gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-black text-amber-800 text-sm mb-0.5" style={{ fontFamily: 'var(--font-playful)' }}>💡 Teacher's Tip</p>
                    <p className="text-amber-700 font-bold text-sm" style={{ fontFamily: 'var(--font-body)' }}>{currentStep.tip}</p>
                    {currentStep.tryThis && (
                      <div className="mt-2 pt-2 border-t border-amber-200">
                        <p className="font-black text-amber-800 text-sm" style={{ fontFamily: 'var(--font-playful)' }}>🎯 Try This:</p>
                        <p className="text-amber-700 font-bold text-sm" style={{ fontFamily: 'var(--font-body)' }}>{currentStep.tryThis}</p>
                      </div>
                    )}
                  </div>
                  <button onClick={() => speak(currentStep.tip)} className="flex-shrink-0 p-2 rounded-xl bg-amber-100 hover:bg-amber-200 transition-all">
                    <Volume2 className="w-4 h-4 text-amber-600" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fun Fact */}
            {currentStep.funFact && (
              <button onClick={() => setShowFact(!showFact)}
                className="w-full bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-2xl p-4 mb-4 flex items-center gap-3 transition-all text-left">
                <span className="text-2xl">🌟</span>
                <div className="flex-1">
                  <p className="font-black text-purple-700 text-sm" style={{ fontFamily: 'var(--font-playful)' }}>Fun Fact!</p>
                  <AnimatePresence>
                    {showFact && (
                      <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="text-purple-600 font-bold text-sm overflow-hidden" style={{ fontFamily: 'var(--font-body)' }}>
                        {currentStep.funFact}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  {!showFact && <p className="text-purple-400 text-xs font-bold" style={{ fontFamily: 'var(--font-body)' }}>Tap to reveal!</p>}
                </div>
                {showFact ? <ChevronUp className="w-4 h-4 text-purple-500" /> : <ChevronDown className="w-4 h-4 text-purple-500" />}
              </button>
            )}

            {/* Mini Quiz */}
            {miniQuiz.show && (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl shadow-xl p-6 mb-4 border-2 border-purple-200">
                <p className="font-black text-purple-700 mb-4 text-lg" style={{ fontFamily: 'var(--font-playful)' }}>🎯 Quick Check!</p>
                <p className="font-bold text-gray-800 mb-4 text-base" style={{ fontFamily: 'var(--font-body)' }}>{miniQuiz.q}</p>
                <div className="grid grid-cols-2 gap-3">
                  {miniQuiz.opts.map(opt => {
                    let cls = 'p-3 rounded-2xl font-black text-base transition-all text-center ';
                    if (!miniQuiz.selected) cls += 'bg-purple-100 hover:bg-purple-200 text-purple-800 cursor-pointer';
                    else if (opt === miniQuiz.ans) cls += 'bg-green-500 text-white';
                    else if (opt === miniQuiz.selected) cls += 'bg-red-400 text-white';
                    else cls += 'bg-gray-100 text-gray-400 opacity-50';
                    return (
                      <button key={opt} onClick={() => !miniQuiz.selected && answerMiniQuiz(opt)}
                        className={cls} style={{ fontFamily: 'var(--font-playful)' }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {miniQuiz.selected && (
                  <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className={`mt-3 text-center font-black text-sm p-3 rounded-2xl ${miniQuiz.correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                    style={{ fontFamily: 'var(--font-playful)' }}>
                    {miniQuiz.correct ? '🎉 Correct! Keep going!' : `❌ The answer is: ${miniQuiz.ans}`}
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-4">
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)}
                  className="flex-1 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-black text-lg py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                  style={{ fontFamily: 'var(--font-playful)' }}>
                  <ArrowLeft className="w-5 h-5" /> {t.previousLesson}
                </button>
              )}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="flex-1 text-white font-black text-lg py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${sc.gradient})`, fontFamily: 'var(--font-playful)' }}>
                {step < totalSteps - 1 ? (
                  <>{t.nextLesson} <ArrowRight className="w-5 h-5" /></>
                ) : (
                  <>Finish Lesson! 🎉</>
                )}
              </motion.button>
            </div>

            {/* Step counter pills */}
            <div className="flex justify-center gap-2 mt-5">
              {data.steps.map((s, i) => (
                <button key={i} onClick={() => setStep(i)}
                  className={`w-8 h-8 rounded-full font-black text-xs transition-all ${i === step ? 'text-white shadow-md scale-110' : stepsDone[i] ? 'bg-white text-green-600 border-2 border-green-300' : 'bg-white/70 text-gray-500'}`}
                  style={{ background: i === step ? `linear-gradient(135deg, ${sc.gradient})` : undefined, fontFamily: 'var(--font-playful)' }}>
                  {stepsDone[i] && i !== step ? '✓' : i + 1}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
