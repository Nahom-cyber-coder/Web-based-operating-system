import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const EMPTY_CELL = 0;

const TETROMINOES = {
I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-500' },
O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-500' },
T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500' },
S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' },
Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500' },
J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500' },
L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500' }
};

interface Piece {
shape: number[][];
x: number;
y: number;
type: keyof typeof TETROMINOES;
}

const Tetris: React.FC = () => {
const [board, setBoard] = useState<number[][]>(() =>
Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL))
);
const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
const [nextPiece, setNextPiece] = useState<keyof typeof TETROMINOES>('I');
const [score, setScore] = useState(0);
const [level, setLevel] = useState(1);
const [lines, setLines] = useState(0);
const [gameRunning, setGameRunning] = useState(false);
const [gameOver, setGameOver] = useState(false);
const [highScore, setHighScore] = useState(() => {
return parseInt(localStorage.getItem('tetris-high-score') || '0');
});

const getRandomPiece = (): keyof typeof TETROMINOES => {
const pieces = Object.keys(TETROMINOES) as (keyof typeof TETROMINOES)[];
return pieces[Math.floor(Math.random() * pieces.length)];
};

const createPiece = (type: keyof typeof TETROMINOES): Piece => ({
shape: TETROMINOES[type].shape,
x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOES[type].shape[0].length / 2),
y: 0,
type
});

useEffect(() => {
if (!currentPiece && !gameOver) {
setCurrentPiece(createPiece(getRandomPiece()));
setNextPiece(getRandomPiece());
}
}, [currentPiece, gameOver]);
const isValidMove = (piece: Piece, newX: number, newY: number, newShape?: number[][]) => {
const shape = newShape || piece.shape;

for (let y = 0; y < shape.length; y++) {
for (let x = 0; x < shape[y].length; x++) {
if (shape[y][x]) {
const boardX = newX + x;
const boardY = newY + y;

if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
return false;
}

if (boardY >= 0 && board[boardY][boardX] !== EMPTY_CELL) {
return false;
}
}
}
}
return true;
};

const rotatePiece = (shape: number[][]): number[][] => {
const rotated = shape[0].map((_, index) =>
shape.map(row => row[index]).reverse()
);
return rotated;
};

const placePiece = useCallback(() => {
if (!currentPiece) return;

const newBoard = board.map(row => [...row]);

currentPiece.shape.forEach((row, y) => {
row.forEach((cell, x) => {
if (cell) {
const boardY = currentPiece.y + y;
const boardX = currentPiece.x + x;
if (boardY >= 0) {
newBoard[boardY][boardX] = 1;
}
}
});
});

let linesCleared = 0;
for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
if (newBoard[y].every(cell => cell !== EMPTY_CELL)) {
newBoard.splice(y, 1);
newBoard.unshift(Array(BOARD_WIDTH).fill(EMPTY_CELL));
linesCleared++;
y++;
}
}

if (linesCleared > 0) {
const points = [0, 40, 100, 300, 1200][linesCleared] * level;
setScore(prev => {
const newScore = prev + points;
if (newScore > highScore) {
setHighScore(newScore);
localStorage.setItem('tetris-high-score', newScore.toString());
}
return newScore;
});
setLines(prev => {
const newLines = prev + linesCleared;
setLevel(Math.floor(newLines / 10) + 1);
return newLines;
});
}

setBoard(newBoard);

const newPiece = createPiece(nextPiece);
if (!isValidMove(newPiece, newPiece.x, newPiece.y)) {
setGameOver(true);
setGameRunning(false);
} else {
setCurrentPiece(newPiece);
setNextPiece(getRandomPiece());
}
}, [currentPiece, board, nextPiece, level, highScore]);

const movePiece = useCallback((dx: number, dy: number) => {
if (!currentPiece || !gameRunning) return;

const newX = currentPiece.x + dx;
const newY = currentPiece.y + dy;

if (isValidMove(currentPiece, newX, newY)) {
setCurrentPiece(prev => prev ? { ...prev, x: newX, y: newY } : null);
} else if (dy > 0) {
placePiece();
}
}, [currentPiece, gameRunning, isValidMove, placePiece]);

const rotatePieceHandler = useCallback(() => {
if (!currentPiece || !gameRunning) return;

const rotatedShape = rotatePiece(currentPiece.shape);
if (isValidMove(currentPiece, currentPiece.x, currentPiece.y, rotatedShape)) {
setCurrentPiece(prev => prev ? { ...prev, shape: rotatedShape } : null);
}
}, [currentPiece, gameRunning, isValidMove]);

const dropPiece = useCallback(() => {
if (!currentPiece || !gameRunning) return;

let newY = currentPiece.y;
while (isValidMove(currentPiece, currentPiece.x, newY + 1)) {
newY++;
}
setCurrentPiece(prev => prev ? { ...prev, y: newY } : null);
setTimeout(placePiece, 100);
}, [currentPiece, gameRunning, isValidMove, placePiece]);

useEffect(() => {
const gameInterval = setInterval(() => {
movePiece(0, 1);
}, Math.max(50, 500 - (level - 1) * 50));

return () => clearInterval(gameInterval);
}, [movePiece, level]);

useEffect(() => {
const handleKeyPress = (e: KeyboardEvent) => {
if (!gameRunning) return;

switch (e.key) {
case 'ArrowLeft':
movePiece(-1, 0);
break;
case 'ArrowRight':
movePiece(1, 0);
break;
case 'ArrowDown':
movePiece(0, 1);
break;
case 'ArrowUp':
rotatePieceHandler();
break;
case ' ':
e.preventDefault();
dropPiece();
break;
}
};

window.addEventListener('keydown', handleKeyPress);
return () => window.removeEventListener('keydown', handleKeyPress);
}, [movePiece, rotatePieceHandler, dropPiece, gameRunning]);

const startGame = () => {
setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL)));
setCurrentPiece(createPiece(getRandomPiece()));
setNextPiece(getRandomPiece());
setScore(0);
setLevel(1);
setLines(0);
setGameOver(false);
setGameRunning(true);
};

const toggleGame = () => {
if (gameOver) {
startGame();
} else {
setGameRunning(!gameRunning);
}
};

const renderBoard = () => {
const displayBoard = board.map(row => [...row]);

if (currentPiece) {
currentPiece.shape.forEach((row, y) => {
row.forEach((cell, x) => {
if (cell) {
const boardY = currentPiece.y + y;
const boardX = currentPiece.x + x;
if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
displayBoard[boardY][boardX] = 2;
}
}
});
});
}

return displayBoard.map((row, y) => (
<div key={y} className="flex">
{row.map((cell, x) => (
<div
key={x}
className={`w-6 h-6 border border-gray-600 ${
cell === 2 && currentPiece ? TETROMINOES[currentPiece.type].color :
cell === 1 ? 'bg-gray-400' :
'bg-gray-900'
}`}
/>
))}
</div>
));
};

return (
<div className="h-full bg-gray-800 text-white flex items-center justify-center p-4">
<div className="flex space-x-6">
<div className="flex flex-col items-center">
<h1 className="text-2xl font-bold mb-4">🧩 Tetris</h1>

<div className="relative border-2 border-gray-600">
{renderBoard()}

{gameOver && (
<div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
<div className="text-center">
<h2 className="text-xl font-bold mb-2">Game Over!</h2>
<p className="mb-2">Score: {score}</p>
{score === highScore && score > 0 && (
<p className="text-yellow-500">🎉 New High Score!</p>
)}
</div>
</div>
)}
</div>

<div className="mt-4 flex space-x-2">
<button
onClick={toggleGame}
className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
>
{gameOver ? (
<>
<RotateCcw className="w-4 h-4" />
<span>New Game</span>
</>
) : gameRunning ? (
<>
<Pause className="w-4 h-4" />
<span>Pause</span>
</>
) : (
<>
<Play className="w-4 h-4" />
<span>Start</span>
</>
)}
</button>
</div>
</div>

<div className="flex flex-col space-y-4">
<div className="bg-gray-700 p-4 rounded">
<h3 className="font-bold mb-2">Stats</h3>
<div className="space-y-1 text-sm">
<div>Score: {score}</div>
<div className="flex items-center">
<Trophy className="w-4 h-4 text-yellow-500 mr-1" />
High: {highScore}
</div>
<div>Level: {level}</div>
<div>Lines: {lines}</div>
</div>
</div>

<div className="bg-gray-700 p-4 rounded">
<h3 className="font-bold mb-2">Next</h3>
<div className="flex flex-col">
{TETROMINOES[nextPiece].shape.map((row, y) => (
<div key={y} className="flex">
{row.map((cell, x) => (
<div
key={x}
className={`w-4 h-4 border border-gray-600 ${
cell ? TETROMINOES[nextPiece].color : 'bg-gray-800'
}`}
/>
))}
</div>
))}
</div>
</div>

<div className="bg-gray-700 p-4 rounded text-sm">
<h3 className="font-bold mb-2">Controls</h3>
<div className="space-y-1">
<div>← → Move</div>
<div>↓ Soft drop</div>
<div>↑ Rotate</div>
<div>Space Hard drop</div>
</div>
</div>
</div>
</div>
</div>
);
};

export default Tetris;