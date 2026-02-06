
import React, { useState } from 'react';
import { WordItem } from '../types';
import { Volume2, Sparkles, Lightbulb, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
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

  /**
   * Highlights letters from the target word inside the English portion of the tip
   */
  const renderMemoryTip = (text: string, word: string) => {
    const [enPart, zhPart] = text.split('(');
    const wordLetters = word.toLowerCase().split('');

    const highlightText = (str: string) => {
      return str.split('').map((char, i) => {
        const isTargetLetter = wordLetters.includes(char.toLowerCase());
        if (isTargetLetter) {
          return (
            <span key={i} className="text-yellow-300 underline decoration-yellow-400 decoration-4 underline-offset-4">
              {char}
            </span>
          );
        }
        return char;
      });
    };

    return (
      <div className="space-y-4">
        <p className="text-white text-2xl sm:text-3xl font-bold font-fredoka leading-tight tracking-wide">
          {highlightText(enPart.trim())}
        </p>
        {zhPart && (
          <p className="text-sky-50 text-xl opacity-95 leading-snug font-medium">
            ({zhPart}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in flex flex-col gap-6">
      {/* Situational Image Container */}
      <div className={`bg-blue-50 rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-white relative h-[350px] sm:h-[400px] ${isVerb ? 'animate-gentle-pulse ring-4 ring-yellow-400/20' : ''}`}>
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-100 animate-pulse">
            <Sparkles className="text-blue-200" size={64} />
          </div>
        )}
        <img 
          src={wordItem.imageUrl} 
          alt={wordItem.word} 
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'} ${isVerb ? 'scale-105' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        <div className="absolute top-6 left-6 flex flex-col gap-3">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border-2 border-white">
            {isReview ? (
              <div className="flex items-center gap-2 text-orange-500 font-bold">
                <Clock size={18} />
                <span className="font-fredoka text-sm uppercase">Review Practice</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-blue-500 font-bold">
                <Sparkles size={18} />
                <span className="font-fredoka text-sm uppercase">New Discovery</span>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={playWord}
          className="absolute bottom-6 right-6 bg-yellow-400 hover:bg-yellow-500 text-white p-6 rounded-3xl shadow-2xl transform transition-all active:scale-90 hover:rotate-3 flex items-center gap-3 border-b-4 border-yellow-600 z-10"
        >
          <Volume2 size={40} strokeWidth={2.5} />
          <span className="font-fredoka text-xl font-bold">Listen</span>
        </button>
      </div>

      {/* Word Details Section */}
      <div className="bg-white rounded-[2.5rem] shadow-xl p-8 text-center space-y-8 border-4 border-blue-50">
        <div className="space-y-4">
          <span className="text-xs font-bold text-blue-300 uppercase tracking-widest block">
            Tap the parts to build the sound
          </span>
          <SyllableDisplay 
            syllables={wordItem.phonics.segments} 
            onSyllableClick={playSyllable}
          />
          
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {wordItem.phonics.rules.map((rule, idx) => (
              <PhonicsTagChip key={idx} rule={rule} />
            ))}
          </div>
        </div>

        <div className="space-y-2 border-t border-gray-100 pt-6">
          <h2 className="text-4xl font-bold text-gray-800 font-fredoka">
            {wordItem.meaning}
          </h2>
          {wordItem.example && (
            <p className="text-xl text-gray-500 italic max-w-lg mx-auto leading-relaxed">
              "{wordItem.example}"
            </p>
          )}
        </div>

        <div className="pt-4">
          <button
            onClick={onStartQuiz}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-8 rounded-[2.5rem] shadow-xl shadow-green-100 flex items-center justify-center gap-4 transform transition-all active:scale-95 border-b-8 border-green-700 text-3xl font-fredoka"
          >
            <CheckCircle size={40} />
            <span>Go Spell!</span>
          </button>
        </div>
      </div>

      {/* Memory Magic Section */}
      <div 
        className={`bg-sky-500 rounded-[2.5rem] transition-all duration-300 shadow-lg overflow-hidden border-4 border-white/20`}
      >
        <button 
          onClick={() => setIsTipOpen(!isTipOpen)}
          className="w-full p-6 text-white flex items-center justify-between gap-4 hover:bg-sky-600 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl shrink-0">
              <Lightbulb size={28} className={isTipOpen ? 'fill-yellow-300 text-yellow-300' : ''} />
            </div>
            <p className="font-bold text-2xl font-fredoka tracking-wide">Memory Magic 💡</p>
          </div>
          {isTipOpen ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
        </button>
        
        <div className={`transition-all duration-300 ease-in-out ${isTipOpen ? 'max-h-[500px] opacity-100 border-t border-white/10' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="p-8 pt-4">
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
