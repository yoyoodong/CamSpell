
import React, { useState } from 'react';
import { PhonicsRule } from '../types';
import { Sparkles, X } from 'lucide-react';

interface PhonicsTagChipProps {
  rule: PhonicsRule;
}

const colorMap = {
  pink: 'bg-pink-100 text-pink-600 border-pink-200',
  purple: 'bg-purple-100 text-purple-600 border-purple-200',
  blue: 'bg-blue-100 text-blue-600 border-blue-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  green: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  orange: 'bg-orange-100 text-orange-600 border-orange-200',
};

const PhonicsTagChip: React.FC<PhonicsTagChipProps> = ({ rule }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Audio cue simulation (e.g. Speech Synthesis for the story)
      const utterance = new SpeechSynthesisUtterance(rule.tooltipText);
      utterance.lang = 'zh-CN';
      utterance.rate = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative inline-block group">
      <button
        onClick={handleToggle}
        className={`px-4 py-1.5 rounded-full border-2 font-bold text-sm sm:text-base flex items-center gap-2 transition-all transform active:scale-90 hover:-translate-y-0.5 shadow-sm ${colorMap[rule.color]} ${isOpen ? 'ring-4 ring-white shadow-md' : ''}`}
      >
        <Sparkles size={14} className={isOpen ? 'animate-spin' : ''} />
        {rule.displayLabel}
      </button>

      {/* Popover Bubble */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/5" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 z-50 animate-bounce-in">
            <div className="bg-white rounded-3xl p-5 shadow-2xl border-4 border-blue-100 relative">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-gray-300 hover:text-gray-500"
              >
                <X size={16} />
              </button>
              
              <div className="space-y-2">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Secret Story 🤫</p>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium">
                  {rule.tooltipText}
                </p>
              </div>

              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white" />
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes bounce-in {
          0% { transform: translate(-50%, 20px) scale(0.8); opacity: 0; }
          70% { transform: translate(-50%, -10px) scale(1.05); opacity: 1; }
          100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default PhonicsTagChip;
