import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';

interface Position {
x: number;
y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 0, y: -1 };

const Snake: React.FC = () => {
const [snake, setSnake] =useState<Position[]>(INITIAL_SNAKE);
const [food, setFood] = useState<Position>(INITIAL_FOOD);
const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
const [gameRunning, setGameRunning] = useState(false);
const [score, setScore] = useState(0);
const [highScore, setHighScore] = useState(() => {
return parseInt(localStorage.getItem('snake-high-score') || '0');
});
const [gameOver, setGameOver] = useState(false);

const generateFood = useCallback((snakeBody: Position[]) => {
let newFood: Position;
do {
newFood = {
x: Math.floor(Math.random() * GRID_SIZE),
y: Math.floor(Math.random() * GRID_SIZE)
};
} while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y));
return newFood;
}, []);

const resetGame = () => {
setSnake(INITIAL_SNAKE);
setFood(INITIAL_FOOD);
setDirection(INITIAL_DIRECTION);
setScore(0);
setGameOver(false);
setGameRunning(false);
};

const moveSnake = useCallback(() => {
if (!gameRunning || gameOver) return;

setSnake(currentSnake => {
const newSnake = [...currentSnake];
const head = { ...newSnake[0] };

head.x += direction.x;
head.y += direction.y;

if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
setGameOver(true);
setGameRunning(false);
return currentSnake;
}

if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
setGameOver(true);
setGameRunning(false);
return currentSnake;
}

newSnake.unshift(head);

if (head.x === food.x && head.y === food.y) {
setScore(prev => {
const newScore = prev + 10;
if (newScore > highScore) {
setHighScore(newScore);
localStorage.setItem('snake-high-score', newScore.toString());
}
return newScore;
});
setFood(generateFood(newSnake));
} else {
newSnake.pop();
}

return newSnake;
});
}, [direction, food, gameRunning, gameOver, generateFood, highScore]);

useEffect(() => {
const gameInterval = setInterval(moveSnake, 150);
return () => clearInterval(gameInterval);
}, [moveSnake]);

useEffect(() => {
const handleKeyPress = (e: KeyboardEvent) => {
if (!gameRunning) return;

switch (e.key) {
case 'ArrowUp':
if (direction.y !== 1) setDirection({ x: 0, y: -1 });
break;
case 'ArrowDown':
if (direction.y !== -1) setDirection({ x: 0, y: 1 });
break;
case 'ArrowLeft':
if (direction.x !== 1) setDirection({ x: -1, y: 0 });
break;
case 'ArrowRight':
if (direction.x !== -1) setDirection({ x: 1, y: 0 });
break;
}
};

window.addEventListener('keydown', handleKeyPress);
return () => window.removeEventListener('keydown', handleKeyPress);
}, [direction, gameRunning]);

const toggleGame = () => {
if (gameOver) {
resetGame();
} else {
setGameRunning(!gameRunning);
}
};

return (
<div className="h-full bg-gray-900 text-white flex flex-col items-center justify-center p-4">
<div className="mb-4 text-center">
<h1 className="text-3xl font-bold mb-2">🐍 Snake Game</h1>
<div className="flex items-center justify-center space-x-6 text-lg">
<div className="flex items-center space-x-2">
<span>Score: {score}</span>
</div>
<div className="flex items-center space-x-2">
<Trophy className="w-5 h-5 text-yellow-500" />
<span>High: {highScore}</span>
</div>
</div>
</div>

<div className="relative">
<div 
className="grid gap-0 border-2 border-gray-600 bg-gray-800"
style={{
gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
width: '400px',
height: '400px'
}}
>
{Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
const x = index % GRID_SIZE;
const y = Math.floor(index / GRID_SIZE);

const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
const isFood = food.x === x && food.y === y;

return (
<div
key={index}
className={`w-5 h-5 ${
isSnakeHead ? 'bg-green-400' :
isSnakeBody ? 'bg-green-600' :
isFood ? 'bg-red-500' :
'bg-gray-800'
}`}
/>
);
})}
</div>

{gameOver && (
<div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
<div className="text-center">
<h2 className="text-2xl font-bold mb-2">Game Over!</h2>
<p className="text-lg mb-4">Final Score: {score}</p>
{score === highScore && score > 0 && (
<p className="text-yellow-500 mb-4">🎉 New High Score!</p>
)}
</div>
</div>
)}
</div>

<div className="mt-4 flex items-center space-x-4">
<button
onClick={toggleGame}
className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
>
{gameOver ? (
<>
<RotateCcw className="w-5 h-5" />
<span>Play Again</span>
</>
) : gameRunning ? (
<>
<Pause className="w-5 h-5" />
<span>Pause</span>
</>
) : (
<>
<Play className="w-5 h-5" />
<span>Start</span>
</>
)}
</button>

<button
onClick={resetGame}
className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
>
<RotateCcw className="w-5 h-5" />
<span>Reset</span>
</button>
</div>

<div className="mt-4 text-center text-sm text-gray-400">
<p>Use arrow keys to control the snake</p>
<p>Eat the red food to grow and increase your score</p>
</div>
</div>
);
};

export default Snake;