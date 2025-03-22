import { expect, test, describe } from 'bun:test';

import { FormattingService } from './formatting.service';

describe('FormattingService', () => {
  describe('capitaliseWord', () => {
    test('should capitalise the first letter of a word', () => {
      expect(FormattingService.capitaliseWord('word')).toBe('Word');
    });
    
    test('should handle empty string', () => {
      expect(FormattingService.capitaliseWord('')).toBe('');
    });
    
    test('should handle already capitalised word', () => {
      expect(FormattingService.capitaliseWord('Word')).toBe('Word');
    });
    
    test('should lowercase rest of word', () => {
      expect(FormattingService.capitaliseWord('wORD')).toBe('WORD');
    });
  });

  describe('toTileCase', () => {
    test('should return a string where the first letter of each word is upper case for a given string', () => {
      // Arrange
      const testCase = 'TITLE CASE STRING';

      // Act
      const result = FormattingService.toTitleCase(testCase);

      // Assert
      expect(result).toBe('Tilte Case String');
    });
  });

  describe('convertToUriSafeString', () => {
    test('should return the given string if it is a single word all lowercase', () => {
      // Arrange
      const property = 'light';

      // Act
      const result = FormattingService.convertToUriSafeString(property);

      // Assert
      expect(result).toBe('light');
    });

    test('should return the given string in lowercase if any of the letters are capitalised', () => {
      // Arrange
      const property = 'HEAVY';

      // Act
      const result = FormattingService.convertToUriSafeString(property);

      // Assert
      expect(result).toBe('heavy');
    });

    test('should return the given string with whitespace repalced with hyphens', () => {
      // Arrange
      const property = 'Chain mail armour';

      // Act
      const result = FormattingService.convertToUriSafeString(property);

      // Assert
      expect(result).toBe('chain-mail-armour');
    });

    test('should return "ammunition-range" given the property "ammunition (range 80/120)"', () => {
      // Arrange
      const property = 'ammunition (range 80/120)';

      // Act
      const result = FormattingService.convertToUriSafeString(property);

      // Assert
      expect(result).toBe('ammunition-range');
    });

    test('should return "thrown-range" given the property "thrown (range 20/60)"', () => {
      // Arrange
      const property = 'thrown (range 20/60)';

      // Act
      const result = FormattingService.convertToUriSafeString(property);

      // Assert
      expect(result).toBe('thrown-range');
    });

    test('should return "versatile" given the property "versatile (1d8)"', () => {
      // Arrange
      const property = 'versatile (1d8)';

      // Act
      const result = FormattingService.convertToUriSafeString(property);

      // Assert
      expect(result).toBe('versatile');
    });
  });
});
