import { ICard, CardType, CardCategory } from '../types';

export class Card implements ICard {
  constructor(
    public name: string,
    public type: CardType,
    public category: CardCategory = null
  ) {}

  evaluate(number: number, parameter: number | null = null): boolean | null {
    if (!number || isNaN(number)) {
      throw new Error('Invalid number provided');
    }

    if (this.name.includes('X') && (parameter === null || isNaN(parameter))) {
      throw new Error('Parameter required for this card type');
    }

    const numStr = number.toString();
    const digits = numStr.split('').map(Number);

    switch (this.name) {
      case 'Is it greater than X?':
        return number > parameter!;
      case 'Is it less than X?':
        return number < parameter!;
      case 'Is it even?':
        return number % 2 === 0;
      case 'Is it odd?':
        return number % 2 === 1;
      case 'Is the first digit even?':
        return Math.floor(number / 10) % 2 === 0;
      case 'Is the first digit odd?':
        return Math.floor(number / 10) % 2 === 1;
      case 'Is it divisible by X?':
        return number % parameter! === 0;
      case 'Does it have an X in it?':
        return numStr.includes(parameter!.toString());
      case 'Are both digits the same?':
        return digits.length === 2 && digits[0] === digits[1];
      case 'Are the digits consecutive?':
        return digits.length === 2 && Math.abs(digits[0] - digits[1]) === 1;
      case 'Are digits in ascending order?':
        return digits.length === 2 && digits[0] < digits[1];
      case 'Are digits in descending order?':
        return digits.length === 2 && digits[0] > digits[1];
      case 'Is the difference between digits even?':
        return digits.length === 2 && Math.abs(digits[0] - digits[1]) % 2 === 0;
      case 'Is the difference between digits odd?':
        return digits.length === 2 && Math.abs(digits[0] - digits[1]) % 2 === 1;
      case 'Is it divisible by 3?':
        return number % 3 === 0;
      case 'Is it divisible by 4?':
        return number % 4 === 0;
      case 'Is it divisible by 5?':
        return number % 5 === 0;
      case 'Is it divisible by 10?':
        return number % 10 === 0;
      case 'Do the digits add up to an even number?':
        return digits.reduce((a, b) => a + b, 0) % 2 === 0;
      case 'Do the digits add up to an odd number?':
        return digits.reduce((a, b) => a + b, 0) % 2 === 1;
      default:
        return null;
    }
  }
}
