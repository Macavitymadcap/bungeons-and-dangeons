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

  static convertToUriSafeString(property: string): string {
    const rangedPropertyMatch = property.match(/(ammunition|thrown)/i);
    if (rangedPropertyMatch) {
      return `${rangedPropertyMatch[1]}-range`;
    }

    if (property.match(/versatile/i)) {
      return 'versatile';
    }

    return property.toLowerCase().replace(' ', '-');
  }
}
