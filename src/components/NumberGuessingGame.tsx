import React, { useState, useEffect } from 'react';
import { Game } from '../models/Game';
import { ICard } from '../types';
import { MIN_NUMBER, MAX_NUMBER } from '../constants/gameConstants';

type GamePhase = 'setup' | 'playing' | 'ended';

const NumberGuessingGame: React.FC = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [playerNumber, setPlayerNumber] = useState<string>('');
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [selectedCard, setSelectedCard] = useState<{card: ICard, index: number} | null>(null);
  const [parameter, setParameter] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [turn, setTurn] = useState<'player' | 'computer'>('player');
  const [guessInput, setGuessInput] = useState<string>('');
  const [showGuessInput, setShowGuessInput] = useState<boolean>(false);

  useEffect(() => {
    if (!game) {
      const newGame = new Game();
      newGame.dealInitialHands();
      setGame(newGame);
    }
  }, []);

  const handleNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(playerNumber);
    if (num >= MIN_NUMBER && num <= MAX_NUMBER) {
      if (game) {
        game.playerNumber = num;
        setGamePhase('playing');
        setMessage('Game started! Your turn.');
      }
    } else {
      setMessage(`Please enter a number between ${MIN_NUMBER} and ${MAX_NUMBER}`);
    }
  };

  const handleCardPlay = (card: ICard, index: number) => {
    if (turn !== 'player') return;
    
    if (card.name === 'Is it X?') {
      setShowGuessInput(true);
      setSelectedCard({ card, index });
      return;
    }
    
    if (card.name.includes('X')) {
      setSelectedCard({ card, index });
    } else {
      playCard(card, index);
    }
  };

  const makeGuess = (e: React.FormEvent) => {
    e.preventDefault();
    const guess = parseInt(guessInput);
    if (guess === game?.computerNumber) {
      setMessage('Congratulations! You won!');
      setGamePhase('ended');
    } else {
      setMessage('Wrong guess! Keep trying!');
      setShowGuessInput(false);
      setGuessInput('');
      if (selectedCard) {
        const { card, index } = selectedCard;
        game?.playerHand.splice(index, 1);
        game?.discardPile.push(card);
        game?.playerHand.push(game.deck.draw());
        setSelectedCard(null);
        setTurn('computer');
        computerTurn();
      }
    }
  };

  const playCard = (card: ICard, index: number, param: number | null = null) => {
    if (!game || !game.computerNumber) return;

    const result = card.evaluate(game.computerNumber, param);
    game.playerHand.splice(index, 1);
    game.discardPile.push(card);
    game.playerHand.push(game.deck.draw());
    game.updatePossibilities(true, card, param, result!);
    
    setMessage(`Card result: ${result}`);
    setSelectedCard(null);
    setParameter('');
    setTurn('computer');
    
    computerTurn();
  };

  const computerTurn = () => {
    setTimeout(() => {
      if (!game) return;

      const computerMove = game.computerPlayTurn();
      if (computerMove) {
        const moveMessage = `Computer played: ${computerMove.card.name}${
          computerMove.parameter ? ` with parameter ${computerMove.parameter}` : ''
        }. Result: ${computerMove.result}`;
        setMessage(moveMessage);

        if (game.computerPossibilities.size === 1) {
          const guess = Array.from(game.computerPossibilities)[0];
          if (guess === game.playerNumber) {
            setMessage('Computer won! Game Over!');
            setGamePhase('ended');
            return;
          }
        }
      }
      setTurn('player');
    }, 1500);
  };

  const handleParameterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const param = parseInt(parameter);
    if (selectedCard && param >= MIN_NUMBER && param <= MAX_NUMBER) {
      playCard(selectedCard.card, selectedCard.index, param);
    } else {
      setMessage('Please enter a valid parameter');
    }
  };

  if (!game) return <div className="p-4">Loading...</div>;

  if (gamePhase === 'setup') {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Number Guessing Game</h2>
        <form onSubmit={handleNumberSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">
              Enter your number ({MIN_NUMBER}-{MAX_NUMBER}):
            </label>
            <input
              type="number"
              value={playerNumber}
              onChange={(e) => setPlayerNumber(e.target.value)}
              className="border p-2 rounded w-full"
              min={MIN_NUMBER}
              max={MAX_NUMBER}
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Game
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Number Guessing Game</h2>
      
      {gamePhase === 'ended' ? (
        <div className="mb-4">
          <p className="font-bold text-xl">{message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className={`font-bold ${turn === 'player' ? 'text-green-600' : 'text-red-600'}`}>
              {turn === 'player' ? 'Your turn' : 'Computer\'s turn'}
            </p>
            <p className="font-bold mt-2">{message}</p>
            <p>Your possibilities: {game.playerPossibilities.size} numbers left</p>
            <p>Computer's possibilities: {game.computerPossibilities.size} numbers left</p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-2">Your Hand:</h3>
            <div className="flex flex-wrap gap-2">
              {game.playerHand.map((card, index) => (
                <button
                  key={index}
                  onClick={() => handleCardPlay(card, index)}
                  disabled={turn !== 'player'}
                  className="border p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
                >
                  {card.name}
                </button>
              ))}
            </div>
          </div>

          {showGuessInput && (
            <form onSubmit={makeGuess} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  placeholder="Enter your guess"
                  className="border p-2 rounded"
                  min={MIN_NUMBER}
                  max={MAX_NUMBER}
                />
                <button 
                  type="submit" 
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Make Guess
                </button>
              </div>
            </form>
          )}

          {selectedCard && !showGuessInput && selectedCard.card.name.includes('X') && (
            <form onSubmit={handleParameterSubmit} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={parameter}
                  onChange={(e) => setParameter(e.target.value)}
                  placeholder="Enter parameter"
                  className="border p-2 rounded"
                  min={MIN_NUMBER}
                  max={MAX_NUMBER}
                />
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Play Card
                </button>
              </div>
            </form>
          )}

          <div className="mb-4">
            <h3 className="font-bold mb-2">Discard Pile:</h3>
            <div className="flex flex-wrap gap-2">
              {game.discardPile.map((card, index) => (
                <div key={index} className="border p-2 rounded opacity-50">
                  {card.name}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NumberGuessingGame;
