import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trophy, Star, Award, Target, Zap, Calendar, Download, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Challenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  requirement: string;
  reward: number;
  category: 'daily' | 'weekly' | 'achievement';
  completed: boolean;
  progress: number;
  total: number;
}

export function Challenges() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = () => {
    const mathCompleted = ['numbers', 'addition', 'subtraction', 'multiplication', 'division']
      .filter(t => localStorage.getItem(`math_${t}_completed`) === 'true').length;

    const scienceCompleted = ['plants', 'animals', 'human-body', 'earth-space', 'weather']
      .filter(t => localStorage.getItem(`science_${t}_completed`) === 'true').length;

    const englishCompleted = ['alphabet', 'nouns', 'verbs', 'adjectives', 'sentences']
      .filter(t => localStorage.getItem(`english_${t}_completed`) === 'true').length;

    const totalStars = parseInt(localStorage.getItem('math_stars') || '0') +
      parseInt(localStorage.getItem('science_stars') || '0') +
      parseInt(localStorage.getItem('english_stars') || '0');

    const watchedVideos = JSON.parse(localStorage.getItem('watched_videos') || '[]').length;

    const challengesList: Challenge[] = [
      // Daily Challenges
      {
        id: 'daily_lesson',
        title: 'Daily Learner',
        description: 'Complete 1 lesson today',
        emoji: '📚',
        requirement: 'Finish any lesson',
        reward: 10,
        category: 'daily',
        completed: mathCompleted + scienceCompleted + englishCompleted >= 1,
        progress: Math.min(mathCompleted + scienceCompleted + englishCompleted, 1),
        total: 1,
      },
      {
        id: 'daily_quiz',
        title: 'Quiz Master',
        description: 'Take 1 quiz today',
        emoji: '📝',
        requirement: 'Complete a quiz',
        reward: 15,
        category: 'daily',
        completed: localStorage.getItem('daily_quiz_taken') === 'true',
        progress: localStorage.getItem('daily_quiz_taken') === 'true' ? 1 : 0,
        total: 1,
      },
      {
        id: 'daily_video',
        title: 'Video Watcher',
        description: 'Watch 1 educational video',
        emoji: '🎥',
        requirement: 'Watch a video',
        reward: 10,
        category: 'daily',
        completed: watchedVideos >= 1,
        progress: Math.min(watchedVideos, 1),
        total: 1,
      },

      // Weekly Challenges
      {
        id: 'weekly_5lessons',
        title: 'Learning Streak',
        description: 'Complete 5 lessons this week',
        emoji: '🔥',
        requirement: 'Finish 5 lessons',
        reward: 50,
        category: 'weekly',
        completed: mathCompleted + scienceCompleted + englishCompleted >= 5,
        progress: mathCompleted + scienceCompleted + englishCompleted,
        total: 5,
      },
      {
        id: 'weekly_stars',
        title: 'Star Collector',
        description: 'Earn 20 stars this week',
        emoji: '⭐',
        requirement: 'Collect 20 stars',
        reward: 75,
        category: 'weekly',
        completed: totalStars >= 20,
        progress: totalStars,
        total: 20,
      },

      // Achievement Challenges
      {
        id: 'math_master',
        title: 'Math Master',
        description: 'Complete all math topics',
        emoji: '🧮',
        requirement: 'Finish all 5 math topics',
        reward: 100,
        category: 'achievement',
        completed: mathCompleted >= 5,
        progress: mathCompleted,
        total: 5,
      },
      {
        id: 'science_explorer',
        title: 'Science Explorer',
        description: 'Complete all science topics',
        emoji: '🔬',
        requirement: 'Finish all 5 science topics',
        reward: 100,
        category: 'achievement',
        completed: scienceCompleted >= 5,
        progress: scienceCompleted,
        total: 5,
      },
      {
        id: 'english_expert',
        title: 'English Expert',
        description: 'Complete all English topics',
        emoji: '📖',
        requirement: 'Finish all 5 English topics',
        reward: 100,
        category: 'achievement',
        completed: englishCompleted >= 5,
        progress: englishCompleted,
        total: 5,
      },
      {
        id: 'super_learner',
        title: 'Super Learner',
        description: 'Complete ALL lessons in ALL subjects',
        emoji: '🏆',
        requirement: 'Finish all 15 topics',
        reward: 500,
        category: 'achievement',
        completed: mathCompleted >= 5 && scienceCompleted >= 5 && englishCompleted >= 5,
        progress: mathCompleted + scienceCompleted + englishCompleted,
        total: 15,
      },
    ];

    setChallenges(challengesList);
  };

  const claimReward = (challenge: Challenge) => {
    if (challenge.completed && !localStorage.getItem(`challenge_${challenge.id}_claimed`)) {
      localStorage.setItem(`challenge_${challenge.id}_claimed`, 'true');
      const currentPoints = parseInt(localStorage.getItem('reward_points') || '0');
      localStorage.setItem('reward_points', (currentPoints + challenge.reward).toString());

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      loadChallenges();
    }
  };

  const downloadCertificate = (certificateType: string) => {
    // In a real app, this would generate a PDF
    alert(`Certificate "${certificateType}" would be downloaded as PDF!`);
  };

  const shareCertificate = (certificateType: string) => {
    // In a real app, this would share on social media
    alert(`Share your "${certificateType}" certificate with friends and family!`);
  };

  const getCertificates = () => {
    const certs = [];
    const mathCompleted = ['numbers', 'addition', 'subtraction', 'multiplication', 'division']
      .filter(t => localStorage.getItem(`math_${t}_completed`) === 'true').length;
    const scienceCompleted = ['plants', 'animals', 'human-body', 'earth-space', 'weather']
      .filter(t => localStorage.getItem(`science_${t}_completed`) === 'true').length;
    const englishCompleted = ['alphabet', 'nouns', 'verbs', 'adjectives', 'sentences']
      .filter(t => localStorage.getItem(`english_${t}_completed`) === 'true').length;

    if (mathCompleted >= 5) certs.push({ id: 'math', title: 'Mathematics Master', emoji: '🧮', date: new Date().toLocaleDateString() });
    if (scienceCompleted >= 5) certs.push({ id: 'science', title: 'Science Explorer', emoji: '🔬', date: new Date().toLocaleDateString() });
    if (englishCompleted >= 5) certs.push({ id: 'english', title: 'English Expert', emoji: '📖', date: new Date().toLocaleDateString() });
    if (mathCompleted >= 5 && scienceCompleted >= 5 && englishCompleted >= 5) {
      certs.push({ id: 'super', title: 'Super Learner Champion', emoji: '🏆', date: new Date().toLocaleDateString() });
    }

    return certs;
  };

  const certificates = getCertificates();
  const totalPoints = parseInt(localStorage.getItem('reward_points') || '0');

  const dailyChallenges = challenges.filter(c => c.category === 'daily');
  const weeklyChallenges = challenges.filter(c => c.category === 'weekly');
  const achievementChallenges = challenges.filter(c => c.category === 'achievement');

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 shadow-xl">
        <div className="max-w-6xl mx-auto">
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
                🏆 Challenges & Rewards
              </h1>
              <p className="text-xl opacity-90">Complete challenges to earn rewards!</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
              <p className="text-3xl font-black">{totalPoints}</p>
              <p className="text-sm opacity-90">Reward Points</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Daily Challenges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            Daily Challenges
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {dailyChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-3xl shadow-xl overflow-hidden ${
                  challenge.completed ? 'ring-4 ring-green-400' : ''
                }`}
              >
                <div className={`p-6 ${challenge.completed ? 'bg-green-50' : 'bg-blue-50'}`}>
                  <div className="text-6xl text-center mb-4">{challenge.emoji}</div>
                  <h3 className="text-xl font-black text-gray-800 text-center mb-2">
                    {challenge.title}
                  </h3>
                  <p className="text-gray-600 text-center text-sm mb-4">{challenge.description}</p>

                  <div className="bg-white rounded-xl p-3 mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-bold text-gray-800">{challenge.progress}/{challenge.total}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-full rounded-full transition-all ${
                          challenge.completed ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Zap className="w-5 h-5" />
                      <span className="font-bold">+{challenge.reward}</span>
                    </div>
                    {challenge.completed && (
                      <button
                        onClick={() => claimReward(challenge)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-bold text-sm hover:shadow-lg transition-all"
                      >
                        {localStorage.getItem(`challenge_${challenge.id}_claimed`) ? '✓ Claimed' : 'Claim'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Challenges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-2">
            <Target className="w-8 h-8 text-purple-600" />
            Weekly Challenges
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {weeklyChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`bg-white rounded-3xl shadow-xl p-6 ${
                  challenge.completed ? 'ring-4 ring-purple-400' : ''
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-5xl">{challenge.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-gray-800 mb-2">{challenge.title}</h3>
                    <p className="text-gray-600 mb-2">{challenge.description}</p>
                    <p className="text-sm text-gray-500">{challenge.requirement}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Zap className="w-6 h-6" />
                      <span className="text-xl font-bold">+{challenge.reward}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-2xl p-4 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-bold">Progress</span>
                    <span className="font-black text-gray-800">{challenge.progress}/{challenge.total}</span>
                  </div>
                  <div className="bg-white rounded-full h-4">
                    <div
                      className={`h-full rounded-full transition-all ${
                        challenge.completed ? 'bg-purple-500' : 'bg-purple-300'
                      }`}
                      style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    />
                  </div>
                </div>

                {challenge.completed && (
                  <button
                    onClick={() => claimReward(challenge)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-full font-bold hover:shadow-lg transition-all"
                  >
                    {localStorage.getItem(`challenge_${challenge.id}_claimed`) ? '✓ Claimed' : 'Claim Reward'}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievement Challenges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-600" />
            Achievement Challenges
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {achievementChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-xl p-6 border-4 ${
                  challenge.completed ? 'border-yellow-400' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-6xl mb-3">{challenge.emoji}</div>
                    <h3 className="text-2xl font-black text-gray-800 mb-2">{challenge.title}</h3>
                    <p className="text-gray-600">{challenge.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-black text-lg">
                      +{challenge.reward}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-bold">Progress</span>
                    <span className="font-black text-gray-800">{challenge.progress}/{challenge.total}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all"
                      style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    />
                  </div>
                </div>

                {challenge.completed && (
                  <button
                    onClick={() => claimReward(challenge)}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-full font-black text-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    {localStorage.getItem(`challenge_${challenge.id}_claimed`) ? '✓ Reward Claimed!' : '🎉 Claim Big Reward'}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certificates */}
        {certificates.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <h2 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <Award className="w-8 h-8 text-pink-600" />
              Your Certificates
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedCertificate(cert.id);
                    setShowCertificate(true);
                  }}
                  className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white cursor-pointer"
                >
                  <div className="text-center mb-6">
                    <div className="text-7xl mb-4">{cert.emoji}</div>
                    <h3 className="text-3xl font-black mb-2">{cert.title}</h3>
                    <p className="text-purple-100">Awarded on {cert.date}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadCertificate(cert.title);
                      }}
                      className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareCertificate(cert.title);
                      }}
                      className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50"
            onClick={() => setShowCertificate(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-12 max-w-2xl w-full relative"
              style={{
                backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: '8px solid gold',
              }}
            >
              <div className="text-center text-white">
                <div className="text-8xl mb-6">
                  {certificates.find(c => c.id === selectedCertificate)?.emoji}
                </div>
                <h2 className="text-5xl font-black mb-4" style={{ fontFamily: 'var(--font-playful)' }}>
                  Certificate of Achievement
                </h2>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <p className="text-2xl mb-4">This certifies that</p>
                  <p className="text-4xl font-black mb-4">Amazing Student</p>
                  <p className="text-2xl mb-4">has successfully completed</p>
                  <p className="text-3xl font-black mb-6">
                    {certificates.find(c => c.id === selectedCertificate)?.title}
                  </p>
                  <p className="text-xl">
                    Date: {certificates.find(c => c.id === selectedCertificate)?.date}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => downloadCertificate(certificates.find(c => c.id === selectedCertificate)!.title)}
                    className="flex-1 bg-white text-purple-600 py-4 rounded-full font-black text-lg hover:shadow-xl transition-all"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => setShowCertificate(false)}
                    className="flex-1 bg-white/20 backdrop-blur-sm py-4 rounded-full font-black text-lg hover:bg-white/30 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
