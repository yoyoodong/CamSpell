
import React, { useState, useEffect } from 'react';
import { WordItem } from '../types';
import { Volume2, HelpCircle, Sparkles, AlertCircle, Eye, EyeOff, Lightbulb, X } from 'lucide-react';
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
  const [showMagicHint, setShowMagicHint] = useState(false);
  const [showImage, setShowImage] = useState(true);

  const isReviewWord = wordItem.masteryLevel > 0;
  const shouldMask = isReviewWord && !hintRevealed;

  useEffect(() => {
    setHintRevealed(false);
    setUserInput('');
    setShowMagicHint(false);
    setAiExplanation(null);
    setShowImage(true);
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
    <div className={`bg-white rounded-[2rem] shadow-xl p-5 sm:p-8 max-w-xl w-full mx-auto transform transition-all border-4 relative overflow-hidden ${
      showResult === 'success' ? 'border-green-200' : showResult === 'fail' ? 'border-red-200' : 'border-blue-50'
    }`}>
      {/* Background feedback flash */}
      {showResult === 'success' && <div className="absolute inset-0 bg-green-400/5 pointer-events-none animate-pulse" />}
      {showResult === 'fail' && <div className="absolute inset-0 bg-red-400/5 pointer-events-none animate-pulse" />}

      <div className="absolute top-0 right-0 p-3 sm:p-4 flex gap-2 z-20">
        <button 
          onClick={() => setShowMagicHint(!showMagicHint)}
          className={`flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-full shadow-sm border transition-all active:scale-95 ${showMagicHint ? 'bg-yellow-400 text-white border-yellow-500' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}
        >
          <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill={showMagicHint ? "white" : "none"} />
          <span className="text-[10px] uppercase tracking-wider">Hint</span>
        </button>
        <div className="flex items-center gap-1.5 text-blue-400 font-bold bg-blue-50 px-2.5 py-1 rounded-full shadow-sm border border-blue-100">
          {shouldMask ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          <span className="text-[10px] uppercase tracking-wider">
            {shouldMask ? 'Review' : 'Live'}
          </span>
        </div>
      </div>

      {/* Magic Hint Overlay */}
      {showMagicHint && (
        <div className="absolute inset-x-0 top-14 z-30 mx-6 animate-bounce-in">
          <div className="bg-sky-500 text-white p-4 rounded-2xl shadow-2xl border-4 border-white relative text-left">
            <button 
              onClick={() => setShowMagicHint(false)}
              className="absolute -top-2 -right-2 bg-white text-sky-500 p-1 rounded-full shadow-md"
            >
              <X size={14} />
            </button>
            <p className="font-fredoka text-sm sm:text-lg leading-snug">
              {wordItem.memoryTip}
            </p>
          </div>
        </div>
      )}

      <div className="text-center mb-4 sm:mb-6 mt-8 sm:mt-10">
        <div className="relative inline-block mb-3">
          {showImage ? (
            <>
              {!imgLoaded && (
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gray-50 rounded-2xl flex items-center justify-center animate-pulse">
                  <HelpCircle className="text-gray-200" size={32} />
                </div>
              )}
              <img 
                src={wordItem.imageUrl} 
                alt="Word illustration" 
                onLoad={() => setImgLoaded(true)}
                className={`w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-2xl shadow-md border-4 border-white transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
              />
            </>
          ) : (
            <div className="w-28 h-28 sm:w-36 sm:h-36 bg-blue-50 border-4 border-white rounded-2xl flex flex-col items-center justify-center text-blue-200">
               <EyeOff size={32} className="opacity-30" />
               <span className="text-[9px] font-bold uppercase mt-1 opacity-40">Hidden</span>
            </div>
          )}
          
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-xl shadow-md z-10 cursor-pointer active:scale-90 transition-transform" onClick={playAudio}>
            <Volume2 className="w-5 h-5" />
          </div>

          <button 
            onClick={() => setShowImage(!showImage)}
            className={`absolute -top-2 -left-2 p-2 rounded-xl shadow-md z-10 transition-all border-2 ${showImage ? 'bg-white text-gray-400 border-gray-100' : 'bg-blue-500 text-white border-blue-400'}`}
          >
            {showImage ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
        
        <div className="flex flex-col items-center gap-1 min-h-[2.5rem] sm:min-h-[3.5rem]">
          {shouldMask ? (
            <button 
              onClick={() => setHintRevealed(true)}
              className="text-blue-500 text-[10px] sm:text-xs font-bold flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
            >
              <Eye size={12} /> Reveal Meaning?
            </button>
          ) : (
            <p className="text-gray-500 text-lg sm:text-2xl font-fredoka leading-none">"{wordItem.meaning}"</p>
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

        <div className="flex gap-3">
          <button 
            onClick={handleCheck}
            disabled={userInput.length < 1 || showResult !== 'none'}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 text-white font-fredoka text-base sm:text-xl font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-md active:transform active:scale-95 transition-all border-b-6 border-blue-700 disabled:border-gray-300"
          >
            {showResult === 'success' ? 'Perfect! ✨' : 'Check'}
          </button>
          <button 
            onClick={askAi}
            disabled={loadingAi}
            className="px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl sm:rounded-2xl shadow-md flex items-center justify-center disabled:opacity-50 border-b-6 border-purple-700 transition-all active:scale-95"
            title="Ask Teacher"
          >
            {loadingAi ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {showCorrectHint && (
        <div className="mt-5 p-3 bg-red-50 text-red-700 rounded-xl flex items-center justify-center gap-2 font-bold animate-fade-in border border-red-100">
          <AlertCircle size={16} />
          <span className="text-xs sm:text-sm">Hint: <span className="underline decoration-red-300 text-base sm:text-lg font-fredoka ml-1 tracking-wide">{wordItem.word}</span></span>
        </div>
      )}

      {aiExplanation && (
        <div className="mt-5 p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl sm:rounded-2xl border border-purple-100 animate-fade-in text-left shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-purple-600 font-bold">
            <Sparkles size={16} />
            <span className="font-fredoka tracking-wide text-[10px] uppercase">Teacher Tip</span>
          </div>
          <p className="text-gray-700 text-xs sm:text-base italic leading-relaxed">{aiExplanation}</p>
        </div>
      )}

      <style>{`
        @keyframes bounce-in {
          0% { transform: translateY(-20px) scale(0.9); opacity: 0; }
          70% { transform: translateY(5px) scale(1.02); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default WordCard;
