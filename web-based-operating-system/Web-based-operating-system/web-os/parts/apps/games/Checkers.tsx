import React, { useState, useCallback, useEffect } from 'react';
import { RotateCcw, Crown, User, Bot, Play } from 'lucide-react';

type PieceType = 'red' | 'black' | 'red-king' | 'black-king' | null;
type Player = 'red' | 'black';

interface Position {
row: number;
col: number;
}

interface Move {
from: Position;
to: Position;
captures?: Position[];
}

const Checkers: React.FC = () => {
const [board, setBoard] = useState<PieceType[][]>(() => {
const initialBoard: PieceType[][] = Array(8).fill(null).map(() => Array(8).fill(null));

for (let row = 0; row < 3; row++) {
for (let col = 0; col < 8; col++) {
if ((row + col) % 2 === 1) {
initialBoard[row][col] = 'black';
}
}
}

for (let row = 5; row < 8; row++) {
for (let col = 0; col < 8; col++) {
if ((row + col) % 2 === 1) {
initialBoard[row][col] = 'red';
}
}
}

return initialBoard;
});

const [currentPlayer, setCurrentPlayer] = useState<Player>('red');
const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
const [validMoves, setValidMoves] = useState<Move[]>([]);
const [gameOver, setGameOver] = useState(false);
const [winner, setWinner] = useState<Player | null>(null);
const [redScore, setRedScore] = useState(0);
const [blackScore, setBlackScore] = useState(0);
const [isAIMode, setIsAIMode] = useState(true);
const [isAIThinking, setIsAIThinking] = useState(false);

const isKing = (piece: PieceType) => piece === 'red-king' || piece === 'black-king';
const getPlayerFromPiece = (piece: PieceType): Player | null => {
if (piece === 'red' || piece === 'red-king') return 'red';
if (piece === 'black' || piece === 'black-king') return 'black';
return null;
};

const getValidMoves = useCallback((row: number, col: number, piece: PieceType): Move[] => {
if (!piece) return [];

const moves: Move[] = [];
const player = getPlayerFromPiece(piece);
const directions = isKing(piece) 
? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
: player === 'red' 
? [[-1, -1], [-1, 1]]
: [[1, -1], [1, 1]];

directions.forEach(([dRow, dCol]) => {
const newRow = row + dRow;
const newCol = col + dCol;

if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && !board[newRow][newCol]) {
moves.push({ 
from: { row, col }, 
to: { row: newRow, col: newCol } 
});
}

const jumpRow = row + dRow * 2;
const jumpCol = col + dCol * 2;

if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8 && !board[jumpRow][jumpCol]) {
const middlePiece = board[newRow][newCol];
if (middlePiece && getPlayerFromPiece(middlePiece) !== player) {
moves.push({ 
from: { row, col }, 
to: { row: jumpRow, col: jumpCol },
captures: [{ row: newRow, col: newCol }]
});
}
}
});

return moves;
}, [board]);

const getAllValidMoves = useCallback((player: Player): Move[] => {
const allMoves: Move[] = [];

for (let row = 0; row < 8; row++) {
for (let col = 0; col < 8; col++) {
const piece = board[row][col];
if (piece && getPlayerFromPiece(piece) === player) {
const pieceMoves = getValidMoves(row, col, piece);
allMoves.push(...pieceMoves);
}
}
}

const captureMoves = allMoves.filter(move => move.captures && move.captures.length > 0);
return captureMoves.length > 0 ? captureMoves : allMoves;
}, [board, getValidMoves]);

const handleSquareClick = (row: number, col: number) => {
if (gameOver || (isAIMode && currentPlayer === 'black')) return;

const piece = board[row][col];

if (selectedPiece) {
const validMove = validMoves.find(move => 
move.to.row === row && move.to.col === col
);

if (validMove) {
makeMove(validMove);
} else if (piece && getPlayerFromPiece(piece) === currentPlayer) {
setSelectedPiece({ row, col });
setValidMoves(getValidMoves(row, col, piece));
} else {
setSelectedPiece(null);
setValidMoves([]);
}
} else if (piece && getPlayerFromPiece(piece) === currentPlayer) {
setSelectedPiece({ row, col });
setValidMoves(getValidMoves(row, col, piece));
}
};

const makeMove = (move: Move) => {
const newBoard = board.map(row => [...row]);
const piece = newBoard[move.from.row][move.from.col];

newBoard[move.to.row][move.to.col] = piece;
newBoard[move.from.row][move.from.col] = null;

if (move.captures) {
move.captures.forEach(capture => {
const capturedPiece = newBoard[capture.row][capture.col];
if (capturedPiece) {
newBoard[capture.row][capture.col] = null;

if (getPlayerFromPiece(capturedPiece) === 'red') {
setBlackScore(prev => prev + 1);
} else {
setRedScore(prev => prev + 1);
}
}
});
}

if (piece === 'red' && move.to.row === 0) {
newBoard[move.to.row][move.to.col] = 'red-king';
} else if (piece === 'black' && move.to.row === 7) {
newBoard[move.to.row][move.to.col] = 'black-king';
}

setBoard(newBoard);
setSelectedPiece(null);
setValidMoves([]);

const nextPlayer = currentPlayer === 'red' ? 'black' : 'red';
setCurrentPlayer(nextPlayer);
};

useEffect(() => {
if (isAIMode && currentPlayer === 'black' && !gameOver) {
setIsAIThinking(true);

const timer = setTimeout(() => {
const possibleMoves = getAllValidMoves('black');

if (possibleMoves.length > 0) {
const captureMoves = possibleMoves.filter(move => move.captures && move.captures.length > 0);
const moveToMake = captureMoves.length > 0 
? captureMoves[Math.floor(Math.random() * captureMoves.length)]
: possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

makeMove(moveToMake);
}

setIsAIThinking(false);
}, 800);

return () => clearTimeout(timer);
}
}, [currentPlayer, isAIMode, gameOver, getAllValidMoves]);

useEffect(() => {
const redMoves = getAllValidMoves('red');
const blackMoves = getAllValidMoves('black');

if (redMoves.length === 0) {
setGameOver(true);
setWinner('black');
} else if (blackMoves.length === 0) {
setGameOver(true);
setWinner('red');
}
}, [board, getAllValidMoves]);

const resetGame = () => {
const initialBoard: PieceType[][] = Array(8).fill(null).map(() => Array(8).fill(null));

for (let row = 0; row < 3; row++) {
for (let col = 0; col < 8; col++) {
if ((row + col) % 2 === 1) {
initialBoard[row][col] = 'black';
}
}
}

for (let row = 5; row < 8; row++) {
for (let col = 0; col < 8; col++) {
if ((row + col) % 2 === 1) {
initialBoard[row][col] = 'red';
}
}
}

setBoard(initialBoard);
setCurrentPlayer('red');
setSelectedPiece(null);
setValidMoves([]);
setGameOver(false);
setWinner(null);
setIsAIThinking(false);
setRedScore(0);
setBlackScore(0);
};

const toggleAIMode = () => {
setIsAIMode(!isAIMode);
resetGame();
};

const renderPiece = (piece: PieceType) => {
if (!piece) return null;

const baseClasses = "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110";

switch (piece) {
case 'red':
return <div className={`${baseClasses} bg-red-500 border-red-700 shadow-lg`} />;
case 'black':
return <div className={`${baseClasses} bg-gray-800 border-gray-900 shadow-lg`} />;
case 'red-king':
return (
<div className={`${baseClasses} bg-red-500 border-red-700 shadow-lg`}>
<Crown className="w-4 h-4 text-yellow-400" />
</div>
);
case 'black-king':
return (
<div className={`${baseClasses} bg-gray-800 border-gray-900 shadow-lg`}>
<Crown className="w-4 h-4 text-yellow-400" />
</div>
);
default:
return null;
}
};

return (
<div className="h-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center p-4">
<div className="flex space-x-6">
<div className="flex flex-col items-center">
<h1 className="text-2xl font-bold mb-4 text-amber-900 dark:text-amber-100 flex items-center space-x-2">
<span>🏁</span>
<span>Checkers</span>
</h1>

<div className="grid grid-cols-8 gap-0 border-4 border-amber-800 dark:border-amber-200 rounded-lg overflow-hidden shadow-2xl">
{board.map((row, rowIndex) =>
row.map((piece, colIndex) => {
const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
const isValidMove = validMoves.some(move => 
move.to.row === rowIndex && move.to.col === colIndex
);
const isDark = (rowIndex + colIndex) % 2 === 1;

return (
<div
key={`${rowIndex}-${colIndex}`}
onClick={() => handleSquareClick(rowIndex, colIndex)}
className={`w-12 h-12 flex items-center justify-center cursor-pointer relative transition-all duration-200 ${
isDark 
? 'bg-amber-800 dark:bg-amber-700' 
: 'bg-amber-200 dark:bg-amber-300'
} ${
isSelected ? 'ring-4 ring-blue-500 ring-inset' : ''
} ${
isValidMove ? 'ring-2 ring-green-500 ring-inset' : ''
} hover:brightness-110`}
>
{renderPiece(piece)}
{isValidMove && (
<div className="absolute inset-0 bg-green-500 bg-opacity-30 rounded-full m-1" />
)}
</div>
);
})
)}
</div>

<div className="mt-4 flex items-center space-x-2">
<button
onClick={toggleAIMode}
className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
isAIMode 
? 'bg-green-600 hover:bg-green-700 text-white' 
: 'bg-gray-600 hover:bg-gray-700 text-white'
}`}
>
{isAIMode ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
<span>{isAIMode ? 'vs AI' : 'vs Human'}</span>
</button>

<button
onClick={resetGame}
className="flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium"
>
<RotateCcw className="w-4 h-4" />
<span>New Game</span>
</button>
</div>
</div>

<div className="flex flex-col space-y-4 min-w-48">
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
<h3 className="font-bold mb-2 text-gray-900 dark:text-white">Current Turn</h3>
<div className="flex items-center space-x-2">
<div className={`w-4 h-4 rounded-full ${
currentPlayer === 'red' ? 'bg-red-500' : 'bg-gray-800'
}`}></div>
<span className={`font-medium ${
currentPlayer === 'red' ? 'text-red-600' : 'text-gray-800 dark:text-gray-200'
}`}>
{currentPlayer === 'red' ? 'Red Player' : (isAIMode ? 'AI' : 'Black Player')}
</span>
{isAIThinking && currentPlayer === 'black' && (
<span className="text-sm text-gray-500 animate-pulse">Thinking...</span>
)}
</div>
</div>

<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
<h3 className="font-bold mb-2 text-gray-900 dark:text-white">Captures</h3>
<div className="space-y-2">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-2">
<div className="w-4 h-4 bg-red-500 rounded-full"></div>
<span className="text-gray-900 dark:text-white">Red</span>
</div>
<span className="font-bold text-gray-900 dark:text-white">{redScore}</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center space-x-2">
<div className="w-4 h-4 bg-gray-800 rounded-full"></div>
<span className="text-gray-900 dark:text-white">Black</span>
</div>
<span className="font-bold text-gray-900 dark:text-white">{blackScore}</span>
</div>
</div>
</div>

{gameOver && (
<div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg shadow-lg text-center">
<h2 className="text-xl font-bold text-white mb-2">Game Over!</h2>
<p className="text-lg text-white mb-4">
{winner === 'red' ? '🔴 Red' : '⚫ Black'} Wins!
</p>
<button
onClick={resetGame}
className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 rounded-lg transition-colors mx-auto font-medium"
>
<Play className="w-4 h-4" />
<span>Play Again</span>
</button>
</div>
)}

<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
<h3 className="font-bold mb-2 text-gray-900 dark:text-white">Rules</h3>
<div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
<p>• Move diagonally on dark squares</p>
<p>• Jump over opponent pieces to capture</p>
<p>• Reach the opposite end to become a king</p>
<p>• Kings can move in all directions</p>
<p>• Win by capturing all opponent pieces</p>
</div>
</div>
</div>
</div>
</div>
);
};

export default Checkers;