
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
      tip: "The letter m looks like waves! 🌊 (字母 m 就像海里的波浪，我们在波浪里游！)"
    },
    { 
      word: 'apple', 
      type: 'noun', 
      meaning: '苹果', 
      segments: ['ap', 'ple'], 
      rules: [
        {
          label: 'Short a sound',
          displayLabel: '🍎 饱满 a',
          tooltipText: '嘴巴张大，就像你要咬一口红红的大苹果一样，发出 aaaa 的声音！',
          color: 'orange'
        },
        {
          label: 'Silent e',
          displayLabel: '🤫 魔法 e',
          tooltipText: '单词末尾的 e 是个害羞的魔法师，它不说话，但它会给前面的字母变魔术！',
          color: 'blue'
        }
      ], 
      img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=800&auto=format&fit=crop', 
      ex: 'I like to eat a red apple.',
      tip: "The round a is like the big red apple! 🍎 (圆圆的字母 a 就像红红的大苹果！)"
    },
    { 
      word: 'jump', 
      type: 'verb', 
      meaning: '跳', 
      segments: ['jump'], 
      rules: [
        {
          label: 'Short u sound',
          displayLabel: '🥤 咕噜 u',
          tooltipText: '就像喝了一口果汁，发出的声音短促又好听！',
          color: 'yellow'
        }
      ], 
      img: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHY0bmJ2Zmt6eHBmZHBmZHBmZHBmZHBmZHBmZHBmZHBmZHBmJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l0HlU9Y3lJ2526TLO/giphy.gif', 
      ex: 'The frog can jump very high.',
      tip: "The letter j is like a little hook to jump over! 🪝 (字母 j 像个小钩子，让我们跳过去吧！)"
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
