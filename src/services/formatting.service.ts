export class FormattingService {
  static capitaliseWord(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  
  static toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => FormattingService.capitaliseWord(word))
      .join(' ');
  }

  static convertToUriSafeString(str: string): string {
    const rangedPropertyMatch = str.match(/(ammunition|thrown)/i);
    if (rangedPropertyMatch) {
      return `${rangedPropertyMatch[1]}-range`;
    }

    if (str.match(/versatile/i)) {
      return 'versatile';
    }

    return str.toLowerCase().replace(/\s+/g, '-');
  }
}
