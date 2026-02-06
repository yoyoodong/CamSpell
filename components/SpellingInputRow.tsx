
import React, { useRef, useEffect } from 'react';
import { LetterShape } from '../types';

interface SpellingInputRowProps {
  word: string;
  shapes: LetterShape[];
  value: string;
  onChange: (val: string) => void;
  onEnter: () => void;
  status: 'none' | 'success' | 'fail';
}

const SpellingInputRow: React.FC<SpellingInputRowProps> = ({ 
  word, 
  shapes, 
  value, 
  onChange, 
  onEnter, 
  status 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const chars = word.split('');

  useEffect(() => {
    inputRef.current?.focus();
  }, [word]);

  const handleClick = () => {
    inputRef.current?.focus();
  };

  const getBoxStyles = (shape: LetterShape, index: number) => {
    const isCurrent = value.length === index;
    const isFilled = value.length > index;
    
    // Core Geometry
    let geometry = "w-12 sm:w-16 transition-all duration-300 ";
    
    if (shape === LetterShape.Ascender) {
      // Tall aspect ratio (0.8), sticks up
      geometry += "aspect-[0.8] rounded-t-2xl -mt-6 ";
    } else if (shape === LetterShape.Descender) {
      // Tall aspect ratio, aligned bottom (sticks down)
      geometry += "aspect-[0.8] rounded-b-2xl mt-6 ";
    } else {
      // Standard Square
      geometry += "aspect-square rounded-2xl ";
    }

    // Coloring & States
    let stateStyles = "border-4 flex items-center justify-center font-fredoka font-bold text-3xl sm:text-4xl ";
    
    if (status === 'success') {
      stateStyles += "border-green-400 bg-green-50 text-green-600 shadow-lg scale-105 ";
    } else if (status === 'fail') {
      stateStyles += "border-red-400 bg-red-50 text-red-600 animate-shake ";
    } else if (isCurrent) {
      stateStyles += "border-blue-400 bg-blue-50 text-blue-600 ring-8 ring-blue-100 ";
    } else if (isFilled) {
      stateStyles += "border-blue-200 bg-white text-blue-600 shadow-sm ";
    } else {
      stateStyles += "border-gray-100 bg-gray-50/50 text-transparent ";
    }

    return `${geometry} ${stateStyles}`;
  };

  return (
    <div className="relative cursor-text py-12" onClick={handleClick}>
      {/* Hidden input for focus */}
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none"
        value={value}
        onChange={(e) => {
          const val = e.target.value.toLowerCase().replace(/[^a-z]/g, '');
          if (val.length <= word.length) onChange(val);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onEnter();
        }}
        autoFocus
      />

      {/* Visual Word Shape Layout */}
      <div className="flex justify-center items-center gap-2 sm:gap-4 min-h-[140px] relative">
        {/* Subtle Baseline Guide */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-100/40 -translate-y-1/2 rounded-full pointer-events-none" />
        
        {chars.map((_, i) => (
          <div key={i} className="flex flex-col items-center justify-center z-10">
            <div className={getBoxStyles(shapes[i], i)}>
              {value[i] || ""}
              {value.length === i && status === 'none' && (
                <div className="absolute bottom-2 w-1/3 h-1.5 bg-blue-400 animate-pulse rounded-full" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-center mt-6 text-blue-300 font-bold text-xs tracking-widest uppercase">
        Memory Hint: Look at the shapes!
      </p>
    </div>
  );
};

export default SpellingInputRow;
