import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, ArrowDown, ArrowUp, ArrowLeft, ArrowRight } from 'lucide-react';

const TARGET_SEQUENCE = '80128481';
const GRID_SIZE = 3; // 3x3 grid for 8 numbers + 1 empty space

type Position = {
  row: number;
  col: number;
};

function App() {
  const [grid, setGrid] = useState<(string | null)[][]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [emptyPos, setEmptyPos] = useState<Position>({ row: GRID_SIZE - 1, col: GRID_SIZE - 1 });

  const initializeGrid = () => {
    // Create array of numbers from the target sequence
    const numbers = TARGET_SEQUENCE.split('');
    
    // Shuffle the numbers
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    // Create the grid with the shuffled numbers and one empty space
    const newGrid: (string | null)[][] = [];
    let numberIndex = 0;
    
    for (let i = 0; i < GRID_SIZE; i++) {
      newGrid[i] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        if (i === GRID_SIZE - 1 && j === GRID_SIZE - 1) {
          newGrid[i][j] = null; // Empty space
        } else if (numberIndex < numbers.length) {
          newGrid[i][j] = numbers[numberIndex++];
        }
      }
    }

    setGrid(newGrid);
    setEmptyPos({ row: GRID_SIZE - 1, col: GRID_SIZE - 1 });
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    initializeGrid();
  }, []);

  const checkWin = (currentGrid: (string | null)[][]) => {
    const sequence = TARGET_SEQUENCE.split('');
    let index = 0;
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (i === GRID_SIZE - 1 && j === GRID_SIZE - 1) continue; // Skip empty space
        if (currentGrid[i][j] !== sequence[index]) return false;
        index++;
      }
    }
    
    return true;
  };

  const canMove = (row: number, col: number): boolean => {
    return (
      (Math.abs(row - emptyPos.row) === 1 && col === emptyPos.col) ||
      (Math.abs(col - emptyPos.col) === 1 && row === emptyPos.row)
    );
  };

  const moveNumber = (row: number, col: number) => {
    if (isWon || !canMove(row, col)) return;

    const newGrid = grid.map(r => [...r]);
    newGrid[emptyPos.row][emptyPos.col] = grid[row][col];
    newGrid[row][col] = null;

    setGrid(newGrid);
    setEmptyPos({ row, col });
    setMoves(moves + 1);

    if (checkWin(newGrid)) {
      setIsWon(true);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (isWon) return;

    const { row, col } = emptyPos;
    let newRow = row;
    let newCol = col;

    switch (e.key) {
      case 'ArrowUp':
        newRow = Math.min(row + 1, GRID_SIZE - 1);
        break;
      case 'ArrowDown':
        newRow = Math.max(row - 1, 0);
        break;
      case 'ArrowLeft':
        newCol = Math.min(col + 1, GRID_SIZE - 1);
        break;
      case 'ArrowRight':
        newCol = Math.max(col - 1, 0);
        break;
      default:
        return;
    }

    if (canMove(newRow, newCol)) {
      moveNumber(newRow, newCol);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [emptyPos, isWon]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sliding Student ID</h1>
          <p className="text-gray-600">
            Arrange the numbers to match: {TARGET_SEQUENCE.split('').join(' ')}
          </p>
          <div className="mt-2 text-xl font-semibold text-blue-600">
            Moves: {moves}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8 aspect-square">
          {grid.map((row, i) => 
            row.map((cell, j) => (
              <button
                key={`${i}-${j}`}
                onClick={() => moveNumber(i, j)}
                disabled={!canMove(i, j) || isWon}
                className={`
                  aspect-square flex items-center justify-center text-2xl font-bold rounded-lg
                  transition-all duration-200 transform hover:scale-105
                  ${cell === null 
                    ? 'bg-gray-100 cursor-default' 
                    : canMove(i, j)
                      ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                      : 'bg-blue-100 text-blue-800 cursor-not-allowed'}
                `}
              >
                {cell}
              </button>
            ))
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => handleKeyPress({ key: 'ArrowUp' } as KeyboardEvent)}
            className="col-start-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center gap-2"
          >
            <ArrowUp size={18} />
          </button>
          <button
            onClick={() => handleKeyPress({ key: 'ArrowLeft' } as KeyboardEvent)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => handleKeyPress({ key: 'ArrowDown' } as KeyboardEvent)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center gap-2"
          >
            <ArrowDown size={18} />
          </button>
          <button
            onClick={() => handleKeyPress({ key: 'ArrowRight' } as KeyboardEvent)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center gap-2"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={initializeGrid}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <RotateCcw size={18} /> New Game
          </button>
        </div>

        {isWon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl text-center">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Congratulations!</h2>
              <p className="text-gray-600 mb-4">You've arranged the sequence in {moves} moves!</p>
              <button
                onClick={initializeGrid}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
