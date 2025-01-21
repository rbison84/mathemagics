import { IGame, ICard } from '../types';
import { Deck } from './Deck';
import { INITIAL_HAND_SIZE, MIN_NUMBER, MAX_NUMBER } from '../constants/gameConstants';

export class Game implements IGame {
  deck: Deck;
  discardPile: ICard[] = [];
  computerHand: ICard[] = [];
  playerHand: ICard[] = [];
  computerNumber: number;
  playerNumber: number | null = null;
  computerPossibilities: number[];
  playerPossibilities: number[];

  constructor() {
    this.deck = new Deck();
    this.computerNumber = Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
    this.computerPossibilities = Array.from(
      { length: MAX_NUMBER - MIN_NUMBER + 1 }, 
      (_, i) => i + MIN_NUMBER
    );
    this.playerPossibilities = Array.from(
      { length: MAX_NUMBER - MIN_NUMBER + 1 }, 
      (_, i) => i + MIN_NUMBER
    );
  }

  dealInitialHands(): void {
    while (this.computerHand.length < INITIAL_HAND_SIZE) {
      this.computerHand.push(this.deck.draw());
    }
    while (this.playerHand.length < INITIAL_HAND_SIZE) {
      this.playerHand.push(this.deck.draw());
    }
  }

  computerPlayTurn(): { card: ICard; parameter: number | null; result: boolean; } | null {
    let bestCard: ICard | null = null;
    let bestParameter: number | null = null;
    let bestReduction = 0;

    for (const card of this.computerHand) {
      if (card.type === 'power') continue;

      if (card.name.includes('X')) {
        for (let param = MIN_NUMBER; param <= MAX_NUMBER; param++) {
          const remaining = this.playerPossibilities.filter(
            num => !card.evaluate(num, param)
          );
          const reduction = this.playerPossibilities.length - remaining.length;
          if (reduction > bestReduction) {
            bestReduction = reduction;
            bestCard = card;
            bestParameter = param;
          }
        }
      } else {
        const remaining = this.playerPossibilities.filter(
          num => !card.evaluate(num, null)
        );
        const reduction = this.playerPossibilities.length - remaining.length;
        if (reduction > bestReduction) {
          bestReduction = reduction;
          bestCard = card;
        }
      }
    }

    if (bestCard) {
      const cardIndex = this.computerHand.indexOf(bestCard);
      this.computerHand.splice(cardIndex, 1);
      this.discardPile.push(bestCard);
      this.computerHand.push(this.deck.draw());
      
      return {
        card: bestCard,
        parameter: bestParameter,
        result: bestCard.evaluate(this.playerNumber!, bestParameter) ?? false
      };
    }

    return null;
  }

  updatePossibilities(forPlayer: boolean, card: ICard, parameter: number | null, result: boolean): void {
    if (forPlayer) {
      this.playerPossibilities = this.playerPossibilities.filter(
        num => card.evaluate(num, parameter) === result
      );
    } else {
      this.computerPossibilities = this.computerPossibilities.filter(
        num => card.evaluate(num, parameter) === result
      );
    }
  }
}
