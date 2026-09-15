import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Mic, MicOff, Sparkles, BookOpen, Calculator, FlaskConical, Settings, X, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  error?: boolean;
}

const STORAGE_KEY_MESSAGES = 'ai_teacher_chat_history';
const STORAGE_KEY_API_KEY = 'gemini_api_key';

const SYSTEM_PROMPT = `You are Teacher Sparkle, a friendly, enthusiastic, and encouraging AI teacher for children aged 5-10.

Rules:
- Always be warm, positive, and encouraging
- Use simple language that young children can understand
- Include relevant emojis to make responses fun and engaging
- Give clear, short explanations (2-4 sentences max)
- Use analogies to familiar things (food, animals, toys)
- If a child seems confused, offer a different explanation
- Celebrate their curiosity! ("Great question!", "Wow, you're so smart to ask!")
- For math, always give a real-world example
- For science, connect to things they can see/touch at home
- For English, use memorable examples with familiar words
- Never use complex vocabulary without explaining it
- Always end with an encouraging statement or follow-up question`;

const quickQuestions = [
  { text: "What is 2 + 2?", emoji: '➕' },
  { text: "How do plants grow?", emoji: '🌱' },
  { text: "What is a noun?", emoji: '📖' },
  { text: "Why is the sky blue?", emoji: '🌤️' },
  { text: "How do I spell 'elephant'?", emoji: '🐘' },
  { text: "What is 10 × 5?", emoji: '✖️' },
];

async function callGeminiAPI(userMessage: string, history: Message[], apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const historyForAPI = history
    .filter(m => !m.error)
    .slice(-10)
    .map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [
      ...historyForAPI,
      { role: 'user', parts: [{ text: userMessage }] },
    ],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 512,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg = errData?.error?.message || `API error ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response from Gemini API');
  return text;
}

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

function saveMessages(messages: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages.slice(-100)));
  } catch {}
}

const WELCOME_MESSAGE: Message = {
  id: 1,
  text: "Hi there! 👋 I'm Teacher Sparkle, your friendly AI teacher! I'm powered by Google's Gemini AI, so I can answer almost any question! Ask me about Math, Science, English — or anything you're curious about! 🌟",
  sender: 'ai',
  timestamp: new Date(),
};

export function AITeacher() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY_API_KEY) || '');
  const [showSetup, setShowSetup] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [keyError, setKeyError] = useState('');
  const [keyValid, setKeyValid] = useState(!!localStorage.getItem(STORAGE_KEY_API_KEY));
  const [testingKey, setTestingKey] = useState(false);

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = loadMessages();
    return saved.length > 0 ? saved : [WELCOME_MESSAGE];
  });
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (event: any) => {
        setInputText(event.results[0][0].transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[🎯🔢✨🌱💧☀️📦🐱👨‍🏫🏫🌤️🎉🍪🍎🌟💡🌈🤔📚🎈💪🧪🔬⭐🏆🚀🌍📖✅❌🎂🌹🏃💬🍽️👁️👂👃👅✋🔊🗣️🔡📏💨🐘🌊🔵🐟🌿🍞🧠🏠🎁🔄🚗🏆🔮📅🐸🦋🦁🐊🐟🦅👤🏫📱💊🌾🌡️⚽🎲🥫🍦🔺⬛🔷⭕⬠⬡🐄🐦🐰🦊🪱🐘🐻❄️🦎🦉📸📞✈️✍️🌴🏜️🍂🧊🫒🏔️🐪🐻🦒🏞️💀💪🫀🫁🍽️🧬🏫🌳🌸🔴🟠🟡🟢🗺️🌋🌅🌓⏳🍳🥚🍞🐌🦘🌰🍃🌷🌻🌾🌻🔬🧪⚗️🌿🌍🦋🌡️🦷🔧🤝📦🐛🪙💷💵💰🥄☕🍶🛁🪁👑🦍🎁♻️🌊🌻🐘🐚🔍⏮️▶️⏭️❓⏰🔮📅💭⏳⬆️⬆️🔗🔠🔡🔤🅰️🅱️©️🔈📝💬❗🏫🐕🐕‍🦺😊😄⚖️⬆️🔡🌍🚶👥⬅️📋⭐💡📐👋🌟🤔✨🎯💛🚫👩‍🏫📊📋🏆]/gu, '').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  const addMessage = useCallback((msg: Message) => {
    setMessages(prev => {
      const next = [...prev, msg];
      saveMessages(next);
      return next;
    });
  }, []);

  const handleSendMessage = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: Date.now(), text, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      let responseText: string;

      if (apiKey) {
        responseText = await callGeminiAPI(text, messages, apiKey);
      } else {
        await new Promise(r => setTimeout(r, 1200));
        responseText = getFallbackResponse(text);
      }

      const aiMsg: Message = { id: Date.now() + 1, text: responseText, sender: 'ai', timestamp: new Date() };
      setMessages(prev => {
        const next = [...prev, aiMsg];
        saveMessages(next);
        return next;
      });
      speak(responseText);
    } catch (err: any) {
      const errMsg: Message = {
        id: Date.now() + 1,
        text: `⚠️ Oops! I couldn't connect right now. ${err?.message?.includes('API') ? 'Please check your API key in Settings. ' : ''}Please try again! 😊`,
        sender: 'ai',
        timestamp: new Date(),
        error: true,
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [inputText, isTyping, messages, apiKey, speak]);

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSaveApiKey = async () => {
    const trimmed = keyInput.trim();
    if (!trimmed) { setKeyError('Please enter your Gemini API key.'); return; }
    if (!trimmed.startsWith('AI')) { setKeyError('Gemini API keys usually start with "AI". Double-check your key.'); return; }

    setTestingKey(true);
    setKeyError('');
    try {
      await callGeminiAPI('Say hello briefly', [], trimmed);
      localStorage.setItem(STORAGE_KEY_API_KEY, trimmed);
      setApiKey(trimmed);
      setKeyValid(true);
      setShowSetup(false);
      setKeyInput('');
      const confirmMsg: Message = {
        id: Date.now(),
        text: "✅ API key saved! I'm now powered by Google Gemini AI. Ask me anything — I can answer much better now! 🚀",
        sender: 'ai',
        timestamp: new Date(),
      };
      addMessage(confirmMsg);
    } catch (err: any) {
      setKeyError(`Key test failed: ${err?.message || 'Invalid key'}. Make sure it is a valid Gemini API key.`);
    } finally {
      setTestingKey(false);
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem(STORAGE_KEY_API_KEY);
    setApiKey('');
    setKeyValid(false);
    setKeyInput('');
    setKeyError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white p-6 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold">Back</span>
            </button>
            <button
              onClick={() => { setShowSetup(true); setKeyInput(apiKey); }}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all"
            >
              <Settings className="w-5 h-5" />
              <span className="font-bold text-sm">
                {keyValid ? '✅ AI Connected' : '⚠️ Setup AI'}
              </span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-full p-4">
              <Sparkles className="w-12 h-12 text-purple-600" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-1" style={{ fontFamily: 'var(--font-playful)' }}>
                🤖 AI Teacher
              </h1>
              <p className="text-lg opacity-90">
                {keyValid ? 'Powered by Google Gemini AI ✨' : 'Ask me anything! I\'m here to help you learn!'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Quick Questions */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Quick Questions:</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInputText(q.text)}
                className="bg-white hover:bg-purple-50 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all whitespace-nowrap flex items-center gap-2 border-2 border-purple-200"
              >
                <span>{q.emoji}</span>
                <span className="text-sm font-bold text-gray-700">{q.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* No API key banner */}
        {!keyValid && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-700">Connect to Gemini AI for smarter answers!</p>
              <p className="text-sm text-amber-600 mt-1">
                I can answer questions right now, but my answers will be much better with a free Gemini API key.
                {' '}
                <button onClick={() => setShowSetup(true)} className="underline font-bold hover:text-amber-800">
                  Set up Gemini AI →
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* Chat Messages */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6" style={{ height: '500px', overflowY: 'auto' }}>
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : message.error
                          ? 'bg-red-50 border-2 border-red-200 text-gray-800'
                          : 'bg-gradient-to-r from-pink-100 to-purple-100 text-gray-800'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`rounded-full p-1 ${message.error ? 'bg-red-400' : 'bg-purple-500'}`}>
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className={`font-bold ${message.error ? 'text-red-600' : 'text-purple-600'}`}>
                          Teacher Sparkle
                        </span>
                      </div>
                    )}
                    <p className="text-lg leading-relaxed whitespace-pre-line">{message.text}</p>
                    <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 150, 300].map(delay => (
                        <div key={delay} className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">{keyValid ? 'Gemini is thinking...' : 'Teacher is thinking...'}</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-3xl shadow-xl p-4">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Type your question here... 🤔"
              className="flex-1 px-6 py-4 border-2 border-purple-200 rounded-full text-lg focus:outline-none focus:border-purple-500 transition-all"
              disabled={isTyping}
            />
            <button
              onClick={handleVoiceInput}
              className={`p-4 rounded-full transition-all transform hover:scale-110 ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
              title={recognitionRef.current ? 'Voice input' : 'Voice input not supported in this browser'}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-full hover:shadow-lg transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-3 flex justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calculator className="w-4 h-4" />
              <span>Math</span>
            </div>
            <div className="flex items-center gap-1">
              <FlaskConical className="w-4 h-4" />
              <span>Science</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>English</span>
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
            <Mic className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-bold text-gray-800">Voice Input</h4>
            <p className="text-sm text-gray-600">Ask questions by speaking!</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
            <Sparkles className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <h4 className="font-bold text-gray-800">Gemini AI</h4>
            <p className="text-sm text-gray-600">Powered by Google AI!</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
            <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-bold text-gray-800">Chat History</h4>
            <p className="text-sm text-gray-600">Conversations are saved!</p>
          </div>
        </div>
      </div>

      {/* Setup Modal */}
      <AnimatePresence>
        {showSetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-purple-700" style={{ fontFamily: 'var(--font-playful)' }}>
                  🔑 Connect Gemini AI
                </h2>
                <button onClick={() => { setShowSetup(false); setKeyError(''); }} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {keyValid && (
                <div className="flex items-center gap-2 mb-4 bg-green-50 border border-green-200 rounded-xl p-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700 font-semibold text-sm">Gemini AI is connected and working!</span>
                </div>
              )}

              <div className="bg-blue-50 rounded-xl p-4 mb-5 text-sm text-blue-700">
                <p className="font-bold mb-1">📌 How to get a free Gemini API key:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Go to <strong>aistudio.google.com</strong></li>
                  <li>Sign in with your Google account</li>
                  <li>Click "Get API Key" → "Create API key"</li>
                  <li>Copy and paste it below</li>
                </ol>
                <p className="mt-2 text-xs text-blue-600">
                  🔒 Your key is saved only in your browser — it is never sent anywhere except directly to Google's API.
                </p>
              </div>

              <label className="block text-sm font-bold text-gray-700 mb-2">Your Gemini API Key</label>
              <div className="relative mb-3">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={keyInput}
                  onChange={(e) => { setKeyInput(e.target.value); setKeyError(''); }}
                  placeholder="AIzaSy..."
                  className="w-full px-4 py-3 pr-12 border-2 border-purple-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 font-mono"
                />
                <button
                  onClick={() => setShowKey(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {keyError && (
                <div className="flex items-start gap-2 mb-3 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-sm">{keyError}</p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSaveApiKey}
                  disabled={testingKey || !keyInput.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {testingKey ? 'Testing key...' : 'Save & Connect'}
                </button>
                {keyValid && (
                  <button
                    onClick={handleRemoveKey}
                    className="px-4 py-3 rounded-xl border-2 border-red-200 text-red-500 font-bold hover:bg-red-50 transition-all text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                Without an API key, I will still answer questions, just with simpler built-in responses.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getFallbackResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.match(/\d+\s*[\+\-\×\*x]\s*\d+/) || q.includes('plus') || q.includes('add')) {
    try {
      const expr = q.match(/(\d+)\s*[\+]\s*(\d+)/);
      if (expr) {
        const ans = parseInt(expr[1]) + parseInt(expr[2]);
        return `Great maths question! 🔢 ${expr[1]} + ${expr[2]} = ${ans}! Think of it like having ${expr[1]} 🍎 apples and getting ${expr[2]} more — you would have ${ans} apples total! You are brilliant! 🌟`;
      }
    } catch {}
    return "Great maths question! 🔢 Let me help you work through it step by step. Try writing the numbers down and counting up from the bigger number! You can do it! 💪";
  }
  if (q.includes('plant') || q.includes('grow')) {
    return "Plants are amazing! 🌱 They grow from tiny seeds using three magical things: sunlight ☀️ (for energy), water 💧 (to stay alive), and air 🌬️ (for making food). The roots drink water, the leaves catch sunlight, and slowly the plant grows bigger and bigger! 🌳";
  }
  if (q.includes('noun')) {
    return "A noun is a naming word! 🏷️ It names a person (teacher 👩‍🏫), a place (school 🏫), or a thing (book 📚). In the sentence 'The cat sat on the mat' — cat and mat are both nouns! Can you spot the nouns around you right now? 🌟";
  }
  if (q.includes('sky') && q.includes('blue')) {
    return "The sky is blue because of something magical called light scattering! ✨ Sunlight is made of all the rainbow colours mixed together 🌈. When sunlight hits the tiny air molecules in our sky, the blue light bounces around much more than other colours — so we see blue everywhere above us! 🌤️";
  }
  if (q.includes('spell')) {
    const wordMatch = question.match(/spell\s+['"]?(\w+)/i);
    if (wordMatch) {
      const word = wordMatch[1].toLowerCase();
      const letters = word.toUpperCase().split('').join('-');
      return `Great question! 📝 '${word}' is spelled: ${letters}! Say each letter out loud as you write it: ${letters}. Practice writing it three times and you will remember it forever! ✨🌟`;
    }
    return "I love spelling questions! 📝 Sound out the word slowly and write what you hear. Then check in a dictionary! Reading lots of books is the best way to get better at spelling! 📚";
  }
  const responses = [
    "That is such a fantastic question! 🌟 I would give you an even better answer if I was connected to Gemini AI — ask a parent to help set it up in Settings! For now: curiosity is the first step to learning, and you are showing lots of it! Keep asking questions! 💪",
    "Wow, I love how curious you are! 🔍 This is exactly the kind of thinking that makes great scientists, writers, and mathematicians! Try looking at the lessons in the app — you might find the answer there! And remember, your teacher is also a great resource! 🏫",
    "Great thinking! 🧠 The best way to find out is to explore and investigate! Science, maths, and language are all around us every day. Keep your eyes open and keep asking questions — that is what learning is all about! 🌈",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
