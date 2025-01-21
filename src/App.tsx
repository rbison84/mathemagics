import React from 'react';
import NumberGuessingGame from './components/NumberGuessingGame';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NumberGuessingGame />
    </div>
  );
};

export default App;
