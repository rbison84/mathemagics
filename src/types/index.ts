export type CardType = 'power' | 'most-powerful' | 'medium' | 'lower' | 'new';
export type CardCategory = 'pair-sequence' | 'digit-properties' | null;

export interface ICard {
  name: string;
  type: CardType;
  category: CardCategory;
  evaluate(number: number, parameter?: number | null): boolean | null;
}

export interface IDeck {
  cards: ICard[];
  draw(): ICard;
  shuffle(): void;
}

export interface IGame {
  deck: IDeck;
  discardPile: ICard[];
  computerHand: ICard[];
  playerHand: ICard[];
  computerNumber: number;
  playerNumber: number | null;
  computerPossibilities: number[];  // Changed from Set<number>
  playerPossibilities: number[];    // Changed from Set<number>
  dealInitialHands(): void;
  computerPlayTurn(): {
    card: ICard;
    parameter: number | null;
    result: boolean;
  } | null;
  updatePossibilities(forPlayer: boolean, card: ICard, parameter: number | null, result: boolean): void;
}
