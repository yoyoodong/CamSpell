
import React, { useState } from 'react';
import { WordItem } from '../types';
import { Volume2, Sparkles, Lightbulb, CheckCircle, Clock, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import SyllableDisplay from './SyllableDisplay';
import PhonicsTagChip from './PhonicsTagChip';

interface StudyViewProps {
  wordItem: WordItem;
  onNext: () => void;
  onPrev: () => void;
  onStartQuiz: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const StudyView: React.FC<StudyViewProps> = ({ 
  wordItem, 
  onStartQuiz
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isTipOpen, setIsTipOpen] = useState(true);
  const [showImage, setShowImage] = useState(true);
  
  const playWord = () => {
    const utterance = new SpeechSynthesisUtterance(wordItem.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const playSyllable = (syl: string) => {
    const utterance = new SpeechSynthesisUtterance(syl);
    utterance.lang = 'en-US';
    utterance.rate = 0.6;
    window.speechSynthesis.speak(utterance);
  };

  const isReview = wordItem.masteryLevel > 0;
  const isVerb = wordItem.type === 'verb';

  const renderMemoryTip = (text: string, word: string) => {
    const [enPart, zhPart] = text.split('(');
    const wordLetters = word.toLowerCase().split('');

    const highlightText = (str: string) => {
      return str.split('').map((char, i) => {
        const isTargetLetter = wordLetters.includes(char.toLowerCase());
        if (isTargetLetter) {
          return (
            <span key={i} className="text-yellow-300 underline decoration-yellow-400 decoration-2 sm:decoration-4 underline-offset-4">
              {char}
            </span>
          );
        }
        return char;
      });
    };

    return (
      <div className="space-y-1 sm:space-y-3">
        <p className="text-white text-lg sm:text-2xl font-bold font-fredoka leading-tight tracking-wide">
          {highlightText(enPart.trim())}
        </p>
        {zhPart && (
          <p className="text-sky-50 text-sm sm:text-lg opacity-90 leading-snug font-medium">
            ({zhPart}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in flex flex-col gap-3 sm:gap-5">
      {/* Situational Image Container */}
      <div className={`bg-blue-50 rounded-[2rem] shadow-lg overflow-hidden border-4 sm:border-8 border-white relative h-[200px] sm:h-[300px] lg:h-[350px] transition-all duration-500 ${!showImage ? 'bg-gradient-to-br from-blue-100 to-indigo-100' : ''}`}>
        {showImage ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-100 animate-pulse">
                <Sparkles className="text-blue-200" size={40} />
              </div>
            )}
            <img 
              src={wordItem.imageUrl} 
              alt={wordItem.word} 
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'} ${isVerb ? 'scale-105' : ''}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-300 gap-2">
            <EyeOff size={48} className="opacity-20" />
            <span className="font-fredoka font-bold text-sm tracking-widest uppercase opacity-40">Memory Mode</span>
          </div>
        )}
        
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl shadow-md border border-white">
            {isReview ? (
              <div className="flex items-center gap-1.5 text-orange-500 font-bold">
                <Clock size={12} className="sm:w-[14px]" />
                <span className="font-fredoka text-[10px] sm:text-xs uppercase tracking-tight">Review</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-blue-500 font-bold">
                <Sparkles size={12} className="sm:w-[14px]" />
                <span className="font-fredoka text-[10px] sm:text-xs uppercase tracking-tight">New</span>
              </div>
            )}
          </div>
        </div>

        {/* Peek Toggle */}
        <button 
          onClick={() => setShowImage(!showImage)}
          className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-xl shadow-lg transition-all active:scale-90 border-2 z-20 ${showImage ? 'bg-white text-blue-500 border-white' : 'bg-blue-500 text-white border-blue-400'}`}
          title={showImage ? "Hide Picture" : "Show Picture"}
        >
          {showImage ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>

        <button 
          onClick={playWord}
          className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-yellow-400 hover:bg-yellow-500 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl transform transition-all active:scale-90 hover:rotate-3 flex items-center gap-2 border-b-4 border-yellow-600 z-10"
        >
          <Volume2 className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.5} />
          <span className="font-fredoka text-base sm:text-lg font-bold">Listen</span>
        </button>
      </div>

      {/* Word Details Section */}
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm p-4 sm:p-6 text-center space-y-3 sm:space-y-5 border-2 border-blue-50">
        <div className="space-y-2">
          <span className="text-[9px] sm:text-[10px] font-bold text-blue-300 uppercase tracking-widest block">
            Build the sound
          </span>
          <SyllableDisplay 
            fontSize="text-2xl sm:text-4xl"
            syllables={wordItem.phonics.segments} 
            onSyllableClick={playSyllable}
          />
          
          <div className="flex flex-wrap justify-center gap-2">
            {wordItem.phonics.rules.map((rule, idx) => (
              <PhonicsTagChip key={idx} rule={rule} />
            ))}
          </div>
        </div>

        <div className="space-y-1 border-t border-gray-50 pt-3 sm:pt-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-fredoka">
            {wordItem.meaning}
          </h2>
          {wordItem.example && (
            <p className="text-sm sm:text-base text-gray-400 italic max-w-md mx-auto leading-relaxed px-2">
              "{wordItem.example}"
            </p>
          )}
        </div>

        <div className="pt-1">
          <button
            onClick={onStartQuiz}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 sm:py-5 px-4 rounded-2xl sm:rounded-[2.5rem] shadow-md flex items-center justify-center gap-2 transform transition-all active:scale-95 border-b-6 border-green-700 text-xl sm:text-2xl font-fredoka"
          >
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
            <span>Start Spelling</span>
          </button>
        </div>
      </div>

      {/* Memory Magic Section */}
      <div 
        className={`bg-sky-500 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-md overflow-hidden border-2 border-white/20`}
      >
        <button 
          onClick={() => setIsTipOpen(!isTipOpen)}
          className="w-full p-3.5 sm:p-5 text-white flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="bg-white/20 p-2 rounded-xl shrink-0">
              <Lightbulb className={`w-5 h-5 sm:w-6 sm:h-6 ${isTipOpen ? 'fill-yellow-300 text-yellow-300' : ''}`} />
            </div>
            <p className="font-bold text-base sm:text-xl font-fredoka tracking-wide">Memory Magic 💡</p>
          </div>
          {isTipOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        <div className={`transition-all duration-300 ease-in-out ${isTipOpen ? 'max-h-[300px] opacity-100 border-t border-white/10' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="p-4 sm:p-6 pt-1 sm:pt-3 text-left">
            {renderMemoryTip(wordItem.memoryTip, wordItem.word)}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gentle-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
        .animate-gentle-pulse {
          animation: gentle-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default StudyView;
