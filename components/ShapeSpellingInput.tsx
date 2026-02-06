
import React, { useRef, useEffect } from 'react';
import { LetterShape } from '../types';

interface ShapeSpellingInputProps {
  word: string;
  shapes: LetterShape[];
  value: string;
  onChange: (val: string) => void;
  onEnter: () => void;
  status: 'none' | 'success' | 'fail';
}

const ShapeSpellingInput: React.FC<ShapeSpellingInputProps> = ({ 
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

  const boxBaseClasses = "w-10 h-10 sm:w-14 sm:h-14 rounded-xl border-4 flex items-center justify-center font-fredoka font-bold text-2xl sm:text-3xl transition-all duration-200 relative";
  
  const getShapeClasses = (shape: LetterShape, isFilled: boolean, index: number) => {
    const isCurrent = value.length === index;
    let shapeStyles = "";
    
    // Height & Positioning
    if (shape === LetterShape.Ascender) {
      shapeStyles = "h-16 sm:h-20 -mt-6 sm:-mt-6 rounded-t-2xl";
    } else if (shape === LetterShape.Descender) {
      shapeStyles = "h-16 sm:h-20 mt-6 sm:mt-6 rounded-b-2xl";
    }

    // Colors and Status
    if (status === 'success') return `${shapeStyles} border-green-400 bg-green-50 text-green-600 shadow-lg scale-105`;
    if (status === 'fail') return `${shapeStyles} border-red-400 bg-red-50 text-red-600 animate-shake`;
    
    if (isCurrent) return `${shapeStyles} border-blue-400 bg-blue-50 text-blue-600 ring-4 ring-blue-100 ring-opacity-50`;
    if (isFilled) return `${shapeStyles} border-blue-200 bg-white text-blue-600 shadow-sm`;
    
    return `${shapeStyles} border-gray-100 bg-gray-50/30 text-transparent`;
  };

  return (
    <div className="relative cursor-text py-10" onClick={handleClick}>
      {/* Hidden Input for focus and typing */}
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

      {/* Visual Representation */}
      <div className="flex justify-center items-center gap-2 sm:gap-3 min-h-[120px]">
        {chars.map((char, i) => (
          <div key={i} className="flex flex-col items-center justify-center">
            <div className={`${boxBaseClasses} ${getShapeClasses(shapes[i], value.length > i, i)}`}>
              {value[i] || ""}
              {value.length === i && status === 'none' && (
                <div className="absolute bottom-2 w-1/2 h-1 bg-blue-400 animate-pulse rounded-full" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Visual Baseline Guide (optional, subtle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-blue-100/30 pointer-events-none" />
    </div>
  );
};

export default ShapeSpellingInput;
