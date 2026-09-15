import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, Video, BookOpen, Users, Settings, Plus, Edit, Trash2, Eye } from 'lucide-react';

interface VideoContent {
  id: number;
  title: string;
  subject: string;
  topic: string;
  duration: string;
  thumbnail: string;
  level: string;
}

export function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'videos' | 'lessons' | 'users' | 'settings'>('videos');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    subject: 'math',
    topic: '',
    duration: '',
    level: 'beginner',
    description: '',
  });

  const [videoLibrary, setVideoLibrary] = useState<VideoContent[]>([
    { id: 1, title: 'Counting 1 to 10', subject: 'Math', topic: 'Numbers', duration: '5:20', thumbnail: '🔢', level: 'beginner' },
    { id: 2, title: 'Addition Basics', subject: 'Math', topic: 'Addition', duration: '7:10', thumbnail: '➕', level: 'beginner' },
    { id: 3, title: 'How Plants Grow', subject: 'Science', topic: 'Plants', duration: '6:40', thumbnail: '🌱', level: 'beginner' },
    { id: 4, title: 'ABC Song', subject: 'English', topic: 'Alphabet', duration: '3:30', thumbnail: '🔤', level: 'beginner' },
  ]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newVideo: VideoContent = {
      id: videoLibrary.length + 1,
      title: uploadForm.title,
      subject: uploadForm.subject.charAt(0).toUpperCase() + uploadForm.subject.slice(1),
      topic: uploadForm.topic,
      duration: uploadForm.duration,
      thumbnail: uploadForm.subject === 'math' ? '🧮' : uploadForm.subject === 'science' ? '🔬' : '📖',
      level: uploadForm.level,
    };
    setVideoLibrary([...videoLibrary, newVideo]);
    setShowUploadModal(false);
    setUploadForm({
      title: '',
      subject: 'math',
      topic: '',
      duration: '',
      level: 'beginner',
      description: '',
    });
  };

  const deleteVideo = (id: number) => {
    if (confirm('Are you sure you want to delete this video?')) {
      setVideoLibrary(videoLibrary.filter(v => v.id !== id));
    }
  };

  const stats = {
    totalVideos: videoLibrary.length,
    totalLessons: 15,
    totalUsers: 127,
    activeToday: 45,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 shadow-xl">
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
                ⚙️ Admin Panel
              </h1>
              <p className="text-xl opacity-90">Manage content and monitor the learning platform</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Upload Content
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <Video className="w-10 h-10 text-blue-600 mb-3" />
            <p className="text-3xl font-black text-gray-800 mb-1">{stats.totalVideos}</p>
            <p className="text-gray-600 font-bold">Total Videos</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <BookOpen className="w-10 h-10 text-green-600 mb-3" />
            <p className="text-3xl font-black text-gray-800 mb-1">{stats.totalLessons}</p>
            <p className="text-gray-600 font-bold">Active Lessons</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <Users className="w-10 h-10 text-purple-600 mb-3" />
            <p className="text-3xl font-black text-gray-800 mb-1">{stats.totalUsers}</p>
            <p className="text-gray-600 font-bold">Total Users</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <Settings className="w-10 h-10 text-orange-600 mb-3" />
            <p className="text-3xl font-black text-gray-800 mb-1">{stats.activeToday}</p>
            <p className="text-gray-600 font-bold">Active Today</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 flex gap-2">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'videos' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Video className="w-5 h-5" />
            Videos
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'lessons' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Lessons
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'users' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'settings' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'videos' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-black text-gray-800 mb-6">Video Library Management</h3>
            <div className="space-y-4">
              {videoLibrary.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
                >
                  <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl w-16 h-16 flex items-center justify-center text-3xl flex-shrink-0">
                    {video.thumbnail}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-lg">{video.title}</h4>
                    <div className="flex gap-3 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">
                        {video.subject}
                      </span>
                      <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-bold">
                        {video.topic}
                      </span>
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                        {video.duration}
                      </span>
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full capitalize">
                        {video.level}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-all">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-black text-gray-800 mb-4">Lesson Management</h3>
            <p className="text-gray-600 mb-6">Manage and organize lessons across all subjects.</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 text-center">
                <div className="text-5xl mb-3">📘</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">Mathematics</h4>
                <p className="text-gray-600 mb-4">5 Topics</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-600 transition-all">
                  Manage
                </button>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 text-center">
                <div className="text-5xl mb-3">🔬</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">Science</h4>
                <p className="text-gray-600 mb-4">5 Topics</p>
                <button className="bg-green-500 text-white px-4 py-2 rounded-full font-bold hover:bg-green-600 transition-all">
                  Manage
                </button>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6 text-center">
                <div className="text-5xl mb-3">📖</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">English</h4>
                <p className="text-gray-600 mb-4">5 Topics</p>
                <button className="bg-purple-500 text-white px-4 py-2 rounded-full font-bold hover:bg-purple-600 transition-all">
                  Manage
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-black text-gray-800 mb-4">User Management</h3>
            <p className="text-gray-600 mb-6">View and manage registered users.</p>
            <div className="space-y-3">
              {[
                { name: 'Emily Johnson', progress: 85, lessons: 12, stars: 36 },
                { name: 'Michael Chen', progress: 72, lessons: 10, stars: 28 },
                { name: 'Sarah Williams', progress: 93, lessons: 14, stars: 42 },
                { name: 'David Brown', progress: 61, lessons: 8, stars: 22 },
              ].map((user, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{user.name}</h4>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>{user.progress}% Complete</span>
                      <span>{user.lessons} Lessons</span>
                      <span>{user.stars} Stars</span>
                    </div>
                  </div>
                  <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full font-bold text-sm transition-all">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-black text-gray-800 mb-6">Platform Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Platform Name</label>
                <input
                  type="text"
                  value="KidsLearn+"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Support Email</label>
                <input
                  type="email"
                  value="support@kidslearn.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Max Video Size (MB)</label>
                <input
                  type="number"
                  value="100"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full"
          >
            <h2 className="text-3xl font-black text-gray-800 mb-6">Upload New Video</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Video Title</label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                  placeholder="Enter video title"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Subject</label>
                  <select
                    value={uploadForm.subject}
                    onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                  >
                    <option value="math">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="english">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">Topic</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.topic}
                    onChange={(e) => setUploadForm({ ...uploadForm, topic: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                    placeholder="e.g., Addition"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Duration</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.duration}
                    onChange={(e) => setUploadForm({ ...uploadForm, duration: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                    placeholder="e.g., 5:30"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">Level</label>
                  <select
                    value={uploadForm.level}
                    onChange={(e) => setUploadForm({ ...uploadForm, level: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Description</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                  rows={3}
                  placeholder="Enter video description"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Upload Video File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition-all cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-bold">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">MP4, AVI, MOV (max. 100MB)</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-full font-bold hover:shadow-lg transition-all"
                >
                  Upload Video
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-full font-bold hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
