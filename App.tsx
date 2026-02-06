
import React, { useState, useEffect, useMemo } from 'react';
import { WordItem, GameState } from './types';
import { generateMockWords } from './mockData';
import WordCard from './components/WordCard';
import StudyView from './components/StudyView';
import { Trophy, BookOpen, Star, Heart, Flame, Clock, Target, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f8fbfe] pb-6 sm:pb-20 flex flex-col items-center overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 z-40 bg-gray-100 h-2 sm:h-4 shadow-sm overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 via-green-400 to-green-500 transition-all duration-1000 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/20 animate-pulse" />
        </div>
      </div>

      <nav className="w-[92%] max-w-4xl bg-white/90 backdrop-blur-md shadow-sm px-4 py-2 sm:py-3 flex justify-between items-center mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl sticky top-4 sm:top-8 z-30 border-b-2 border-gray-100 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-1.5 rounded-lg text-white shadow-md">
            <BookOpen size={16} className="sm:w-[20px]" />
          </div>
          <h1 className="text-sm sm:text-xl font-fredoka font-bold text-blue-600 tracking-tight">CamSpell</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden xs:flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-xl border border-blue-100">
             <Target size={12} className="text-blue-500 sm:w-[14px]" />
             <span className="font-bold text-blue-700 font-fredoka text-[10px] sm:text-sm">
               {gameState.wordsCompletedToday}/{gameState.dailyGoal}
             </span>
          </div>

          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
            <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5">
              <Flame size={14} className="text-orange-500 fill-orange-500 sm:w-[16px]" />
              <span className="font-bold text-orange-700 text-xs sm:text-sm">{gameState.streak}</span>
            </div>
            <div className="w-px h-3 bg-gray-200" />
            <div className="flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5">
              {[...Array(5)].map((_, i) => (
                <Heart 
                  key={i} 
                  className={`${i < gameState.hearts ? "text-red-500 fill-red-500" : "text-gray-200"} transition-all sm:w-[14px]`} 
                  size={12} 
                />
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-4xl px-4 mt-4 sm:mt-8">
        {showSetComplete ? (
          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl p-6 sm:p-12 text-center max-w-md mx-auto border-4 border-green-50 animate-scale-up">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={32} className="text-green-500 fill-green-500 sm:w-[40px]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-fredoka font-bold text-gray-800 mb-2">Set Complete!</h2>
            <p className="text-sm sm:text-base text-gray-400 mb-6 leading-relaxed">You mastered 5 words. You're getting so smart!</p>
            <button 
              onClick={nextSet}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl sm:rounded-2xl shadow-lg transition-all transform active:scale-95 text-lg sm:text-xl font-fredoka border-b-6 border-green-800 flex items-center justify-center gap-2"
            >
              Continue <ArrowRight size={20} />
            </button>
          </div>
        ) : isGameOver ? (
          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl p-6 sm:p-12 text-center max-w-md mx-auto border-4 border-red-50 animate-scale-up">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-red-500 sm:w-[40px]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-fredoka font-bold text-gray-800 mb-4">Out of Hearts!</h2>
            <p className="text-sm sm:text-base text-gray-400 mb-8 leading-relaxed">Don't worry! Everyone makes mistakes. Let's try again.</p>
            <button 
              onClick={resetGame}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 text-lg font-fredoka border-b-6 border-blue-800"
            >
              Try Again
            </button>
          </div>
        ) : !gameState.isFinished ? (
          <div className="space-y-3 sm:space-y-6">
            <div className="flex justify-between items-center text-gray-400 font-bold px-1">
              <span className={`uppercase tracking-widest text-[9px] sm:text-xs flex items-center gap-1.5 ${isReviewWord ? 'text-orange-500' : 'text-blue-500'}`}>
                {isReviewWord ? <Clock size={10} className="animate-spin-slow" /> : <Star size={10} className="animate-pulse" />}
                {isReviewWord ? 'Review' : 'Study'}
              </span>
              <span className="text-[9px] sm:text-xs font-fredoka bg-white px-2.5 py-1 rounded-full border border-gray-100">
                Word <span className="text-blue-500 font-bold">{gameState.wordsCompletedToday + 1}</span>
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
          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl p-8 sm:p-12 text-center max-w-md mx-auto border-4 border-white animate-scale-up relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-50 rounded-full opacity-50 blur-3xl" />
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border-2 border-white">
              <Trophy className="text-white" size={40} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-fredoka font-bold text-gray-800 mb-4">You're a Hero! 🌟</h2>
            <p className="text-sm sm:text-base text-gray-400 mb-8 leading-relaxed">
              You reached your goal of {gameState.dailyGoal} words!
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-blue-50 rounded-2xl p-4 border-b-4 border-blue-100">
                <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Score</p>
                <p className="text-2xl font-fredoka font-bold text-blue-600">{gameState.score}</p>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border-b-4 border-orange-100">
                <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Streak</p>
                <p className="text-2xl font-fredoka font-bold text-orange-600">{gameState.streak}d</p>
              </div>
            </div>

            <button 
              onClick={resetGame}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 text-lg font-fredoka border-b-6 border-blue-800"
            >
              Finish Today
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
          from { opacity: 0; transform: translateY(20px); }
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
