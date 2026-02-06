
import { WordItem, LetterShape, WordType, PhonicsRule } from './types';

const getLetterShape = (char: string): LetterShape => {
  const c = char.toLowerCase();
  if ('bdfh klt'.includes(c)) return LetterShape.Ascender;
  if ('gjpqy'.includes(c)) return LetterShape.Descender;
  return LetterShape.Neutral;
};

export const generateMockWords = (): WordItem[] => {
  const wordsData: { word: string, type: WordType, meaning: string, segments: string[], rules: PhonicsRule[], img: string, ex: string, tip: string }[] = [
    { 
      word: 'swim', 
      type: 'verb', 
      meaning: '游泳', 
      segments: ['swim'], 
      rules: [
        {
          label: 'Short i sound',
          displayLabel: '⏱️ 短促音',
          tooltipText: '这个 i 只有一丁点长，念得要干脆，像被针扎了一下！',
          color: 'pink'
        },
        {
          label: 'Consonant blend',
          displayLabel: '⚡ 快速连读',
          tooltipText: 'sw 是好朋友，要手拉手紧紧贴在一起，一口气读出来，中间不能换气哦！',
          color: 'purple'
        }
      ], 
      img: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHY0bmJ2Zmt6eHBmZHBmZHBmZHBmZHBmZHBmZHBmZHBmZHBmJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxV3L2I8v8A/giphy.gif', 
      ex: 'Fish like to swim in the sea.',
      tip: "The letter m looks like waves! 🌊 (字母 m 就像海里的波浪，我们在波浪里 swim！)"
    },
    { 
      word: 'lamp', 
      type: 'noun', 
      meaning: '台灯', 
      segments: ['lamp'], 
      rules: [
        {
          label: 'Letter L',
          displayLabel: '📏 长长 L',
          tooltipText: 'L 站得高高的，帮我们照亮房间。',
          color: 'blue'
        }
      ], 
      img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop', 
      ex: 'Turn on the lamp please.',
      tip: "The letter L looks like a tall lamp standing in the room! 💡 (长长的字母 L 就像房间里高高的台灯！)"
    },
    { 
      word: 'camel', 
      type: 'noun', 
      meaning: '骆驼', 
      segments: ['ca', 'mel'], 
      rules: [
        {
          label: 'm sound',
          displayLabel: '🐪 双驼峰',
          tooltipText: '看到 m 就要想到骆驼背上的两个包包。',
          color: 'orange'
        }
      ], 
      img: 'https://images.unsplash.com/photo-1523585422575-02094821e27a?q=80&w=800&auto=format&fit=crop', 
      ex: 'The camel lives in the desert.',
      tip: "The letter m is like the two humps on the camel's back! 🐪 (字母 m 就像骆驼背上那两个高高的驼峰！)"
    },
    { 
      word: 'elephant', 
      type: 'noun', 
      meaning: '大象', 
      segments: ['e', 'le', 'phant'], 
      rules: [
        {
          label: 'Letter e',
          displayLabel: '🐘 卷鼻子',
          tooltipText: 'e 的小尾巴卷起来，就像大象的鼻子。',
          color: 'blue'
        },
        {
          label: 'ph sound',
          displayLabel: '🌬️ 吹风 f',
          tooltipText: 'p 和 h 碰到一起，就变成了 f 的声音。',
          color: 'purple'
        }
      ], 
      img: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=800&auto=format&fit=crop', 
      ex: 'The elephant is very big.',
      tip: "The letter e is like an elephant's curly trunk! 🐘 (字母 e 就像大象卷起来的长鼻子！)"
    },
    { 
      word: 'banana', 
      type: 'noun', 
      meaning: '香蕉', 
      segments: ['ba', 'na', 'na'], 
      rules: [
        {
          label: 'repeating pattern',
          displayLabel: '🍌 香蕉切片',
          tooltipText: 'a-n-a 重复了两次，就像一串香蕉。',
          color: 'yellow'
        }
      ], 
      img: 'https://images.unsplash.com/photo-1571771894821-ad99621139c6?q=80&w=800&auto=format&fit=crop', 
      ex: 'I eat a banana for breakfast.',
      tip: "The letters a-n-a-n-a look like repeating banana slices! 🍌 (a-n-a 就像一片片切好的香蕉，排成队等我们吃！)"
    }
  ];

  return wordsData.map((d, i) => ({
    id: String(i + 1),
    word: d.word,
    type: d.type,
    level: "Starters",
    meaning: d.meaning,
    imageUrl: d.img,
    audioUrl: '',
    phonics: {
      segments: d.segments,
      rules: d.rules
    },
    letterShapes: d.word.split('').map(getLetterShape),
    masteryLevel: 0,
    nextReviewTime: Date.now(),
    example: d.ex,
    memoryTip: d.tip
  }));
};
