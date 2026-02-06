
import React, { useState, useEffect, useMemo } from 'react';
import { WordItem, GameState } from './types';
import { generateMockWords } from './mockData';
import WordCard from './components/WordCard';
import StudyView from './components/StudyView';
import { Trophy, BookOpen, Star, RefreshCw, GraduationCap, Heart, Flame, Clock, Target, ArrowRight } from 'lucide-react';
import { playCorrectSound, playErrorSound } from './services/soundService';
import { ReviewManager } from './services/reviewManager';

const App: React.FC = () => {
  const [allWords, setAllWords] = useState<WordItem[]>([]);
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [mode, setMode] = useState<'study' | 'quiz'>('study');
  const [showSetComplete, setShowSetComplete] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    currentWordIndex: 0,
    score: 0,
    isFinished: false,
    hearts: 5,
    streak: 3,
    wordsCompletedToday: 0,
    dailyGoal: 15,
  });

  useEffect(() => {
    const data = generateMockWords(); 
    setAllWords(data);
    if (data.length > 0) {
      setActiveWordId(data[0].id);
    }
  }, []);

  const currentWord = useMemo(() => 
    allWords.find(w => w.id === activeWordId) || null
  , [allWords, activeWordId]);

  const selectNextWord = (updatedLibrary: WordItem[]) => {
    const totalCompleted = updatedLibrary.filter(w => w.masteryLevel > 0).length;
    
    // Check for Set Completion (Every 5 words)
    if (totalCompleted > 0 && totalCompleted % 5 === 0 && totalCompleted < gameState.dailyGoal) {
      setShowSetComplete(true);
      setGameState(prev => ({ ...prev, wordsCompletedToday: totalCompleted }));
      return;
    }

    if (totalCompleted >= gameState.dailyGoal) {
      setGameState(prev => ({ ...prev, isFinished: true, wordsCompletedToday: totalCompleted }));
      return;
    }

    const next = ReviewManager.pickNextWord(updatedLibrary);
    if (next) {
      setActiveWordId(next.id);
      setMode('study');
      setGameState(prev => ({ ...prev, wordsCompletedToday: totalCompleted }));
    } else {
      setGameState(prev => ({ ...prev, isFinished: true, wordsCompletedToday: totalCompleted }));
    }
  };

  const handleQuizSuccess = () => {
    if (!currentWord) return;
    playCorrectSound();
    
    const updatedWord = ReviewManager.processReview(currentWord, true);
    const newLibrary = allWords.map(w => w.id === updatedWord.id ? updatedWord : w);
    
    setAllWords(newLibrary);
    setGameState(prev => ({
      ...prev,
      score: prev.score + 10,
    }));

    selectNextWord(newLibrary);
  };

  const handleQuizError = () => {
    if (!currentWord) return;
    playErrorSound();
    
    const updatedWord = ReviewManager.processReview(currentWord, false);
    const newLibrary = allWords.map(w => w.id === updatedWord.id ? updatedWord : w);
    
    setAllWords(newLibrary);
    setGameState(prev => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
    }));
  };

  const nextSet = () => {
    setShowSetComplete(false);
    const next = ReviewManager.pickNextWord(allWords);
    if (next) {
      setActiveWordId(next.id);
      setMode('study');
    }
  };

  const resetGame = () => {
    const freshData = generateMockWords();
    setAllWords(freshData);
    setActiveWordId(freshData[0].id);
    setShowSetComplete(false);
    setGameState({
      currentWordIndex: 0,
      score: 0,
      isFinished: false,
      hearts: 5,
      streak: 3,
      wordsCompletedToday: 0,
      dailyGoal: 15,
    });
    setMode('study');
  };

  if (allWords.length === 0 || !currentWord) return null;

  const progress = (gameState.wordsCompletedToday / gameState.dailyGoal) * 100;
  const isGameOver = gameState.hearts <= 0;
  const isReviewWord = currentWord.masteryLevel > 0;

  return (
    <div className="min-h-screen bg-[#f8fbfe] pb-20">
      {/* Daily Goal Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-gray-100 h-5 shadow-sm overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 via-green-400 to-green-500 transition-all duration-1000 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/20 animate-pulse" />
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm px-6 py-4 flex flex-wrap justify-between items-center mt-6 mx-4 rounded-3xl sticky top-8 z-20 border-b-4 border-gray-100 gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100">
            <BookOpen size={24} />
          </div>
          <h1 className="text-2xl font-fredoka font-bold text-blue-600 tracking-wide hidden xs:block">CamSpell</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 shadow-inner">
             <Target size={18} className="text-blue-500" />
             <div className="flex flex-col leading-none">
               <span className="text-[10px] uppercase font-bold text-blue-400 text-center">Daily Goal</span>
               <span className="font-bold text-blue-700 font-fredoka text-lg">
                 {gameState.wordsCompletedToday} / {gameState.dailyGoal}
               </span>
             </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl">
            <div className="flex items-center gap-1 px-3 py-1">
              <Flame className="text-orange-500 fill-orange-500 animate-pulse" size={20} />
              <span className="font-bold text-orange-700">{gameState.streak}</span>
            </div>
            <div className="w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-1 px-3 py-1">
              {[...Array(5)].map((_, i) => (
                <Heart 
                  key={i} 
                  className={`${i < gameState.hearts ? "text-red-500 fill-red-500" : "text-gray-300"} transition-all`} 
                  size={18} 
                />
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        {showSetComplete ? (
          <div className="bg-white rounded-[3rem] shadow-2xl p-12 text-center max-w-lg mx-auto border-8 border-green-50 animate-scale-up">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="text-green-500 fill-green-500" size={48} />
            </div>
            <h2 className="text-4xl font-fredoka font-bold text-gray-800 mb-2">Set Complete!</h2>
            <p className="text-lg text-gray-500 mb-10 leading-relaxed">You mastered 5 words. You're getting so smart! Ready for the next set?</p>
            <button 
              onClick={nextSet}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-6 rounded-3xl shadow-xl transition-all transform active:scale-95 text-2xl font-fredoka border-b-8 border-green-800 flex items-center justify-center gap-3"
            >
              Next 5 Words <ArrowRight size={28} />
            </button>
          </div>
        ) : isGameOver ? (
          <div className="bg-white rounded-[3rem] shadow-2xl p-12 text-center max-w-lg mx-auto border-8 border-red-50 animate-scale-up">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="text-red-500" size={48} />
            </div>
            <h2 className="text-4xl font-fredoka font-bold text-gray-800 mb-4">Out of Hearts!</h2>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed">Don't worry! Everyone makes mistakes. Take a deep breath and let's try again.</p>
            <button 
              onClick={resetGame}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 rounded-3xl shadow-xl transition-all transform active:scale-95 text-xl font-fredoka border-b-8 border-blue-800"
            >
              Refill Hearts & Retry
            </button>
          </div>
        ) : !gameState.isFinished ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-gray-400 font-bold px-2">
              <span className={`uppercase tracking-widest text-xs flex items-center gap-2 ${isReviewWord ? 'text-orange-500' : 'text-blue-500'}`}>
                {isReviewWord ? <Clock size={14} className="animate-spin-slow" /> : <Star size={14} className="animate-pulse" />}
                {isReviewWord ? 'Review Practice' : 'New Word Discovery'}
              </span>
              <span className="text-sm font-fredoka bg-white px-4 py-1 rounded-full shadow-sm border border-gray-50 flex items-center gap-2">
                <span className="text-blue-500 font-bold">{gameState.wordsCompletedToday}</span> / <span>{gameState.dailyGoal} Completed</span>
              </span>
            </div>

            {mode === 'study' ? (
              <StudyView 
                wordItem={currentWord}
                onNext={() => {}} 
                onPrev={() => {}} 
                onStartQuiz={() => setMode('quiz')}
                hasNext={false}
                hasPrev={false}
              />
            ) : (
              <div className="animate-scale-up">
                <WordCard 
                  wordItem={currentWord} 
                  onSpellingSuccess={handleQuizSuccess}
                  onSpellingError={handleQuizError}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] shadow-2xl p-12 text-center max-w-lg mx-auto border-8 border-white animate-scale-up relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-50 rounded-full opacity-50 blur-3xl" />
            <div className="w-28 h-28 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl border-4 border-white">
              <Trophy className="text-white" size={56} />
            </div>
            <h2 className="text-5xl font-fredoka font-bold text-gray-800 mb-6">You're a Hero! 🌟</h2>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed">
              You completed your daily goal of {gameState.dailyGoal} words! That's amazing!
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-blue-50 rounded-3xl p-6 border-b-4 border-blue-100">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Score</p>
                <p className="text-4xl font-fredoka font-bold text-blue-600">{gameState.score}</p>
              </div>
              <div className="bg-orange-50 rounded-3xl p-6 border-b-4 border-orange-100">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Streak</p>
                <p className="text-4xl font-fredoka font-bold text-orange-600">{gameState.streak}d</p>
              </div>
            </div>

            <button 
              onClick={resetGame}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-6 rounded-3xl shadow-2xl shadow-blue-200 transition-all transform active:scale-95 text-2xl font-fredoka border-b-8 border-blue-800"
            >
              Start Tomorrow's List!
            </button>
          </div>
        )}
      </main>

      <style>{`
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up {
          animation: scale-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default App;
