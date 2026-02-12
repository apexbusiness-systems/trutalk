import { describe, it, expect } from '@jest/globals';
import { formatDuration } from '../src/utils';

describe('Shared Utils', () => {
  describe('formatDuration', () => {
    it('should format 0 seconds as 0:00', () => {
      expect(formatDuration(0)).toBe('0:00');
    });

    it('should format less than 60 seconds correctly', () => {
      expect(formatDuration(45)).toBe('0:45');
    });

    it('should format exactly 60 seconds as 1:00', () => {
      expect(formatDuration(60)).toBe('1:00');
    });

    it('should format more than 60 seconds correctly', () => {
      expect(formatDuration(75)).toBe('1:15');
    });

    it('should pad single digit seconds with a zero', () => {
      expect(formatDuration(125)).toBe('2:05');
    });

    it('should handle large number of minutes', () => {
      expect(formatDuration(3600)).toBe('60:00');
      expect(formatDuration(3661)).toBe('61:01');
    });
  });
});
