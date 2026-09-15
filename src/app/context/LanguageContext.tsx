import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ta' | 'hi';

interface Translations {
  appName: string;
  tagline: string;
  login: string;
  signUp: string;
  username: string;
  password: string;
  name: string;
  welcomeBack: string;
  joinFun: string;
  selectLanguage: string;
  dashboard: string;
  mathematics: string;
  science: string;
  english: string;
  startLearning: string;
  backToDashboard: string;
  lessons: string;
  topics: string;
  progress: string;
  starsEarned: string;
  lessonsCompleted: string;
  quizTime: string;
  nextLesson: string;
  previousLesson: string;
  excellent: string;
  correct: string;
  wrong: string;
  quizComplete: string;
  reviewLesson: string;
  moreTopics: string;
  aiTeacher: string;
  challenges: string;
  parentDashboard: string;
  admin: string;
  logout: string;
  watchVideo: string;
  takeQuiz: string;
  chooseLanguage: string;
  loading: string;
  streak: string;
  days: string;
  cancel: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appName: 'KidsLearn+',
    tagline: "Let's Learn & Have Fun!",
    login: 'Login',
    signUp: 'Sign Up',
    username: 'Username',
    password: 'Password',
    name: 'Name',
    welcomeBack: 'Welcome Back!',
    joinFun: 'Join the Fun!',
    selectLanguage: 'Select Language',
    dashboard: 'Learning Dashboard',
    mathematics: 'Mathematics',
    science: 'Science',
    english: 'English Grammar',
    startLearning: 'Start Learning!',
    backToDashboard: 'Back to Dashboard',
    lessons: 'Lessons',
    topics: 'Topics',
    progress: 'Progress',
    starsEarned: 'Stars Earned',
    lessonsCompleted: 'Lessons Completed',
    quizTime: 'Quiz Time!',
    nextLesson: 'Next',
    previousLesson: 'Previous',
    excellent: 'Excellent!',
    correct: 'Correct! Great job!',
    wrong: 'Oops! Try again!',
    quizComplete: 'Quiz Complete!',
    reviewLesson: 'Review Lesson',
    moreTopics: 'More Topics',
    aiTeacher: 'AI Teacher',
    challenges: 'Challenges',
    parentDashboard: 'Parent Dashboard',
    admin: 'Admin',
    logout: 'Logout',
    watchVideo: 'Watch Video',
    takeQuiz: 'Take Quiz',
    chooseLanguage: 'Choose your language',
    loading: 'Loading...',
    streak: 'Day Streak',
    days: 'Days',
    cancel: 'Cancel',
  },
  ta: {
    appName: 'கிட்ஸ் லேர்ன்+',
    tagline: 'கற்போம் மகிழ்வோம்!',
    login: 'உள்நுழைவு',
    signUp: 'பதிவு செய்',
    username: 'பயனர்பெயர்',
    password: 'கடவுச்சொல்',
    name: 'பெயர்',
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்!',
    joinFun: 'சேருங்கள்!',
    selectLanguage: 'மொழி தேர்வு',
    dashboard: 'கற்றல் டாஷ்போர்டு',
    mathematics: 'கணிதம்',
    science: 'அறிவியல்',
    english: 'ஆங்கில இலக்கணம்',
    startLearning: 'கற்கத் தொடங்கு!',
    backToDashboard: 'டாஷ்போர்டுக்கு திரும்பு',
    lessons: 'பாடங்கள்',
    topics: 'தலைப்புகள்',
    progress: 'முன்னேற்றம்',
    starsEarned: 'நட்சத்திரங்கள்',
    lessonsCompleted: 'முடிந்த பாடங்கள்',
    quizTime: 'வினாடி வினா!',
    nextLesson: 'அடுத்து',
    previousLesson: 'முந்தைய',
    excellent: 'சிறப்பு!',
    correct: 'சரியான விடை!',
    wrong: 'மீண்டும் முயற்சி!',
    quizComplete: 'வினாடி வினா முடிந்தது!',
    reviewLesson: 'பாடம் மீளாய்வு',
    moreTopics: 'மேலும் தலைப்புகள்',
    aiTeacher: 'AI ஆசிரியர்',
    challenges: 'சவால்கள்',
    parentDashboard: 'பெற்றோர் டாஷ்போர்டு',
    admin: 'நிர்வாகம்',
    logout: 'வெளியேறு',
    watchVideo: 'வீடியோ பார்',
    takeQuiz: 'வினாடி வினா',
    chooseLanguage: 'மொழியை தேர்ந்தெடுங்கள்',
    loading: 'ஏற்றுகிறது...',
    streak: 'நாள் தொடர்',
    days: 'நாட்கள்',
    cancel: 'ரத்து செய்',
  },
  hi: {
    appName: 'किड्स लर्न+',
    tagline: 'सीखें और मज़े करें!',
    login: 'लॉग इन',
    signUp: 'साइन अप',
    username: 'उपयोगकर्ता नाम',
    password: 'पासवर्ड',
    name: 'नाम',
    welcomeBack: 'वापस स्वागत है!',
    joinFun: 'मज़े में शामिल हों!',
    selectLanguage: 'भाषा चुनें',
    dashboard: 'सीखने का डैशबोर्ड',
    mathematics: 'गणित',
    science: 'विज्ञान',
    english: 'अंग्रेज़ी व्याकरण',
    startLearning: 'सीखना शुरू करें!',
    backToDashboard: 'डैशबोर्ड पर वापस',
    lessons: 'पाठ',
    topics: 'विषय',
    progress: 'प्रगति',
    starsEarned: 'अर्जित सितारे',
    lessonsCompleted: 'पाठ पूर्ण',
    quizTime: 'क्विज़ का समय!',
    nextLesson: 'अगला',
    previousLesson: 'पिछला',
    excellent: 'शानदार!',
    correct: 'सही! शाबाश!',
    wrong: 'ओह! फिर कोशिश करो!',
    quizComplete: 'क्विज़ पूरी!',
    reviewLesson: 'पाठ समीक्षा',
    moreTopics: 'और विषय',
    aiTeacher: 'AI शिक्षक',
    challenges: 'चुनौतियाँ',
    parentDashboard: 'अभिभावक डैशबोर्ड',
    admin: 'एडमिन',
    logout: 'लॉग आउट',
    watchVideo: 'वीडियो देखें',
    takeQuiz: 'क्विज़ लें',
    chooseLanguage: 'अपनी भाषा चुनें',
    loading: 'लोड हो रहा है...',
    streak: 'दिन की लकीर',
    days: 'दिन',
    cancel: 'रद्द करें',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('app_language') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('app_language', lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
