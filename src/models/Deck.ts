import { IDeck, ICard } from '../types';
import { Card } from './Card';
import {
  CARD_TYPES,
  CARD_CATEGORIES,
  POWER_CARDS,
  MOST_POWERFUL_CARDS,
  MEDIUM_POWER_CARDS,
  LOWER_POWER_CARDS,
  PAIR_SEQUENCE_CARDS,
  DIGIT_PROPERTIES_CARDS
} from '../constants/gameConstants';

export class Deck implements IDeck {
  cards: ICard[] = [];

  constructor() {
    this.initializeDeck();
    this.shuffle();
  }

  private initializeDeck(): void {
    // Power Cards (2 of each)
    POWER_CARDS.forEach(name => {
      this.cards.push(...Array(2).fill(new Card(name, CARD_TYPES.POWER)));
    });

    // Most Powerful Cards (1 of each greater/less than, 2 of others)
    this.cards.push(new Card('Is it greater than X?', CARD_TYPES.MOST_POWERFUL));
    this.cards.push(new Card('Is it less than X?', CARD_TYPES.MOST_POWERFUL));
    MOST_POWERFUL_CARDS.forEach(name => {
      if (!name.includes('than')) {
        this.cards.push(...Array(2).fill(new Card(name, CARD_TYPES.MOST_POWERFUL)));
      }
    });

    // Medium Power Cards (3 of each)
    MEDIUM_POWER_CARDS.forEach(name => {
      this.cards.push(...Array(3).fill(new Card(name, CARD_TYPES.MEDIUM)));
    });

    // Lower Power Cards (2 of each)
    LOWER_POWER_CARDS.forEach(name => {
      this.cards.push(...Array(2).fill(new Card(name, CARD_TYPES.LOWER)));
    });

    // Pair/Sequence Cards (2 of each)
    PAIR_SEQUENCE_CARDS.forEach(name => {
      this.cards.push(...Array(2).fill(
        new Card(name, CARD_TYPES.NEW, CARD_CATEGORIES.PAIR_SEQUENCE)
      ));
    });

    // Digit Properties Cards (3 even, 2 odd)
    this.cards.push(...Array(3).fill(
      new Card('Is the difference between digits even?', CARD_TYPES.NEW, CARD_CATEGORIES.DIGIT_PROPERTIES)
    ));
    this.cards.push(...Array(2).fill(
      new Card('Is the difference between digits odd?', CARD_TYPES.NEW, CARD_CATEGORIES.DIGIT_PROPERTIES)
    ));
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(): ICard {
    if (this.cards.length === 0) {
      throw new Error('No cards left in the deck');
    }
    return this.cards.pop()!;
  }
}
