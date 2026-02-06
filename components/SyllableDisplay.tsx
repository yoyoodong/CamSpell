
import React from 'react';

interface SyllableDisplayProps {
  syllables: string[];
  fontSize?: string;
  onSyllableClick?: (syllable: string) => void;
}

const colors = [
  'bg-pink-100 text-pink-600 border-pink-200 hover:bg-pink-200',
  'bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200',
  'bg-green-100 text-green-600 border-green-200 hover:bg-green-200',
  'bg-yellow-100 text-yellow-600 border-yellow-200 hover:bg-yellow-200',
  'bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-200',
];

const SyllableDisplay: React.FC<SyllableDisplayProps> = ({ syllables, fontSize = 'text-5xl', onSyllableClick }) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2">
      {syllables.map((syllable, index) => {
        const colorClass = colors[index % colors.length];
        return (
          <button
            key={index}
            onClick={() => onSyllableClick?.(syllable)}
            className={`px-5 py-3 rounded-2xl border-b-8 font-fredoka font-bold transition-all active:translate-y-1 active:border-b-2 cursor-pointer shadow-sm ${fontSize} ${colorClass}`}
            aria-label={`Pronounce ${syllable}`}
          >
            {syllable}
          </button>
        );
      })}
    </div>
  );
};

export default SyllableDisplay;
