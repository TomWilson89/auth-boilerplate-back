export class Utils {
  static capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  static capitalizeEach = (text: string) => {
    return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
}
