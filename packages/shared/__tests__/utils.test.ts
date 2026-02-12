import { describe, it, expect } from '@jest/globals';
import { calculateSimilarity } from '../src/utils';

describe('calculateSimilarity', () => {
  it('should return 1 for identical vectors', () => {
    const vector = [1, 2, 3];
    expect(calculateSimilarity(vector, vector)).toBeCloseTo(1);
  });

  it('should return 0 for orthogonal vectors', () => {
    const vector1 = [1, 0];
    const vector2 = [0, 1];
    expect(calculateSimilarity(vector1, vector2)).toBeCloseTo(0);
  });

  it('should return -1 for opposite vectors', () => {
    const vector1 = [1, 1];
    const vector2 = [-1, -1];
    expect(calculateSimilarity(vector1, vector2)).toBeCloseTo(-1);
  });

  it('should handle vectors with different magnitudes but same direction', () => {
    const vector1 = [1, 2, 3];
    const vector2 = [2, 4, 6];
    expect(calculateSimilarity(vector1, vector2)).toBeCloseTo(1);
  });

  it('should handle vectors with different magnitudes and different direction', () => {
    const vector1 = [3, 4]; // magnitude 5
    const vector2 = [6, 0]; // magnitude 6
    // dot product = 18 + 0 = 18
    // expected = 18 / (5 * 6) = 18/30 = 0.6
    expect(calculateSimilarity(vector1, vector2)).toBeCloseTo(0.6);
  });

  it('should return NaN if one vector is a zero vector', () => {
    const vector1 = [0, 0, 0];
    const vector2 = [1, 2, 3];
    expect(calculateSimilarity(vector1, vector2)).toBeNaN();
  });

  it('should return NaN if both vectors are zero vectors', () => {
    const vector1 = [0, 0, 0];
    const vector2 = [0, 0, 0];
    expect(calculateSimilarity(vector1, vector2)).toBeNaN();
  });
});
