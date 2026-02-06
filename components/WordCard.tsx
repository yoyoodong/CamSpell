
import React, { useState, useEffect } from 'react';
import { WordItem } from '../types';
import { Volume2, HelpCircle, Sparkles, Keyboard, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { getWordExplanation } from '../services/geminiService';
import SpellingInputRow from './SpellingInputRow';

interface WordCardProps {
  wordItem: WordItem;
  onSpellingSuccess: () => void;
  onSpellingError: () => void;
}

const WordCard: React.FC<WordCardProps> = ({ wordItem, onSpellingSuccess, onSpellingError }) => {
  const [userInput, setUserInput] = useState('');
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showResult, setShowResult] = useState<'none' | 'success' | 'fail'>('none');
  const [showCorrectHint, setShowCorrectHint] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hintRevealed, setHintRevealed] = useState(false);

  // Masking Test: Hide meaning for words that are being reviewed
  const isReviewWord = wordItem.masteryLevel > 0;
  const shouldMask = isReviewWord && !hintRevealed;

  useEffect(() => {
    setHintRevealed(false);
    setUserInput('');
  }, [wordItem.id]);

  const handleCheck = () => {
    if (userInput.toLowerCase().trim() === wordItem.word.toLowerCase()) {
      handleSuccess();
    } else {
      handleError();
    }
  };

  const handleSuccess = () => {
    setShowResult('success');
    setShowCorrectHint(false);
    setTimeout(() => {
      onSpellingSuccess();
      setUserInput('');
      setShowResult('none');
    }, 1500);
  };

  const handleError = () => {
    setShowResult('fail');
    setShowCorrectHint(true);
    onSpellingError();
    setTimeout(() => {
      setShowResult('none');
    }, 1200);
  };

  const askAi = async () => {
    setLoadingAi(true);
    const explanation = await getWordExplanation(wordItem.word);
    setAiExplanation(explanation);
    setLoadingAi(false);
  };

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(wordItem.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-2xl w-full mx-auto transform transition-all border-4 relative overflow-hidden ${
      showResult === 'success' ? 'border-green-200' : showResult === 'fail' ? 'border-red-200' : 'border-blue-50'
    }`}>
      {/* Background feedback flash */}
      {showResult === 'success' && <div className="absolute inset-0 bg-green-400/5 pointer-events-none animate-pulse" />}
      {showResult === 'fail' && <div className="absolute inset-0 bg-red-400/5 pointer-events-none animate-pulse" />}

      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center gap-2 text-blue-400 font-bold bg-blue-50 px-4 py-1 rounded-full shadow-sm border border-blue-100">
          {shouldMask ? <EyeOff size={16} /> : <Eye size={16} />}
          <span className="text-xs uppercase tracking-wider">
            {shouldMask ? 'Masking Test' : 'Visual Spelling'}
          </span>
        </div>
      </div>

      <div className="text-center mb-6 mt-4">
        <div className="relative inline-block mb-4">
          {!imgLoaded && (
            <div className="w-40 h-40 bg-gray-100 rounded-[2rem] flex items-center justify-center animate-pulse">
              <HelpCircle className="text-gray-200" size={48} />
            </div>
          )}
          <img 
            src={wordItem.imageUrl} 
            alt="Word illustration" 
            onLoad={() => setImgLoaded(true)}
            className={`w-40 h-40 object-cover rounded-[2rem] shadow-xl border-4 border-white transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
          />
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 hover:bg-yellow-500 text-white p-3 rounded-2xl shadow-lg z-10 cursor-pointer active:scale-90 transition-transform" onClick={playAudio}>
            <Volume2 size={24} />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-1 min-h-[4rem]">
          {shouldMask ? (
            <button 
              onClick={() => setHintRevealed(true)}
              className="text-blue-500 text-sm font-bold flex items-center gap-1 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
            >
              <Eye size={14} /> Reveal Chinese Hint?
            </button>
          ) : (
            <p className="text-gray-500 text-2xl font-fredoka leading-none">"{wordItem.meaning}"</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <SpellingInputRow 
          word={wordItem.word}
          shapes={wordItem.letterShapes}
          value={userInput}
          onChange={setUserInput}
          onEnter={handleCheck}
          status={showResult}
        />

        <div className="flex gap-4">
          <button 
            onClick={handleCheck}
            disabled={userInput.length < 1 || showResult !== 'none'}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 text-white font-fredoka text-xl font-bold py-5 rounded-[2rem] shadow-xl active:transform active:scale-95 transition-all border-b-8 border-blue-700 disabled:border-gray-300"
          >
            {showResult === 'success' ? 'Perfect! ✨' : 'Check Spelling'}
          </button>
          <button 
            onClick={askAi}
            disabled={loadingAi}
            className="px-6 bg-purple-500 hover:bg-purple-600 text-white rounded-[2rem] shadow-xl flex items-center justify-center disabled:opacity-50 border-b-8 border-purple-700 transition-all active:scale-95"
            title="Ask AI Teacher"
          >
            {loadingAi ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <Sparkles size={28} />}
          </button>
        </div>
      </div>

      {showCorrectHint && (
        <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center gap-2 font-bold animate-fade-in border border-red-100">
          <AlertCircle size={20} />
          <span>Keep trying! Hint: <span className="underline decoration-red-300 text-xl font-fredoka ml-1">{wordItem.word}</span></span>
        </div>
      )}

      {aiExplanation && (
        <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-white rounded-[2rem] border border-purple-100 animate-fade-in text-left shadow-sm">
          <div className="flex items-center gap-3 mb-3 text-purple-600 font-bold">
            <Sparkles size={20} />
            <span className="font-fredoka tracking-wide">AI Tutor's Tip</span>
          </div>
          <p className="text-gray-700 text-md italic leading-relaxed">{aiExplanation}</p>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default WordCard;
