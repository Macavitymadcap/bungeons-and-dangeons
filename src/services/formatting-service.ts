export class FormattingService {
  static toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
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
