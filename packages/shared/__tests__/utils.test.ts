import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { isStreakActive } from '../src/utils';

// Example test for shared utilities
describe('Shared Utils', () => {
  it('should export utilities', () => {
    // This is a placeholder - add actual utility tests
    expect(true).toBe(true);
  });
});

describe('isStreakActive', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return false if lastCallDate is null', () => {
    expect(isStreakActive(null)).toBe(false);
  });

  it('should return true if last call was today', () => {
    const now = new Date('2023-10-15T12:00:00Z');
    jest.setSystemTime(now);

    // Same time
    expect(isStreakActive(now.toISOString())).toBe(true);

    // 1 hour ago
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    expect(isStreakActive(oneHourAgo.toISOString())).toBe(true);
  });

  it('should return true if last call was yesterday', () => {
    const now = new Date('2023-10-15T12:00:00Z');
    jest.setSystemTime(now);

    // 24 hours ago (exactly 1 day diff)
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    expect(isStreakActive(yesterday.toISOString())).toBe(true);

    // 47 hours ago (1.95 days -> floor is 1)
    const almostTwoDaysAgo = new Date(now.getTime() - 47 * 60 * 60 * 1000);
    expect(isStreakActive(almostTwoDaysAgo.toISOString())).toBe(true);
  });

  it('should return false if last call was day before yesterday', () => {
    const now = new Date('2023-10-15T12:00:00Z');
    jest.setSystemTime(now);

    // 48 hours ago (exactly 2 days diff)
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    expect(isStreakActive(twoDaysAgo.toISOString())).toBe(false);

    // 3 days ago
    const threeDaysAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);
    expect(isStreakActive(threeDaysAgo.toISOString())).toBe(false);
  });

  it('should return true for future dates (edge case)', () => {
     const now = new Date('2023-10-15T12:00:00Z');
     jest.setSystemTime(now);

     const future = new Date(now.getTime() + 24 * 60 * 60 * 1000);
     expect(isStreakActive(future.toISOString())).toBe(true);
  });
});
