
import { WordItem } from '../types';

export class ReviewManager {
  private static FIVE_MIN_MS = 5 * 60 * 1000;
  private static TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

  /**
   * Filter words that are due for review based on current time
   */
  static getDueWords(words: WordItem[]): WordItem[] {
    const now = Date.now();
    return words.filter(word => word.masteryLevel > 0 && word.nextReviewTime <= now);
  }

  /**
   * Filter words that have never been started (mastery 0)
   */
  static getNewWords(words: WordItem[]): WordItem[] {
    return words.filter(word => word.masteryLevel === 0);
  }

  /**
   * Select the next word for the session based on priority:
   * 1. Due words
   * 2. New words
   */
  static pickNextWord(words: WordItem[]): WordItem | null {
    const due = this.getDueWords(words);
    if (due.length > 0) return due[0];
    
    const newWords = this.getNewWords(words);
    if (newWords.length > 0) return newWords[0];
    
    return null;
  }

  /**
   * Update word metadata based on review result
   */
  static processReview(word: WordItem, isCorrect: boolean): WordItem {
    const now = Date.now();
    
    if (isCorrect) {
      // Logic: 
      // If it's the very first time (new word), next review is 5 mins.
      // If it's a recurring review, next is 12 hours.
      const isFirstTime = word.masteryLevel === 0;
      const nextInterval = isFirstTime ? this.FIVE_MIN_MS : this.TWELVE_HOURS_MS;
      
      return {
        ...word,
        masteryLevel: Math.min(word.masteryLevel + 1, 5),
        nextReviewTime: now + nextInterval,
      };
    } else {
      // Logic: Reset mastery to 0 and review "today" (immediately due)
      return {
        ...word,
        masteryLevel: 0,
        nextReviewTime: now,
      };
    }
  }
}
