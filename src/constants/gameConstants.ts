export const CARD_TYPES = {
  POWER: 'power',
  MOST_POWERFUL: 'most-powerful',
  MEDIUM: 'medium',
  LOWER: 'lower',
  NEW: 'new'
} as const;

export const CARD_CATEGORIES = {
  PAIR_SEQUENCE: 'pair-sequence',
  DIGIT_PROPERTIES: 'digit-properties'
} as const;

export const INITIAL_HAND_SIZE = 5;
export const MIN_NUMBER = 1;
export const MAX_NUMBER = 100;

export const POWER_CARDS = [
  'Pick any card from the discard pile',
  'Retain your card after using it',
  'Pick an entirely new hand',
  'Steal a card from your opponent'
] as const;

export const MOST_POWERFUL_CARDS = [
  'Is it greater than X?',
  'Is it less than X?',
  'Is it even?',
  'Is it odd?',
  'Is the first digit even?',
  'Is the first digit odd?'
] as const;

export const MEDIUM_POWER_CARDS = [
  'Does it have an X in it?',
  'Is it divisible by X?',
  'Is it X?'
] as const;

export const LOWER_POWER_CARDS = [
  'Is it divisible by 3?',
  'Is it divisible by 4?',
  'Is it divisible by 5?',
  'Is it divisible by 10?',
  'Do the digits add up to an even number?',
  'Do the digits add up to an odd number?'
] as const;

export const PAIR_SEQUENCE_CARDS = [
  'Are both digits the same?',
  'Are the digits consecutive?',
  'Are digits in ascending order?',
  'Are digits in descending order?'
] as const;

export const DIGIT_PROPERTIES_CARDS = [
  'Is the difference between digits even?',
  'Is the difference between digits odd?'
] as const;
