
import React, { useState, useEffect } from 'react';
import { WordItem } from '../types';
import { Volume2, RefreshCw } from 'lucide-react';

interface PhonicsBuilderProps {
  wordItem: WordItem;
  onSuccess: () => void;
  onError: () => void;
}

// Smart Distractors: Map common vowels/blends to their common confusing counterparts
const PHONETIC_DISTRACTORS: Record<string, string[]> = {
  'oo': ['ou', 'u', 'oa'],
  'ee': ['ea', 'i', 'ey'],
  'ck': ['k', 'c', 'ch'],
  'th': ['f', 'v', 's'],
  'ch': ['sh', 'j', 'ts'],
  'ai': ['ay', 'ae', 'a'],
  'ar': ['or', 'er', 'ur'],
  'ou': ['ow', 'oo', 'au']
};

const PhonicsBuilder: React.FC<PhonicsBuilderProps> = ({ wordItem, onSuccess, onError }) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [shuffledSyllables, setShuffledSyllables] = useState<{ text: string, id: number }[]>([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const segments = wordItem.phonics.segments.map((s, i) => ({ text: s, id: i }));
    
    // Find relevant distractors based on the word's content
    let customDistractors: string[] = [];
    Object.keys(PHONETIC_DISTRACTORS).forEach(key => {
      if (wordItem.word.toLowerCase().includes(key)) {
        customDistractors.push(...PHONETIC_DISTRACTORS[key]);
      }
    });

    // Fill the rest with general distractors
    const generic = ['ing', 'tion', 'ly', 'er', 'est', 'ed', 'un'];
    const finalDistractors = [...new Set([...customDistractors, ...generic])]
      .filter(d => !wordItem.word.includes(d))
      .sort(() => Math.random() - 0.5)
      .slice(0, wordItem.phonics.segments.length > 2 ? 1 : 2)
      .map((d, i) => ({ text: d, id: 100 + i }));

    const pool = [...segments, ...finalDistractors].sort(() => Math.random() - 0.5);
    setShuffledSyllables(pool);
    setSelectedIndices([]);
    setIsError(false);
  }, [wordItem]);

  const handleChipClick = (indexInPool: number) => {
    if (selectedIndices.includes(indexInPool)) return;
    
    const newSelected = [...selectedIndices, indexInPool];
    setSelectedIndices(newSelected);

    if (newSelected.length === wordItem.phonics.segments.length) {
      const spelledWord = newSelected.map(idx => shuffledSyllables[idx].text).join('');
      
      if (spelledWord.toLowerCase() === wordItem.word.toLowerCase()) {
        onSuccess();
      } else {
        setIsError(true);
        onError();
        setTimeout(() => {
          setIsError(false);
          setSelectedIndices([]);
        }, 800);
      }
    }
  };

  const removeLast = () => {
    setSelectedIndices(prev => prev.slice(0, -1));
  };

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(wordItem.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`space-y-12 transition-all ${isError ? 'animate-shake' : ''}`}>
      {/* Target Receiving Area */}
      <div className="flex justify-center items-center gap-3 min-h-[80px]">
        {wordItem.phonics.segments.map((_, i) => (
          <div 
            key={i}
            className={`w-24 h-16 rounded-2xl border-4 border-dashed flex items-center justify-center transition-all ${
              selectedIndices[i] !== undefined 
                ? 'border-blue-400 bg-blue-50' 
                : isError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
            }`}
          >
            {selectedIndices[i] !== undefined && (
              <span className="text-2xl font-bold text-blue-600 font-fredoka animate-pop">
                {shuffledSyllables[selectedIndices[i]].text}
              </span>
            )}
          </div>
        ))}
        {selectedIndices.length > 0 && (
          <button 
            onClick={removeLast}
            className="ml-2 p-2 text-gray-400 hover:text-red-400"
          >
            <RefreshCw size={24} />
          </button>
        )}
      </div>

      {/* Audio Hint */}
      <div className="flex justify-center">
        <button 
          onClick={playAudio}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-8 py-3 rounded-2xl shadow-lg flex items-center gap-3 font-fredoka text-xl border-b-4 border-yellow-600 active:translate-y-1 active:border-b-0"
        >
          <Volume2 size={24} />
          <span>Say it again</span>
        </button>
      </div>

      {/* Chip Pool Area */}
      <div className="bg-gray-50/50 rounded-[2rem] p-8 border-2 border-gray-100">
        <div className="flex flex-wrap justify-center gap-4">
          {shuffledSyllables.map((chip, idx) => {
            const isSelected = selectedIndices.includes(idx);
            return (
              <button
                key={idx}
                disabled={isSelected}
                onClick={() => handleChipClick(idx)}
                className={`px-6 py-4 rounded-2xl border-b-4 font-fredoka font-bold text-2xl transition-all shadow-md ${
                  isSelected 
                    ? 'opacity-0 scale-90 pointer-events-none' 
                    : 'bg-white text-gray-700 border-gray-200 hover:-translate-y-1 hover:border-b-8 active:translate-y-1 active:border-b-0'
                }`}
              >
                {chip.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhonicsBuilder;
